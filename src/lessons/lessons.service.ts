import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private readonly db: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    try {
      const lesson = await this.db.lesson.create({
        data: {
          title: createLessonDto.title,
          description: createLessonDto.description,
          price: createLessonDto.price,
          startTime: createLessonDto.startTime,
          endTime: createLessonDto.endTime,
          subject: createLessonDto.subject,
          level: createLessonDto.level,
          host: {
            connect: { id: createLessonDto.hostId },
          },
          participants: {
            connect: createLessonDto.participantIds.map(id => ({ id })),
          },
          orders: {
            create: createLessonDto.participantIds.map(id => ({
              customerId: id,
              status: 'Paid',
              lessons: {
                connect: { id: lesson.id },
              },
              totalPrice: createLessonDto.price,
            })),
          },
        },
      });
      return 'Új tanóra létrehozva';
    } catch (error) {
      return 'Hiba a mentés során';
    }
  }

  async addParticipants(lessonId: number, participantIds: number[]) {
    try {
      await this.db.lesson.update({
        where: { id: lessonId },
        data: {
          participants: {
            connect: participantIds.map(id => ({ id })),
          },
          orders: {
            create: participantIds.map(id => ({
              customerId: id,
              status: 'Paid',
              lessons: {
                connect: { id: lessonId },
              },
              totalPrice: 0,
            })),
          },
        },
      });
      return 'Résztvevők hozzáadva';
    } catch (error) {
      return 'Hiba a résztvevők hozzáadásakor';
    }
  }

  async findAll() {
    return await this.db.lesson.findMany();
  }

  async findManyByHostId(hostId: number) {
    return await this.db.lesson.findMany({
      where: {
        hostId,
      },
    });
  }

  async findManyBySubject(subject: $Enums.Subject) {
    return await this.db.lesson.findMany({
      where: {
        subject,
      },
    });
  }

  async findManyByPriceRange(minPrice: number, maxPrice) {
    return await this.db.lesson.findMany({
      where: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
    });
  }

  async findManyByLevel(level: $Enums.Level) {
    return await this.db.lesson.findMany({
      where: {
        level,
      },
    });
  }

  async findOne(id: number) {
    return await this.db.lesson.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    try {
      await this.db.lesson.update({
        where: {
          id,
        },
        data: updateLessonDto,
      });
    } catch (error) {
      throw new BadRequestException();
    }
    return `#${id} tanóra frissítve`;
  }

  async remove(id: number) {
    await this.db.lesson.delete({
      where: {
        id,
      },
    });
    return `#${id} tanóra törölve`;
  }
}
