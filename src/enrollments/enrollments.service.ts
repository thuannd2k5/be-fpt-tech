import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment, EnrollmentDocument, EnrollmentStatus } from './schemas/enrollment.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';
import { Classroom, ClassroomDocument } from '../classrooms/schemas/classroom.schema';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { STUDENT_ROLE, USER_ROLE } from '../databases/sample';
import { Course, CourseDocument } from '../courses/schemas/course.schema';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: SoftDeleteModel<EnrollmentDocument>,
    @InjectModel(Classroom.name) private classroomModel: SoftDeleteModel<ClassroomDocument>,
    @InjectModel(Invoice.name) private invoiceModel: SoftDeleteModel<InvoiceDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Course.name) private courseModel: SoftDeleteModel<CourseDocument>,
  ) { }

  async create(createEnrollmentDto: CreateEnrollmentDto, user: IUser) {
    await this.ensureNotEnrolledInCourse(createEnrollmentDto.student_id, createEnrollmentDto.class_id);
    await this.ensureClassHasSpace(createEnrollmentDto.class_id);
    const enrollment = await this.createEnrollment(createEnrollmentDto, user);
    await this.updateClassCapacityStatus(createEnrollmentDto.class_id);
    return enrollment;
  }

  async registerForSelf(createEnrollmentDto: CreateEnrollmentDto, user: IUser) {
    if (String(createEnrollmentDto.student_id) !== String(user._id)) {
      throw new ForbiddenException('Bạn chỉ có thể đăng ký khóa học cho tài khoản của mình.');
    }

    const currentUser = await this.userModel.findById(user._id)
      .populate({ path: 'role', select: 'name' })
      .exec();
    const roleName = (currentUser?.role as unknown as { name?: string } | undefined)?.name
      ?.trim()
      .toUpperCase();

    if (roleName !== STUDENT_ROLE && roleName !== USER_ROLE) {
      throw new ForbiddenException('Chỉ tài khoản học viên mới được đăng ký khóa học.');
    }

    const classroom = await this.classroomModel.findOne({
      _id: createEnrollmentDto.class_id,
      status: 'OPEN',
    }).exec();
    if (!classroom) {
      throw new BadRequestException('Lớp học không tồn tại hoặc đã ngừng tuyển sinh.');
    }

    await this.ensureNotEnrolledInCourse(String(user._id), createEnrollmentDto.class_id);
    await this.ensureClassHasSpace(createEnrollmentDto.class_id);

    let studentRole = null;
    if (roleName === USER_ROLE) {
      studentRole = await this.roleModel.findOne({ name: STUDENT_ROLE }).exec();
      if (!studentRole) {
        studentRole = await this.roleModel.create({
          name: STUDENT_ROLE,
          description: 'Học viên đã đăng ký khóa học',
          isActive: true,
          permissions: [],
        });
      }
    }

    const enrollment = await this.createEnrollment({
      ...createEnrollmentDto,
      status: EnrollmentStatus.WAITING_PAYMENT,
    }, user);
    await this.updateClassCapacityStatus(createEnrollmentDto.class_id);
    if (studentRole) {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          role: studentRole._id,
          updatedBy: { _id: user._id, email: user.email },
        }
      ).exec();
    }
    return enrollment;
  }

  private async createEnrollment(createEnrollmentDto: CreateEnrollmentDto, user: IUser) {
    const enrollment = await this.enrollmentModel.create({ ...createEnrollmentDto, createdBy: { _id: user._id, email: user.email } });
    const classroom = await this.classroomModel.findById(createEnrollmentDto.class_id)
      .populate({ path: 'course_id', select: 'price' })
      .lean()
      .exec();
    const coursePrice = Number((classroom?.course_id as { price?: string | number } | undefined)?.price || 0);
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

  private async ensureNotEnrolledInCourse(studentId: string, classroomId: string) {
    const classroom = await this.classroomModel.findById(classroomId).select('course_id').lean().exec();
    if (!classroom) {
      throw new BadRequestException('Lớp học không tồn tại.');
    }
    const classroomsForCourse = await this.classroomModel.find({ course_id: classroom.course_id })
      .select('_id')
      .lean()
      .exec();
    const existingEnrollment = await this.enrollmentModel.findOne({
      student_id: studentId,
      class_id: { $in: classroomsForCourse.map(item => item._id) },
      status: { $ne: 'CANCELLED' },
    }).exec();
    if (existingEnrollment) {
      throw new BadRequestException('Học viên đã đăng ký khóa học này.');
    }
  }

  private async ensureClassHasSpace(classroomId: string) {
    const classroom = await this.classroomModel.findById(classroomId).select('status max_student course_id').lean().exec();
    if (!classroom || classroom.status !== 'OPEN') {
      throw new BadRequestException('Lớp học không còn nhận đăng ký.');
    }

    const course = await this.courseModel.findById(classroom.course_id).select('status').lean().exec();
    if (course?.status?.toUpperCase() === 'INACTIVE') {
      throw new BadRequestException('Khóa học đã đóng và không còn nhận đăng ký.');
    }

    const capacity = Number(classroom.max_student);
    if (!Number.isFinite(capacity) || capacity <= 0) return;

    const enrolledCount = await this.enrollmentModel.countDocuments({
      class_id: classroomId,
      status: { $ne: 'CANCELLED' },
    });
    if (enrolledCount >= capacity) {
      await this.classroomModel.updateOne({ _id: classroomId, status: 'OPEN' }, { status: 'FULL' }).exec();
      throw new BadRequestException('Lớp học đã đủ số lượng học viên.');
    }
  }

  private async updateClassCapacityStatus(classroomId: string) {
    const classroom = await this.classroomModel.findById(classroomId).select('status max_student').lean().exec();
    if (!classroom || !['OPEN', 'FULL'].includes(classroom.status)) return;

    const capacity = Number(classroom.max_student);
    if (!Number.isFinite(capacity) || capacity <= 0) return;

    const enrolledCount = await this.enrollmentModel.countDocuments({
      class_id: classroomId,
      status: { $ne: 'CANCELLED' },
    });
    const status = enrolledCount >= capacity ? 'FULL' : 'OPEN';
    if (classroom.status !== status) {
      await this.classroomModel.updateOne({ _id: classroomId }, { status }).exec();
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current; delete filter.pageSize;
    const defaultLimit = +limit || 10; const current = +currentPage || 1;
    const totalItems = await this.enrollmentModel.countDocuments(filter);
    const result = await this.enrollmentModel.find(filter)
      .select(projection)
      .skip((current - 1) * defaultLimit)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate({ path: 'student_id', select: 'name email phone age gender address' })
      .populate('class_id')
      .populate(population)
      .exec();
    return { meta: { current, pageSize: defaultLimit, pages: Math.ceil(totalItems / defaultLimit), total: totalItems }, result };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found enrollment';
    return await this.enrollmentModel.findOne({ _id: id }).populate('student_id class_id');
  }

  async findMine(user: IUser) {
    return this.enrollmentModel.find({ student_id: user._id })
      .populate({
        path: 'class_id',
        populate: [
          { path: 'course_id' },
          { path: 'teacher_id', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findStudentsForTeacher(user: IUser) {
    const classrooms = await this.classroomModel.find({ teacher_id: user._id }).select('_id').lean().exec();
    const classroomIds = classrooms.map(item => item._id);
    return this.enrollmentModel.find({ class_id: { $in: classroomIds } })
      .populate('student_id', 'name email phone')
      .populate({ path: 'class_id', populate: { path: 'course_id', select: 'name' } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(updateEnrollmentDto: UpdateEnrollmentDto, user: IUser) {
    const enrollment = await this.enrollmentModel.findById(updateEnrollmentDto._id).select('class_id status').lean().exec();
    if (!enrollment) return { matchedCount: 0, modifiedCount: 0 };
    if (enrollment.status === 'CANCELLED' && updateEnrollmentDto.status && updateEnrollmentDto.status !== 'CANCELLED') {
      await this.ensureClassHasSpace(String(enrollment.class_id));
    }
    const result = await this.enrollmentModel.updateOne(
      { _id: updateEnrollmentDto._id },
      { ...updateEnrollmentDto, updatedBy: { _id: user._id, email: user.email } },
    );
    await this.updateClassCapacityStatus(String(enrollment.class_id));
    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found enrollment';
    const enrollment = await this.enrollmentModel.findById(id).select('class_id').lean().exec();
    await this.enrollmentModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    const result = await this.enrollmentModel.delete({ _id: id });
    if (enrollment) await this.updateClassCapacityStatus(String(enrollment.class_id));
    return result;
  }
}
