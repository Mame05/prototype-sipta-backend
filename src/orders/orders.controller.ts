import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
    constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
findAll(): Promise<Order[]> {
  return this.ordersService.findAll();
}

@Patch(':id/status')
updateStatus(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateOrderStatusDto: UpdateOrderStatusDto,
): Promise<Order> {
  return this.ordersService.updateStatus(
    id,
    updateOrderStatusDto.statut,
  );
}

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    return this.ordersService.findOne(id);
  }
}
