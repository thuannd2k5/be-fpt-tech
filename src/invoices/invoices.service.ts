import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';
import { Enrollment, EnrollmentDocument } from '../enrollments/schemas/enrollment.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: SoftDeleteModel<InvoiceDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel: SoftDeleteModel<EnrollmentDocument>
  ) { }

  private async createMissingInvoices() {
    const enrollments = await this.enrollmentModel.find().populate({
      path: 'class_id',
      populate: { path: 'course_id', select: 'price' },
    }).lean().exec();
    const enrollmentIds = enrollments.map(enrollment => enrollment._id);
    const existingInvoices = await this.invoiceModel.find({ enrollment_id: { $in: enrollmentIds } }).select('enrollment_id').lean().exec();
    const existingEnrollmentIds = new Set(existingInvoices.map(invoice => String(invoice.enrollment_id)));
    const missingInvoices = enrollments
      .filter(enrollment => !existingEnrollmentIds.has(String(enrollment._id)))
      .map(enrollment => {
        const classroom = enrollment.class_id as unknown as { course_id?: { price?: string | number } } | undefined;
        const amount = Number(classroom?.course_id?.price || 0);
        return {
          enrollment_id: enrollment._id,
          amount,
          final_amount: amount,
          discount_amount: 0,
          status: 'UNPAID',
        };
      });
    if (missingInvoices.length) await this.invoiceModel.insertMany(missingInvoices);
  }

  async create(createInvoiceDto: CreateInvoiceDto, user: IUser) {
    return await this.invoiceModel.create({ ...createInvoiceDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    await this.createMissingInvoices();
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current; delete filter.pageSize;
    const defaultLimit = +limit || 10; const current = +currentPage || 1;
    const totalItems = await this.invoiceModel.countDocuments(filter);
    const result = await this.invoiceModel.find(filter).select(projection).skip((current - 1) * defaultLimit).limit(defaultLimit).sort(sort as any).populate(population).exec();
    return { meta: { current, pageSize: defaultLimit, pages: Math.ceil(totalItems / defaultLimit), total: totalItems }, result };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found invoice';
    return await this.invoiceModel.findOne({ _id: id }).populate('enrollment_id');
  }

  async findMine(user: IUser) {
    const enrollments = await this.enrollmentModel.find({ student_id: user._id }).select('_id').lean().exec();
    return this.invoiceModel.find({ enrollment_id: { $in: enrollments.map(item => item._id) } })
      .populate({ path: 'enrollment_id', populate: { path: 'class_id', populate: { path: 'course_id', select: 'name' } } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(updateInvoiceDto: UpdateInvoiceDto, user: IUser) {
    return await this.invoiceModel.updateOne({ _id: updateInvoiceDto._id }, { ...updateInvoiceDto, updatedBy: { _id: user._id, email: user.email } });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found invoice';
    await this.invoiceModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    return await this.invoiceModel.delete({ _id: id });
  }
}
