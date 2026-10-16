import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMyProfileDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    currentPassword?: string;

    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
    newPassword?: string;
}
