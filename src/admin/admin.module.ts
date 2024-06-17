import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminToolController } from './tool/admin-tool.controller';
// import { ToolService } from 'src/tool/tool.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ToolModule } from 'src/tool/tool.module';

@Module({
  imports: [PrismaModule, ToolModule],
  controllers: [AdminController, AdminToolController],
  providers: [AdminService],
})
export class AdminModule {}
