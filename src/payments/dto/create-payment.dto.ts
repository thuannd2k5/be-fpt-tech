import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsMongoId()
    invoice_id: string;

    @IsNotEmpty()
    @IsString()
    payment_method: string;

    @IsNotEmpty()
    @IsDateString()
    payment_date: Date;
}
