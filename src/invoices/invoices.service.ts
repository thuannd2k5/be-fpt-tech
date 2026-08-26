import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: SoftDeleteModel<InvoiceDocument>) { }

  async create(createInvoiceDto: CreateInvoiceDto, user: IUser) {
    return await this.invoiceModel.create({ ...createInvoiceDto, createdBy: { _id: user._id, email: user.email } });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
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

  async update(updateInvoiceDto: UpdateInvoiceDto, user: IUser) {
    return await this.invoiceModel.updateOne({ _id: updateInvoiceDto._id }, { ...updateInvoiceDto, updatedBy: { _id: user._id, email: user.email } });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found invoice';
    await this.invoiceModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    return await this.invoiceModel.delete({ _id: id });
  }
}
