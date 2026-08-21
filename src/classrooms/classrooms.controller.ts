import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) { }

  @Post()
  @ResponseMessage('Create new classroom')
  create(@Body() createClassroomDto: CreateClassroomDto, @User() user: IUser) {
    return this.classroomsService.create(createClassroomDto, user);
  }

  @Get()
  @ResponseMessage('Get all classrooms')
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.classroomsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get classroom by id')
  findOne(@Param('id') id: string) {
    return this.classroomsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update classroom')
  update(@Body() updateClassroomDto: UpdateClassroomDto, @User() user: IUser) {
    return this.classroomsService.update(updateClassroomDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete classroom')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.classroomsService.remove(id, user);
  }
}
