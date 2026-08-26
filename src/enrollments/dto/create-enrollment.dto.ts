import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../schemas/enrollment.schema';

export class CreateEnrollmentDto {
    @IsNotEmpty()
    @IsMongoId()
    student_id: string;

    @IsNotEmpty()
    @IsMongoId()
    class_id: string;

    @IsNotEmpty()
    @IsDateString()
    register_date: Date;

    @IsOptional()
    @IsEnum(EnrollmentStatus)
    status?: EnrollmentStatus;
}
