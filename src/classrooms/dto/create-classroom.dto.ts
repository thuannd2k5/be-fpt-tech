import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClassroomStatus } from '../schemas/classroom.schema';

export class CreateClassroomDto {
    @IsNotEmpty()
    @IsMongoId()
    course_id: string;

    @IsNotEmpty()
    @IsMongoId()
    teacher_id: string;

    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    class_name: string;

    @IsNotEmpty()
    @IsString()
    max_student: string;

    @IsNotEmpty()
    @IsString()
    start_time: string;

    @IsNotEmpty()
    @IsString()
    end_time: string;

    @IsOptional()
    @IsEnum(ClassroomStatus)
    status?: ClassroomStatus;
}
