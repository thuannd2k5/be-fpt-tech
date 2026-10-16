import { IsArray, IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsArray()
    participants?: string[];

    @IsOptional()
    @IsMongoId()
    participant_id?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    last_message?: string;

    @IsOptional()
    @IsDateString()
    last_message_at?: Date;
}
