import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    level?: string;

    @IsOptional()
    @IsString()
    duration?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    status?: string;
}
