import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  // グローバルにValidationPipeを適用し、whitelistでDTOにないプロパティを削除
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    //CORS設定
    credentials: true, //cookie受け取るよう
    origin: allowedOrigins,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
