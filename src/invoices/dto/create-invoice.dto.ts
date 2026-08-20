import { IsDateString, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
    @IsOptional()
    @IsMongoId()
    enrollment_id?: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsNumber()
    discount_amount?: number;

    @IsOptional()
    @IsNumber()
    final_amount?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsDateString()
    create_at?: Date;
}
