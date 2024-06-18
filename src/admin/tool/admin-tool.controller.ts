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
import { Tool, USER_ROLE } from '@prisma/client';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CreateToolDto } from 'src/tool/dto/create-tool.dto';
import { UpdateToolDto } from 'src/tool/dto/update-tool.dto';
import { ToolService } from 'src/tool/tool.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(USER_ROLE.ADMIN)
@Controller('admin/tool')
export class AdminToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get('/list')
  getTools(): Promise<Tool[]> {
    return this.toolService.getTools();
  }

  @Post('create')
  CreateToolDto(@Body() dto: CreateToolDto): Promise<Tool> {
    return this.toolService.createTool(dto);
  }

  @Patch('edit/:id')
  updateTool(
    @Param('id', ParseIntPipe) toolId: number,
    @Body() dto: UpdateToolDto,
  ): Promise<Tool> {
    return this.toolService.updateTool(toolId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  deleteTool(@Param('id', ParseIntPipe) toolId: number): Promise<void> {
    return this.toolService.deleatTaskById(toolId);
  }
}
