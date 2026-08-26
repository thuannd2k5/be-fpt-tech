import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';
import { User } from '../../users/schemas/user.schema';

export enum ClassroomStatus {
    OPEN = 'OPEN',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export type ClassroomDocument = HydratedDocument<Classroom>;

@Schema({ timestamps: true })
export class Classroom {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
    course_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    teacher_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    room: string;

    @Prop()
    class_name: string;

    @Prop()
    max_student: string;

    @Prop()
    start_time: string;

    @Prop()
    end_time: string;

    @Prop({ enum: Object.values(ClassroomStatus) })
    status: ClassroomStatus;

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

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);