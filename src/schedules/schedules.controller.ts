import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ResponseMessage, SkipCheckPermission, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    // Giáo viên tạo slot lịch của mình
    @Post()
    @SkipCheckPermission()
    @ResponseMessage('Create schedule slot')
    create(@Body() createScheduleDto: CreateScheduleDto, @User() user: IUser) {
        return this.schedulesService.create(createScheduleDto, user);
    }

    // Manager/Admin xem tất cả lịch giáo viên
    @Get()
    @SkipCheckPermission()
    @ResponseMessage('Get all schedules')
    findAll(
        @Query('current') page: string,
        @Query('pageSize') limit: string,
        @Query() qs: string
    ) {
        return this.schedulesService.findAll(+page, +limit, qs);
    }

    // Manager/Admin tìm giáo viên rảnh theo giờ
    @Get('available')
    @SkipCheckPermission()
    @ResponseMessage('Get available teachers by time slot')
    findAvailable(
        @Query('day') day?: string,
        @Query('start') start?: string,
        @Query('end') end?: string,
        @Query('subject') subject?: string
    ) {
        return this.schedulesService.findAvailableTeachers(day, start, end, subject);
    }

    // Giáo viên xem lịch của mình
    @Get('me')
    @SkipCheckPermission()
    @ResponseMessage('Get my schedule')
    findMySchedule(@User() user: IUser) {
        return this.schedulesService.findMySchedule(user);
    }

    // // Xem chi tiết 1 slot
    // @Get(':id')
    // @SkipCheckPermission()
    // @ResponseMessage('Get schedule by id')
    // findOne(@Param('id') id: string) {
    //     return this.schedulesService.findOne(id);
    // }

    // Giáo viên cập nhật slot của mình
    @Patch(':id')
    @SkipCheckPermission()
    @ResponseMessage('Update schedule slot')
    update(@Body() updateScheduleDto: UpdateScheduleDto, @User() user: IUser) {
        return this.schedulesService.update(updateScheduleDto, user);
    }

    // Giáo viên xóa slot của mình
    @Delete(':id')
    @SkipCheckPermission()
    @ResponseMessage('Delete schedule slot')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.schedulesService.remove(id, user);
    }
}
