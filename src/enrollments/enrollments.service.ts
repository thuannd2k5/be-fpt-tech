import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class EnrollmentsService {
  constructor(@InjectModel(Enrollment.name) private enrollmentModel: SoftDeleteModel<EnrollmentDocument>) { }

  create(createEnrollmentDto: CreateEnrollmentDto, user: IUser) {
    return this.enrollmentModel.create({ ...createEnrollmentDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current; delete filter.pageSize;
    const defaultLimit = +limit || 10; const current = +currentPage || 1;
    const totalItems = await this.enrollmentModel.countDocuments(filter);
    const result = await this.enrollmentModel.find(filter).select(projection).skip((current - 1) * defaultLimit).limit(defaultLimit).sort(sort as any).populate(population).exec();
    return { meta: { current, pageSize: defaultLimit, pages: Math.ceil(totalItems / defaultLimit), total: totalItems }, result };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found enrollment';
    return this.enrollmentModel.findOne({ _id: id }).populate('student_id class_id');
  }

  update(updateEnrollmentDto: UpdateEnrollmentDto, user: IUser) {
    return this.enrollmentModel.updateOne({ _id: updateEnrollmentDto._id }, { ...updateEnrollmentDto, updatedBy: { _id: user._id, email: user.email } });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found enrollment';
    await this.enrollmentModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    return this.enrollmentModel.delete({ _id: id });
  }
}
