import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ResponseMessage, SkipCheckPermission, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @SkipCheckPermission()
  @ResponseMessage('Create new message')
  create(@Body() createMessageDto: CreateMessageDto, @User() user: IUser) {
    return this.messagesService.create(createMessageDto, user);
  }

  @Get()
  @SkipCheckPermission()
  @ResponseMessage('Get all messages')
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.messagesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @SkipCheckPermission()
  @ResponseMessage('Get message by id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @SkipCheckPermission()
  @ResponseMessage('Update message')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @User() user: IUser,
  ) {
    return this.messagesService.update({ ...updateMessageDto, _id: id }, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete message')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.messagesService.remove(id, user);
  }
}
