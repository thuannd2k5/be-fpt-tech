import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ResponseMessage('Create new notification')
  create(@Body() createNotificationDto: CreateNotificationDto, @User() user: IUser) {
    return this.notificationsService.create(createNotificationDto, user);
  }

  @Get()
  @ResponseMessage('Get all notifications')
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.notificationsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get notification by id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update notification')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @User() user: IUser,
  ) {
    return this.notificationsService.update({ ...updateNotificationDto, _id: id }, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete notification')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.notificationsService.remove(id, user);
  }
}
