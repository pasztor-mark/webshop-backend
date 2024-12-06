import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  db: PrismaService;
  constructor(db: PrismaService) {
    this.db = db;
  }
  async create(createOrderDto: CreateOrderDto) {
    await this.db.order.create({
      data: {
        totalPrice: createOrderDto.totalPrice,
        status: 'Pending',
        customerId: createOrderDto.customerId,
        guides: {
          connect: createOrderDto.guideIds.map((id) => ({ id })),
        },
        lessons: {
          connect: createOrderDto.lessonIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll() {
    return await this.db.order.findMany();
  }
  async findAllByCustomerId(customerId: number) {
    return await this.db.order.findMany({ where: { id: customerId } });
  }
  async findAllByGuideId(guideId: number) {
    return await this.db.order.findMany({ where: { id: guideId } });
  }
  async findAllByLessonId(lessonId: number) {
    return await this.db.order.findMany({ where: { id: lessonId } });
  }
  async findAllByStatus(status: OrderStatus) {
    return await this.db.order.findMany({ where: { status } });
  }
  

  async findOne(id: number) {
    return await this.db.order.findFirstOrThrow({
      where: { id },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.db.order.update({
      where: { id },
      data: {
        totalPrice: updateOrderDto.totalPrice,
        status: updateOrderDto.status,
        customerId: updateOrderDto.customerId,
        guides: {
          set: updateOrderDto.guideIds.map((id) => ({ id })),
        },
        lessons: {
          set: updateOrderDto.lessonIds.map((id) => ({ id })),
        },
      },
    });
    return `${id} rendelés adatai frissítve`;
  }
  async updateStatus(id: number, status: string) {
    await this.db.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
      },
    });
    return `${id} rendelés státusza frissítve: ${status}`;
  }

  async remove(id: number) {
    await this.db.order.delete({
      where: { id },
    });
    return `${id} rendelés törölve`;
  }
}
