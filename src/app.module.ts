import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FrontModule } from './front/front.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //グローバルに
    PrismaModule,
    AdminModule,
    FrontModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
