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

  private userPopulateOptions() {
    return [
      {
        path: 'participants',
        select: '_id name email role phone avatar status',
        populate: { path: 'role', select: '_id name' },
      },
      {
        path: 'participant_id',
        select: '_id name email role phone avatar status',
        populate: { path: 'role', select: '_id name' },
      },
    ];
  }

  async create(createConversationDto: CreateConversationDto, user: IUser) {
    const userIdStr = String(user._id);
    const userObjId = mongoose.Types.ObjectId.isValid(userIdStr) ? new mongoose.Types.ObjectId(userIdStr) : null;

    let targetIdStr = createConversationDto.participant_id;
    if (!targetIdStr && Array.isArray(createConversationDto.participants)) {
      targetIdStr = createConversationDto.participants.find(p => p && String(p) !== userIdStr);
    }
    const targetObjId = (targetIdStr && mongoose.Types.ObjectId.isValid(targetIdStr)) ? new mongoose.Types.ObjectId(String(targetIdStr)) : null;

    // Tìm kiếm hội thoại 1-1 đã có sẵn
    if (targetObjId && (!createConversationDto.type || createConversationDto.type === 'DIRECT')) {
      const orConditions: any[] = [];
      if (userObjId) {
        orConditions.push(
          { participants: { $all: [userObjId, targetObjId] } },
          { participant_id: targetObjId, 'createdBy._id': userObjId },
          { participant_id: userObjId, 'createdBy._id': targetObjId },
        );
      }
      orConditions.push(
        { participants: { $all: [userIdStr, String(targetIdStr)] } },
        { participant_id: String(targetIdStr), 'createdBy._id': userObjId || userIdStr },
      );

      const existing = await this.conversationModel
        .findOne({ $or: orConditions })
        .populate(this.userPopulateOptions());
      if (existing) {
        return existing;
      }
    }

    // Xây dựng danh sách participants hợp lệ
    const validIdsSet = new Set<string>();
    if (userObjId) validIdsSet.add(userIdStr);
    if (targetObjId) validIdsSet.add(String(targetIdStr));

    if (Array.isArray(createConversationDto.participants)) {
      for (const p of createConversationDto.participants) {
        if (p && mongoose.Types.ObjectId.isValid(p)) {
          validIdsSet.add(String(p));
        }
      }
    }

    const participantsArray = Array.from(validIdsSet).map(id => new mongoose.Types.ObjectId(id));

    const created = await this.conversationModel.create({
      title: createConversationDto.title || 'Cuộc trò chuyện',
      type: createConversationDto.type || 'DIRECT',
      participant_id: targetObjId || undefined,
      participants: participantsArray,
      createdBy: { _id: userObjId || user._id, email: user.email },
    });

    return await this.conversationModel
      .findById(created._id)
      .populate(this.userPopulateOptions());
  }

  async findMyConversations(user: IUser) {
    if (!user?._id) return [];
    const userIdStr = String(user._id);
    const userObjId = mongoose.Types.ObjectId.isValid(userIdStr) ? new mongoose.Types.ObjectId(userIdStr) : null;

    const conditions: any[] = [
      { participants: userIdStr },
      { participant_id: userIdStr },
      { 'createdBy._id': userIdStr },
    ];
    if (userObjId) {
      conditions.push(
        { participants: userObjId },
        { participant_id: userObjId },
        { 'createdBy._id': userObjId },
      );
    }

    return await this.conversationModel
      .find({ $or: conditions })
      .sort({ updatedAt: -1, last_message_at: -1 })
      .populate(this.userPopulateOptions())
      .exec();
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
      .populate(this.userPopulateOptions())
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
      .populate(this.userPopulateOptions());
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
