import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    full_name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    gender: string;

    @Prop()
    birthday: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    role: mongoose.Schema.Types.ObjectId;

    @Prop()
    status: string;

    @Prop()
    refreshToken: string;

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

export const UserSchema = SchemaFactory.createForClass(User);