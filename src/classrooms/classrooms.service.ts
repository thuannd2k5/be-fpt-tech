import { Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Classroom, ClassroomDocument } from './schemas/classroom.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class ClassroomsService {
  constructor(@InjectModel(Classroom.name) private classroomModel: SoftDeleteModel<ClassroomDocument>) { }

  create(createClassroomDto: CreateClassroomDto, user: IUser) {
    return this.classroomModel.create({ ...createClassroomDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current; delete filter.pageSize;
    const defaultLimit = +limit || 10; const current = +currentPage || 1;
    const totalItems = await this.classroomModel.countDocuments(filter);
    const result = await this.classroomModel.find(filter).select(projection).skip((current - 1) * defaultLimit).limit(defaultLimit).sort(sort as any).populate(population).exec();
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found classroom';
    return this.classroomModel.findOne({ _id: id }).populate('course_id teacher_id');
  }

  update(updateClassroomDto: UpdateClassroomDto, user: IUser) {
    return this.classroomModel.updateOne({ _id: updateClassroomDto._id }, { ...updateClassroomDto, updatedBy: { _id: user._id, email: user.email } });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found classroom';
    await this.classroomModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    return this.classroomModel.delete({ _id: id });
  }
}
