import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  db: PrismaService;
  constructor(db: PrismaService) {
    this.db = db;
  }
  async create(createUserDto: CreateUserDto) {
    try {
      await this.db.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          name: createUserDto.name,
          address: "",
          phoneNumber: ""
        },
      });
      return 'Új felhasználó létrehozva';
    } catch (error) {
      return error.message;
    }
  }

  async findAll() {
    return await this.db.user.findMany();
  }
  async findUserByEmail(email: string) {
    return await this.db.user.findFirst(({ where: { email: email } }));
  }
  async findAuthors() {
    return await this.db.user.findMany({
      where: {
      OR: [
        {
        hostedLessons: {
          some: {},
        },
        },
        {
        authoredGuides: {
          some: {},
        },
        },
      ],
      },
      include: {
      authoredGuides: true,
      hostedLessons: true,
      },
    });
  }
async findPayingUsers() {
    return await this.db.user.findMany({
      where: {
        orders: {
          some: {
            totalPrice: {
              gt: 0,
            },
          },
        },
      },
      include: {
        orders: true,
      },
    });
}
  async findOne(id: number) {
    return await this.db.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.db.user.update({
      where: {
        id,
      },
      data: {
        email: updateUserDto.email,
        password: updateUserDto.password,
        name: updateUserDto.name,
        address: updateUserDto.address,
        phoneNumber: updateUserDto.phoneNumber,
      },
    });
    return `${id} azonosítójú felhasználó adatai frissítve`;
  }

  async remove(id: number) {
    await this.db.user.delete({
      where: {
        id,
      },
    });
    return `${id} azonosítójú felhasználó törölve`;
  }
}
