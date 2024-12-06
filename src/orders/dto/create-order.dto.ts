import { IsInt, IsEnum, IsArray } from 'class-validator';

import { $Enums } from '@prisma/client';
enum OrderStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Canceled = 'Canceled',
}
export class CreateOrderDto {
  @IsInt()
  totalPrice: number;

  @IsEnum(OrderStatus)
  status: $Enums.OrderStatus;

  @IsInt()
  customerId: number;

  @IsArray()
  @IsInt({ each: true })
  guideIds: number[];

  @IsArray()
  @IsInt({ each: true })
  lessonIds: number[];
}
