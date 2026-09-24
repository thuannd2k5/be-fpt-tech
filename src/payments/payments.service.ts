import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import {
  Enrollment,
  EnrollmentDocument,
} from '../enrollments/schemas/enrollment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: SoftDeleteModel<PaymentDocument>,
    @InjectModel(Invoice.name)
    private invoiceModel: SoftDeleteModel<InvoiceDocument>,
    @InjectModel(Enrollment.name)
    private enrollmentModel: SoftDeleteModel<EnrollmentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: IUser) {
    return await this.paymentModel.create({
      ...createPaymentDto,
      createdBy: { _id: user._id, email: user.email },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultLimit = +limit || 10;
    const current = +currentPage || 1;
    const totalItems = await this.paymentModel.countDocuments(filter);
    const result = await this.paymentModel
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found payment';
    return await this.paymentModel.findOne({ _id: id }).populate('invoice_id');
  }

  async findMine(user: IUser) {
    const enrollments = await this.enrollmentModel
      .find({ student_id: user._id })
      .select('_id')
      .lean()
      .exec();
    const invoices = await this.invoiceModel
      .find({ enrollment_id: { $in: enrollments.map((item) => item._id) } })
      .select('_id')
      .lean()
      .exec();
    return this.paymentModel
      .find({ invoice_id: { $in: invoices.map((item) => item._id) } })
      .populate({
        path: 'invoice_id',
        populate: {
          path: 'enrollment_id',
          populate: {
            path: 'class_id',
            populate: { path: 'course_id', select: 'name' },
          },
        },
      })
      .sort({ payment_date: -1 })
      .exec();
  }

  async update(updatePaymentDto: UpdatePaymentDto, user: IUser) {
    return await this.paymentModel.updateOne(
      { _id: updatePaymentDto._id },
      {
        ...updatePaymentDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found payment';
    await this.paymentModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
      },
    );
    return await this.paymentModel.delete({ _id: id });
  }
}
