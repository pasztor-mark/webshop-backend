import { Injectable } from '@nestjs/common';

import { UpdateGuideDto } from './dto/update-guide.dto';

import { PrismaService } from 'src/prisma.service';
import { $Enums } from '@prisma/client';
import { CreateGuideDto } from './dto/create-guide.dto';

@Injectable()
export class GuidesService {
  db: PrismaService;
  constructor(db: PrismaService) {
    this.db = db;
  }
  async create(createGuideDto: CreateGuideDto) {
    try {
      await this.db.guide.create({
        data: {
          title: createGuideDto.title,
          description: createGuideDto.description,
          price: createGuideDto.price,
          subject: createGuideDto.subject as $Enums.Subject,
          level: createGuideDto.level,
          author: {
            connect: {id: createGuideDto.authorId}
          }
      }
    })
    return "Új útmutató létrehozva"
  } catch (error) {
    return "Hiba a mentés során"
  }
  }
  async findAll() {
    return await this.db.guide.findMany();
  }
  async findManyByAuthorId(authorId: number) {
    return await this.db.guide.findMany({
      where: {
        authorId
      }
    })
  }
  async findManyBySubject(subject: $Enums.Subject) {
    return await this.db.guide.findMany({
      where: {
        subject
      }
    })
  }
  async findManyByLevel(level: $Enums.Level) {
    return await this.db.guide.findMany({
      where: {
        level
      }
    })
  }

  async findOne(id: number) {
    return await this.db.guide.findFirstOrThrow({
      where: {
        id
      },
    })
  }

  async update(id: number, updateGuideDto: UpdateGuideDto) {
    await this.db.guide.update({
      where: {
        id
      },
      data: updateGuideDto
    });
  
  return `#${id} útmutató frissítve`;
  }
  async remove(id: number) {
    await this.db.guide.delete({
      where: {
        id
      }
    })
    return ` #${id} útmutató törölve`;
  }
}
