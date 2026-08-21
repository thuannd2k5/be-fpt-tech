import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: SoftDeleteModel<CourseDocument>) { }

  create(createCourseDto: CreateCourseDto, user: IUser) {
    return this.courseModel.create({ ...createCourseDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 10;
    const offset = ((+currentPage || 1) - 1) * defaultLimit;
    const totalItems = await this.courseModel.countDocuments(filter);
    const result = await this.courseModel.find(filter).skip(offset).limit(defaultLimit)
      .sort(sort as any).populate(population).exec();
    return { meta: { current: +currentPage || 1, pageSize: defaultLimit, pages: Math.ceil(totalItems / defaultLimit), total: totalItems }, result };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found course';
    return this.courseModel.findOne({ _id: id });
  }

  update(updateCourseDto: UpdateCourseDto, user: IUser) {
    return this.courseModel.updateOne({ _id: updateCourseDto._id }, {
      ...updateCourseDto,
      updatedBy: { _id: user._id, email: user.email }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found course';
    await this.courseModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    return this.courseModel.delete({ _id: id });
  }
}
