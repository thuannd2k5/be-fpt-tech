import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsOptional()
    @IsMongoId()
    invoice_id?: string;

    @IsOptional()
    @IsString()
    payment_method?: string;

    @IsOptional()
    @IsDateString()
    payment_date?: Date;
}
