import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) { }

  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto, @User() user: IUser) {
    return this.classroomsService.create(createClassroomDto, user);
  }

  @Get()
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.classroomsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomsService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateClassroomDto: UpdateClassroomDto, @User() user: IUser) {
    return this.classroomsService.update(updateClassroomDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.classroomsService.remove(id, user);
  }
}
