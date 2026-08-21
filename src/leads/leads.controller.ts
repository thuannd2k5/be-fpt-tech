import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Post()
  @ResponseMessage('Create new lead')
  create(@Body() createLeadDto: CreateLeadDto, @User() user: IUser) {
    return this.leadsService.create(createLeadDto, user);
  }

  @Get()
  @ResponseMessage('Get all leads')
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.leadsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get lead by id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update lead')
  update(@Body() updateLeadDto: UpdateLeadDto, @User() user: IUser) {
    return this.leadsService.update(updateLeadDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete lead')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.leadsService.remove(id, user);
  }
}
