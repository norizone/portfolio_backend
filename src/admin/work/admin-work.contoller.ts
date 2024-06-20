import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Work } from '@prisma/client';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesAdminGuard } from 'src/auth/guards/role-admin.guard';
import { WorkService } from 'src/work/work.service';
import { USER_ROLE } from 'src/util/enum';
import { CreateWorkDto } from 'src/work/dto/create-work';

@UseGuards(AuthGuard('jwt'), RolesAdminGuard)
@Roles(USER_ROLE.ADMIN)
@Controller('admin/work')
export class AdminToolController {
  constructor(private readonly workService: WorkService) {}

  // @Get('/list')
  // getTools(): Promise<Work[]> {
  //   return this.workService.getWorkList();
  // }

  @Post('create')
  CreateToolDto(@Body() dto: CreateWorkDto): Promise<Work> {
    return this.workService.createWork(dto);
  }

  // @Patch('edit/:id')
  // updateTool(
  //   @Param('id', ParseIntPipe) toolId: number,
  //   @Body() dto: UpdateToolDto,
  // ): Promise<Tool> {
  //   return this.workService.updateTool(toolId, dto);
  // }

  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete('delete/:id')
  // deleteTool(@Param('id', ParseIntPipe) toolId: number): Promise<void> {
  //   return this.workService.deleatTaskById(toolId);
  // }
}
