import { PartialType } from '@nestjs/mapped-types';
import { CreateClassroomDto } from './create-classroom.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {
    @IsNotEmpty()
    @IsMongoId()
    _id: string;
}
