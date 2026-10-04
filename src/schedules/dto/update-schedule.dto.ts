import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
    @IsNotEmpty()
    @IsMongoId()
    _id: string;
}
