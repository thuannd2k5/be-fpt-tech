import { IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../schemas/enrollment.schema';

export class CreateEnrollmentDto {
    @IsOptional()
    @IsMongoId()
    student_id?: string;

    @IsOptional()
    @IsMongoId()
    class_id?: string;

    @IsOptional()
    @IsDateString()
    register_date?: Date;

    @IsOptional()
    @IsEnum(EnrollmentStatus)
    status?: EnrollmentStatus;
}
