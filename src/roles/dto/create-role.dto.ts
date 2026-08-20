import { IsArray, IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;

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
