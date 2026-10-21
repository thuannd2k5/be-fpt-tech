import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Classroom, ClassroomDocument } from './schemas/classroom.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';
import { Enrollment, EnrollmentDocument } from '../enrollments/schemas/enrollment.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectModel(Classroom.name) private classroomModel: SoftDeleteModel<ClassroomDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel: SoftDeleteModel<EnrollmentDocument>,
    @InjectModel(Course.name) private courseModel: SoftDeleteModel<CourseDocument>,
  ) { }

  private async syncCapacityStatus(classroom: { _id: mongoose.Types.ObjectId; status: string; max_student: string }) {
    if (!['OPEN', 'FULL'].includes(classroom.status)) return classroom.status;
    const capacity = Number(classroom.max_student);
    if (!Number.isFinite(capacity) || capacity <= 0) return classroom.status;

    const enrolledCount = await this.enrollmentModel.countDocuments({
      class_id: classroom._id,
      status: { $ne: 'CANCELLED' },
    });
    const status = enrolledCount >= capacity ? 'FULL' : 'OPEN';
    if (status !== classroom.status) {
      await this.classroomModel.updateOne({ _id: classroom._id }, { status }).exec();
    }
    return status;
  }

  async create(createClassroomDto: CreateClassroomDto, user: IUser) {
    return await this.classroomModel.create({ ...createClassroomDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current; delete filter.pageSize;
    const defaultLimit = +limit || 10; const current = +currentPage || 1;
    const totalItems = await this.classroomModel.countDocuments(filter);
    const result = await this.classroomModel.find(filter)
      .select(projection)
      .skip((current - 1) * defaultLimit)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate({ path: 'course_id', select: 'name description level duration' })
      .populate({ path: 'teacher_id', select: 'name email phone' })
      .populate(population)
      .exec();
    const statuses = await Promise.all(result.map(classroom => this.syncCapacityStatus(classroom)));
    result.forEach((classroom, index) => {
      classroom.status = statuses[index] as typeof classroom.status;
    });
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found classroom';
    const classroom = await this.classroomModel.findOne({ _id: id }).populate('course_id teacher_id');
    if (classroom) {
      classroom.status = await this.syncCapacityStatus(classroom) as typeof classroom.status;
    }
    return classroom;
  }

  async findOpenForCourse(courseId: string) {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('ID khóa học không hợp lệ.');
    }
    const course = await this.courseModel.findById(courseId).select('status').lean().exec();
    if (course?.status?.toUpperCase() === 'INACTIVE') return [];

    const classrooms = await this.classroomModel.find({ course_id: courseId, status: { $in: ['OPEN', 'FULL'] } })
      .select('class_name room start_date end_date start_time end_time status max_student')
      .sort({ start_date: 1, start_time: 1 })
      .exec();
    const available = [];
    for (const classroom of classrooms) {
      const status = await this.syncCapacityStatus(classroom);
      classroom.status = status as typeof classroom.status;
      if (status === 'OPEN') available.push(classroom);
    }
    return available;
  }

  async findTeaching(user: IUser) {
    const classrooms = await this.classroomModel.find({ teacher_id: user._id })
      .populate('course_id teacher_id', 'name email')
      .sort({ start_time: 1 })
      .exec();
    await Promise.all(classrooms.map(async classroom => {
      classroom.status = await this.syncCapacityStatus(classroom) as typeof classroom.status;
    }));
    return classrooms;
  }

  async update(updateClassroomDto: UpdateClassroomDto, user: IUser) {
    return await this.classroomModel.updateOne({ _id: updateClassroomDto._id }, { ...updateClassroomDto, updatedBy: { _id: user._id, email: user.email } });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found classroom';
    await this.classroomModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    return await this.classroomModel.delete({ _id: id });
  }
}
