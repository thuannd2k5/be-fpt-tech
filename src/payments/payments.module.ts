import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';
import {
  Enrollment,
  EnrollmentSchema,
} from '../enrollments/schemas/enrollment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
