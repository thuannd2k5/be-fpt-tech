import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule, ScheduleDocument } from './schemas/schedule.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/user.interface';

const escapeRegex = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
const cleanSubject = (text: string) => {
    if (!text) return text;
    if (text.toLowerCase().startsWith('c') && text.endsWith('  ')) {
        return text.trim() + '++';
    }
    return text;
};

@Injectable()
export class SchedulesService {
    constructor(
        @InjectModel(Schedule.name) private scheduleModel: SoftDeleteModel<ScheduleDocument>
    ) { }

    async create(createScheduleDto: CreateScheduleDto, user: IUser) {
        const { day_of_week, start_time, end_time } = createScheduleDto;

        // Kiểm tra trùng lịch
        const conflict = await this.scheduleModel.findOne({
            teacher_id: user._id,
            day_of_week,
            $or: [
                { start_time: { $lt: end_time }, end_time: { $gt: start_time } }
            ]
        });
        if (conflict) {
            throw new BadRequestException(`Bạn đã có lịch trùng vào ${day_of_week} lúc ${conflict.start_time} - ${conflict.end_time}`);
        }

        return await this.scheduleModel.create({
            ...createScheduleDto,
            teacher_id: user._id,
            createdBy: { _id: user._id, email: user.email }
        });
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        const subjectFilter = cleanSubject(filter.subject);
        delete filter.subject; // Xóa khỏi filter trực tiếp vì bảng schedules không có cột subject

        const defaultLimit = +limit || 10;
        const current = +currentPage || 1;
        const totalItems = await this.scheduleModel.countDocuments(filter);
        let result = await this.scheduleModel.find(filter)
            .select(projection)
            .skip((current - 1) * defaultLimit)
            .limit(defaultLimit)
            .sort(sort as any)
            .populate(population)
            .populate({
                path: 'teacher_id',
                select: 'name email phone subject experience_years',
                match: subjectFilter ? { subject: { $regex: escapeRegex(subjectFilter), $options: 'i' } } : {}
            })
            .exec();

        if (subjectFilter) {
            result = result.filter(slot => slot.teacher_id !== null);
        }

        const total = subjectFilter ? result.length : totalItems;

        return {
            meta: { current, pageSize: defaultLimit, pages: Math.ceil(total / defaultLimit), total },
            result
        };
    }

    async findMySchedule(user: IUser) {
        return await this.scheduleModel
            .find({ teacher_id: user._id })
            .sort({ day_of_week: 1, start_time: 1 })
            .exec();
    }

    async findAvailableTeachers(day_of_week?: string, start_time?: string, end_time?: string, subject?: string) {
        const query: any = {
            status: 'available'
        };

        if (day_of_week) {
            query.day_of_week = day_of_week;
        }

        if (start_time && end_time) {
            query.start_time = { $lte: start_time };
            query.end_time = { $gte: end_time };
        } else if (start_time) {
            query.start_time = { $lte: start_time };
        } else if (end_time) {
            query.end_time = { $gte: end_time };
        }

        const cleanSub = cleanSubject(subject);

        const slots = await this.scheduleModel.find(query)
            .populate({
                path: 'teacher_id',
                select: 'name email phone subject experience_years',
                match: cleanSub ? { subject: { $regex: escapeRegex(cleanSub), $options: 'i' } } : {}
            })
            .sort({ day_of_week: 1, start_time: 1 })
            .exec();

        if (cleanSub) {
            return slots.filter(slot => slot.teacher_id !== null);
        }

        return slots;
    }

    // async findOne(id: string) {
    //     if (!mongoose.Types.ObjectId.isValid(id)) return 'not found schedule';
    //     return await this.scheduleModel.findOne({ _id: id }).populate('teacher_id', 'name email');
    // }

    async update(updateScheduleDto: UpdateScheduleDto, user: IUser) {
        return await this.scheduleModel.updateOne(
            { _id: updateScheduleDto._id, teacher_id: user._id },
            { ...updateScheduleDto, updatedBy: { _id: user._id, email: user.email } }
        );
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) return 'not found schedule';
        await this.scheduleModel.updateOne({ _id: id }, {
            deletedBy: { _id: user._id, email: user.email }
        });
        return await this.scheduleModel.delete({ _id: id });
    }
}
