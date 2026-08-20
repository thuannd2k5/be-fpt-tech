import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    @IsNotEmpty()
    @IsMongoId()
    _id: string;
}
