import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @Post()
  @ResponseMessage('Create new invoice')
  create(@Body() createInvoiceDto: CreateInvoiceDto, @User() user: IUser) {
    return this.invoicesService.create(createInvoiceDto, user);
  }

  @Get()
  @ResponseMessage('Get all invoices')
  findAll(@Query('current') page: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return this.invoicesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get invoice by id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update invoice')
  update(@Body() updateInvoiceDto: UpdateInvoiceDto, @User() user: IUser) {
    return this.invoicesService.update(updateInvoiceDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete invoice')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.invoicesService.remove(id, user);
  }
}
