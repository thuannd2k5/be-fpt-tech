import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    path?: string;

    @IsOptional()
    @IsString()
    method?: string;

    @IsOptional()
    @IsString()
    module?: string;
}
