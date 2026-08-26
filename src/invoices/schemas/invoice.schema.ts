import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Enrollment } from '../../enrollments/schemas/enrollment.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Enrollment.name })
    enrollment_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    amount: number;

    @Prop()
    discount_amount: number;

    @Prop()
    final_amount: number;

    @Prop()
    status: string;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);