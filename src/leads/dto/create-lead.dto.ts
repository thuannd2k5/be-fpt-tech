import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    course_name?: string;

    @IsOptional()
    @IsMongoId()
    consultant_id?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    note?: string;
}
