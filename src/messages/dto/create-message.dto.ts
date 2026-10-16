import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsMongoId()
    conversation_id: string;

    @IsOptional()
    @IsMongoId()
    sender_id?: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    message_type?: string;
}
