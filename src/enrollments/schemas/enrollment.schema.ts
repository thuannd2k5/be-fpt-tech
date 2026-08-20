import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export enum EnrollmentStatus {
    STUDYING = 'STUDYING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    WAITING_PAYMENT = 'WAITING_PAYMENT'
}

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ timestamps: true })
export class Enrollment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    student_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' })
    class_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    register_date: Date;

    @Prop({ enum: Object.values(EnrollmentStatus) })
    status: EnrollmentStatus;

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

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);