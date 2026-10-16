import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Conversation, ConversationDocument } from '../conversations/schemas/conversation.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: SoftDeleteModel<MessageDocument>,

    @InjectModel(Conversation.name)
    private conversationModel: SoftDeleteModel<ConversationDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto, user: IUser) {
    const senderId = createMessageDto.sender_id || user._id;
    const newMessage = await this.messageModel.create({
      ...createMessageDto,
      sender_id: senderId,
      createdBy: { _id: user._id, email: user.email },
    });

    // Cập nhật tin nhắn gần nhất vào conversation
    if (createMessageDto.conversation_id) {
      await this.conversationModel.updateOne(
        { _id: createMessageDto.conversation_id },
        {
          last_message: createMessageDto.content,
          last_message_at: new Date(),
          updatedBy: { _id: user._id, email: user.email },
        },
      );
    }

    return newMessage;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 1000;
    const current = +currentPage || 1;
    const totalItems = await this.messageModel.countDocuments(filter);
    const result = await this.messageModel
      .find(filter)
      .select(projection)
      .skip((current - 1) * defaultLimit)
      .limit(defaultLimit)
      .sort((sort as any) || { createdAt: 1 })
      .populate(population)
      .exec();

    return {
      meta: {
        current,
        pageSize: defaultLimit,
        pages: Math.ceil(totalItems / defaultLimit),
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found message';
    return await this.messageModel
      .findOne({ _id: id })
      .populate('sender_id conversation_id');
  }

  async update(updateMessageDto: UpdateMessageDto, user: IUser) {
    return await this.messageModel.updateOne(
      { _id: updateMessageDto._id },
      {
        ...updateMessageDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found message';
    await this.messageModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } },
    );
    return await this.messageModel.delete({ _id: id });
  }
}
