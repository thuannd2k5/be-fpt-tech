import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
    @IsNotEmpty()
    @IsMongoId()
    enrollment_id: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    discount_amount: number;

    @IsNotEmpty()
    @IsNumber()
    final_amount: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsDateString()
    create_at?: Date;
}
