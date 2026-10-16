import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum ScheduleStatus {
    AVAILABLE = 'available',
    BUSY = 'busy',
}

export enum DayOfWeek {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday',
}

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ timestamps: true })
export class Schedule {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    teacher_id: mongoose.Schema.Types.ObjectId;

    @Prop({ enum: Object.values(DayOfWeek), required: true })
    day_of_week: DayOfWeek;

    @Prop({ required: true })
    start_time: string; // 'HH:mm' format, e.g. '08:00'

    @Prop({ required: true })
    end_time: string; // 'HH:mm' format, e.g. '10:00'

    @Prop({ enum: Object.values(ScheduleStatus), default: ScheduleStatus.AVAILABLE })
    status: ScheduleStatus;

    @Prop()
    note: string;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
