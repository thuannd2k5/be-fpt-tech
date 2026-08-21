import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  @ResponseMessage('Create new payment')
  create(@Body() createPaymentDto: CreatePaymentDto, @User() user: IUser) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Get()
  @ResponseMessage('Get all payments')
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.paymentsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get payment by id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update payment')
  update(@Body() updatePaymentDto: UpdatePaymentDto, @User() user: IUser) {
    return this.paymentsService.update(updatePaymentDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete payment')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.paymentsService.remove(id, user);
  }
}
