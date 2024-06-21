import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ToolModule } from '@/admin/tool/tool.module';
import { ToolController } from './tool/tool.controller';
import { UserModule } from './user/user.module';
import { WorkModule } from './work/work.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, ToolModule, UserModule, WorkModule],
  controllers: [ToolController],
})
export class AdminModule {}
