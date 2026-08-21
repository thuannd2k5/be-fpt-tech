import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { ClassroomStatus } from '../schemas/classroom.schema';

export class CreateClassroomDto {
    @IsOptional()
    @IsMongoId()
    course_id?: string;

    @IsOptional()
    @IsMongoId()
    teacher_id?: string;

    @IsOptional()
    @IsString()
    room?: string;

    @IsOptional()
    @IsString()
    class_name?: string;

    @IsOptional()
    @IsString()
    max_student?: string;

    @IsOptional()
    @IsString()
    start_time?: string;

    @IsOptional()
    @IsString()
    end_time?: string;

    @IsOptional()
    @IsEnum(ClassroomStatus)
    status?: ClassroomStatus;
}
