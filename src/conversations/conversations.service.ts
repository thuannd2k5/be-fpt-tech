import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: SoftDeleteModel<ConversationDocument>,
  ) {}

  async create(createConversationDto: CreateConversationDto, user: IUser) {
    const participantsSet = new Set<string>(createConversationDto.participants || []);
    participantsSet.add(user._id);
    if (createConversationDto.participant_id) {
      participantsSet.add(createConversationDto.participant_id);
    }

    const participantsArray = Array.from(participantsSet);

    return await this.conversationModel.create({
      ...createConversationDto,
      participants: participantsArray,
      createdBy: { _id: user._id, email: user.email },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 10;
    const current = +currentPage || 1;
    const totalItems = await this.conversationModel.countDocuments(filter);
    const result = await this.conversationModel
      .find(filter)
      .select(projection)
      .skip((current - 1) * defaultLimit)
      .limit(defaultLimit)
      .sort((sort as any) || { updatedAt: -1 })
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found conversation';
    return await this.conversationModel
      .findOne({ _id: id })
      .populate('participants participant_id');
  }

  async update(updateConversationDto: UpdateConversationDto, user: IUser) {
    return await this.conversationModel.updateOne(
      { _id: updateConversationDto._id },
      {
        ...updateConversationDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found conversation';
    await this.conversationModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } },
    );
    return await this.conversationModel.delete({ _id: id });
  }
}
