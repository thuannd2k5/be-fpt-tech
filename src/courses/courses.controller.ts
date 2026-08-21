import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @ResponseMessage('Create new course')
  create(@Body() createCourseDto: CreateCourseDto, @User() user: IUser) {
    return this.coursesService.create(createCourseDto, user);
  }

  @Get()
  @ResponseMessage('Get all courses')
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.coursesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get course by id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update course')
  update(@Body() updateCourseDto: UpdateCourseDto, @User() user: IUser) {
    return this.coursesService.update(updateCourseDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete course')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.coursesService.remove(id, user);
  }
}
