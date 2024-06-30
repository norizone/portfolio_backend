import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FrontModule } from './front/front.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //グローバルに
    PrismaModule,
    AdminModule,
    FrontModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/src/uploads'), // 静的ファイルのディレクトリを指定
      serveRoot: '/uploads', // URLパスのルートを指定
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
