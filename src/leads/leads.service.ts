import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead.name) private leadModel: SoftDeleteModel<LeadDocument>) { }

  create(createLeadDto: CreateLeadDto, user: IUser) {
    return this.leadModel.create({
      ...createLeadDto,
      createdBy: { _id: user._id, email: user.email }
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const defaultLimit = +limit || 10;
    const current = +currentPage || 1;
    const totalItems = await this.leadModel.countDocuments(filter);
    const result = await this.leadModel.find(filter)
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
        total: totalItems
      },
      result
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found lead';
    return this.leadModel.findOne({ _id: id }).populate('consultant_id');
  }

  update(updateLeadDto: UpdateLeadDto, user: IUser) {
    return this.leadModel.updateOne({ _id: updateLeadDto._id }, {
      ...updateLeadDto,
      updatedBy: { _id: user._id, email: user.email }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found lead';

    await this.leadModel.updateOne({ _id: id }, {
      deletedBy: { _id: user._id, email: user.email }
    });
    return this.leadModel.delete({ _id: id });
  }
}
