import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
    @IsNotEmpty()
    @IsMongoId()
    _id: string;
}
