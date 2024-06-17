import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // グローバルにValidationPipeを適用し、whitelistでDTOにないプロパティを削除
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    //CORS設定
    credentials: true, //cookie受け取るよう
    origin: ['http://localhost:3000'],
  });
  app.use(cookieParser());
  // app.use(
  //   csurf({
  //     cookie: {
  //       httpOnly: true, //jsから読み込ませない
  //       sameSite: 'none',
  //       secure: true,
  //     },
  //     value: (req: Request) => {
  //       return req.header('csrf-token');
  //     },
  //   }),
  // );
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
