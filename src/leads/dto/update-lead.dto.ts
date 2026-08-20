import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
    @IsNotEmpty()
    @IsMongoId()
    _id: string;
}
