import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    permissions?: string[];
}
