import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ResponseMessage('Create new role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Get all roles')
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.rolesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get role by id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update role')
  update(@Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete role')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
