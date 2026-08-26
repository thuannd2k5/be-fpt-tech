import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({ timestamps: true })
export class Lead {
    @Prop()
    full_name: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    course_name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    consultant_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    status: string;

    @Prop()
    note: string;

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

export const LeadSchema = SchemaFactory.createForClass(Lead);