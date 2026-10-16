import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DayOfWeek, ScheduleStatus } from '../schemas/schedule.schema';

export class CreateScheduleDto {
    @IsNotEmpty()
    @IsEnum(DayOfWeek, { message: 'day_of_week phải là: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday' })
    day_of_week: DayOfWeek;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'start_time phải có định dạng HH:mm (vd: 08:00)' })
    start_time: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'end_time phải có định dạng HH:mm (vd: 10:00)' })
    end_time: string;

    @IsOptional()
    @IsEnum(ScheduleStatus, { message: 'status phải là: available hoặc busy' })
    status?: ScheduleStatus;

    @IsOptional()
    @IsString()
    note?: string;
}
