import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GuidesModule } from './guides/guides.module';
import { LessonsModule } from './lessons/lessons.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, GuidesModule, LessonsModule, OrdersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
