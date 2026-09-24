import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';
import {
  Classroom,
  ClassroomDocument,
} from '../classrooms/schemas/classroom.schema';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: SoftDeleteModel<EnrollmentDocument>,
    @InjectModel(Classroom.name)
    private classroomModel: SoftDeleteModel<ClassroomDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: SoftDeleteModel<InvoiceDocument>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto, user: IUser) {
    const roleName = user.role?.name?.trim().toUpperCase();
    const isManager = roleName === 'MANAGER' || roleName === 'QUAN LY';
    if (
      !isManager &&
      String(createEnrollmentDto.student_id) !== String(user._id)
    ) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đăng ký cho tài khoản của mình',
      );
    }

    const existingEnrollment = await this.enrollmentModel.findOne({
      student_id: createEnrollmentDto.student_id,
      class_id: createEnrollmentDto.class_id,
    });
    if (existingEnrollment) {
      throw new BadRequestException('Học viên đã đăng ký lớp học này');
    }

    const enrollment = await this.enrollmentModel.create({
      ...createEnrollmentDto,
      createdBy: { _id: user._id, email: user.email },
    });
    const classroom = await this.classroomModel
      .findById(createEnrollmentDto.class_id)
      .populate({ path: 'course_id', select: 'price' })
      .lean()
      .exec();
    const coursePrice = Number(
      (classroom?.course_id as { price?: string | number } | undefined)
        ?.price || 0,
    );
    await this.invoiceModel.create({
      enrollment_id: enrollment._id,
      amount: coursePrice,
      final_amount: coursePrice,
      discount_amount: 0,
      status: 'UNPAID',
      createdBy: { _id: user._id, email: user.email },
    });
    return enrollment;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 10;
    const current = +currentPage || 1;
    const totalItems = await this.enrollmentModel.countDocuments(filter);
    const result = await this.enrollmentModel
      .find(filter)
      .select(projection)
      .skip((current - 1) * defaultLimit)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate({
        path: 'student_id',
        select: 'name email phone age gender address',
      })
      .populate('class_id')
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found enrollment';
    return await this.enrollmentModel
      .findOne({ _id: id })
      .populate('student_id class_id');
  }

  async findMine(user: IUser) {
    return this.enrollmentModel
      .find({ student_id: user._id })
      .populate({
        path: 'class_id',
        populate: [
          { path: 'course_id' },
          { path: 'teacher_id', select: 'name email' },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findStudentsForTeacher(user: IUser) {
    const classrooms = await this.classroomModel
      .find({ teacher_id: user._id })
      .select('_id')
      .lean()
      .exec();
    const classroomIds = classrooms.map((item) => item._id);
    return this.enrollmentModel
      .find({ class_id: { $in: classroomIds } })
      .populate('student_id', 'name email phone')
      .populate({
        path: 'class_id',
        populate: { path: 'course_id', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(updateEnrollmentDto: UpdateEnrollmentDto, user: IUser) {
    return await this.enrollmentModel.updateOne(
      { _id: updateEnrollmentDto._id },
      {
        ...updateEnrollmentDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found enrollment';
    await this.enrollmentModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } },
    );
    return await this.enrollmentModel.delete({ _id: id });
  }
}
