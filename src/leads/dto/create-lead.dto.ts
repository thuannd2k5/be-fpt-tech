import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    course_name: string;

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
