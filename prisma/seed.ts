import { faker } from '@faker-js/faker';
import { PrismaService } from '../src/prisma.service';
import { CreateGuideDto } from '../src/guides/dto/create-guide.dto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { CreateLessonDto } from '../src/lessons/dto/create-lesson.dto';
import { $Enums } from '@prisma/client';

enum Level {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

const prisma = new PrismaService();

const createUsers = async (count: number) => {
  const users: CreateUserDto[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      phoneNumber: faker.phone.number(),
    });
  }
  return await prisma.user.createMany({ data: users });
};

const createGuides = async (count: number, authorIds: number[]) => {
  const guides: CreateGuideDto[] = [];
  for (let i = 0; i < count; i++) {
    guides.push({
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      price: faker.number.int({ min: 0, max: 500000 }),
      subject: faker.helpers.arrayElement(Object.values($Enums.Subject)),
      level: faker.helpers.arrayElement(Object.values($Enums.Level)),
      authorId: faker.helpers.arrayElement(authorIds),
    });
  }
  return await prisma.guide.createMany({ data: guides });
};

const createLessons = async (count: number, hostIds: number[], userIds: number[]) => {
  const lessons: CreateLessonDto[] = [];
  for (let i = 0; i < count; i++) {
    const participantIds = faker.helpers.arrayElements(userIds, faker.number.int({ min: 1, max: 5 }));
    lessons.push({
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      price: faker.number.int({ min: 0, max: 500000 }),
      startTime: faker.date.future(),
      endTime: faker.date.future(),
      subject: faker.helpers.arrayElement(Object.values($Enums.Subject)),
      level: faker.helpers.arrayElement(Object.values($Enums.Level)),
      hostId: faker.helpers.arrayElement(hostIds),
      participantIds,
    });
  }

  for (const lesson of lessons) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        description: lesson.description,
        price: lesson.price,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        subject: lesson.subject,
        level: lesson.level,
        host: {
          connect: { id: lesson.hostId },
        },
        participants: {
          connect: lesson.participantIds.map(id => ({ id })),
        },
        orders: {
          create: lesson.participantIds.map(id => ({
            customerId: id,
            status: 'Paid',

            totalPrice: lesson.price,
          })),
        },
      },
    });
  }
};

const createOrders = async (count: number, customerIds: number[], guideIds: number[], lessonIds: number[]) => {
  const orders: CreateOrderDto[] = [];
  for (let i = 0; i < count; i++) {
    orders.push({
      totalPrice: faker.number.int({ min: 0, max: 500000 }),
      status: faker.helpers.arrayElement(Object.values($Enums.OrderStatus)),
      customerId: faker.helpers.arrayElement(customerIds),
      guideIds: faker.helpers.arrayElements(guideIds, faker.number.int({ min: 1, max: 3 })),
      lessonIds: faker.helpers.arrayElements(lessonIds, faker.number.int({ min: 1, max: 3 })),
    });
  }

  for (const order of orders) {
    await prisma.order.create({
      data: {
        totalPrice: order.totalPrice,
        status: order.status,
        customerId: order.customerId,
        guides: {
          connect: order.guideIds.map(id => ({ id })),
        },
        lessons: {
          connect: order.lessonIds.map(id => ({ id })),
        },
      },
    });
  }
};

const main = async () => {
  await prisma.$connect();

  await createUsers(10);
  const users = await prisma.user.findMany();
  const userIds = users.map(user => user.id);

  await createGuides(10, userIds);
  const guides = await prisma.guide.findMany();
  const guideIds = guides.map(guide => guide.id);

  await createLessons(10, userIds, userIds);
  const lessons = await prisma.lesson.findMany();
  const lessonIds = lessons.map(lesson => lesson.id);

  await createOrders(10, userIds, guideIds, lessonIds);

  await prisma.$disconnect();
};

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});