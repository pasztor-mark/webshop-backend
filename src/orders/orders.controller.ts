import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Get('customer/:customerId')
  findAllByCustomerId(@Param('customerId') customerId: string) {
    return this.ordersService.findAllByCustomerId(+customerId);
  }

  @Get('guide/:guideId')
  findAllByGuideId(@Param('guideId') guideId: string) {
    return this.ordersService.findAllByGuideId(+guideId);
  }

  @Get('lesson/:lessonId')
  findAllByLessonId(@Param('lessonId') lessonId: string) {
    return this.ordersService.findAllByLessonId(+lessonId);
  }

  @Get('status/:status')
  findAllByStatus(@Param('status') status: string) {
    return this.ordersService.findAllByStatus(status as OrderStatus);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
