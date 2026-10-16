import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ResponseMessage, SkipCheckPermission, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @SkipCheckPermission()
  @ResponseMessage('Create new conversation')
  create(@Body() createConversationDto: CreateConversationDto, @User() user: IUser) {
    return this.conversationsService.create(createConversationDto, user);
  }

  @Get()
  @SkipCheckPermission()
  @ResponseMessage('Get all conversations')
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.conversationsService.findAll(+page, +limit, qs);
  }

  @Get('my-conversations')
  @SkipCheckPermission()
  @ResponseMessage('Get my conversations')
  findMyConversations(@User() user: IUser) {
    return this.conversationsService.findMyConversations(user);
  }

  @Get(':id')
  @SkipCheckPermission()
  @ResponseMessage('Get conversation by id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Patch(':id')
  @SkipCheckPermission()
  @ResponseMessage('Update conversation')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @User() user: IUser,
  ) {
    return this.conversationsService.update({ ...updateConversationDto, _id: id }, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete conversation')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.conversationsService.remove(id, user);
  }
}
