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
import { ToolService } from './tool.service';
import { Tool } from '@prisma/client';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { UpdateToolsDto } from './dto/update-tools.dto';
import { UpdateToolOrderDto } from './dto/update-order.dto';
import { Msg } from './types/tool.type';

@UseGuards(AuthGuard('jwtAdmin'))
@Controller('admin/tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get('')
  getTool(): Promise<Pick<Tool, 'id' | 'toolName' | 'order'>[]> {
    return this.toolService.getAllTools();
  }

  @Post('create')
  createTool(@Body() dto: CreateToolDto): Promise<Tool> {
    return this.toolService.createTool(dto);
  }

  @Patch('edit/order')
  updateOrderTool(
    @Body() updateToolOrderDto: UpdateToolOrderDto,
  ): Promise<Msg> {
    return this.toolService.reorderTools(updateToolOrderDto);
  }

  @Patch('edit')
  updateTools(@Body() dto: UpdateToolsDto): Promise<Tool[]> {
    return this.toolService.updateTools(dto);
  }

  @Patch('edit/:id')
  updataTool(
    @Param('id', ParseIntPipe) toolId: number,
    @Body() dto: UpdateToolDto,
  ): Promise<Tool> {
    return this.toolService.updateTool(toolId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  deleteTool(@Param('id', ParseIntPipe) toolId: number): Promise<void> {
    return this.toolService.deleteTooById(toolId);
  }
}
