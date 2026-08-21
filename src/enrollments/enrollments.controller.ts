import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  @Post()
  @ResponseMessage('Create new enrollment')
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @User() user: IUser) {
    return this.enrollmentsService.create(createEnrollmentDto, user);
  }

  @Get()
  @ResponseMessage('Get all enrollments')
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.enrollmentsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get enrollment by id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update enrollment')
  update(@Body() updateEnrollmentDto: UpdateEnrollmentDto, @User() user: IUser) {
    return this.enrollmentsService.update(updateEnrollmentDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete enrollment')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.enrollmentsService.remove(id, user);
  }
}
