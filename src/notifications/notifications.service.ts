import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: SoftDeleteModel<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, user: IUser) {
    const senderId = createNotificationDto.sender_id || user._id;
    return await this.notificationModel.create({
      ...createNotificationDto,
      sender_id: senderId,
      createdBy: { _id: user._id, email: user.email },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 10;
    const current = +currentPage || 1;
    const totalItems = await this.notificationModel.countDocuments(filter);
    const result = await this.notificationModel
      .find(filter)
      .select(projection)
      .skip((current - 1) * defaultLimit)
      .limit(defaultLimit)
      .sort(sort as any)
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found notification';
    return await this.notificationModel
      .findOne({ _id: id })
      .populate('sender_id receiver_id');
  }

  async update(updateNotificationDto: UpdateNotificationDto, user: IUser) {
    return await this.notificationModel.updateOne(
      { _id: updateNotificationDto._id },
      {
        ...updateNotificationDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found notification';
    await this.notificationModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } },
    );
    return await this.notificationModel.delete({ _id: id });
  }
}
