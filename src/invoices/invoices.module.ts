import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Enrollment, EnrollmentSchema } from '../enrollments/schemas/enrollment.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Invoice.name, schema: InvoiceSchema },
    { name: Enrollment.name, schema: EnrollmentSchema }
  ])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule { }
