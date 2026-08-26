import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

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
    @IsString()
    price?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
