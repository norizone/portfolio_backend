import { ForbiddenException, Injectable } from '@nestjs/common';
import { Tool } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateToolDto } from './dto/update-tool.dto';
import { CreateToolDto } from './dto/create-tool.dto';
@Injectable()
export class ToolService {
  constructor(private prisma: PrismaService) {}

  getTools(): Promise<Tool[]> {
    return this.prisma.tool.findMany();
  }

  async createTool(dto: CreateToolDto): Promise<Tool> {
    const tool = await this.prisma.tool.create({
      data: { ...dto },
    });
    return tool;
  }

  async deleatTaskById(toolId: number): Promise<void> {
    const tool = await this.prisma.tool.findUnique({
      where: {
        id: toolId,
      },
    });
    if (!tool) throw new ForbiddenException('タスクが見つかりませんでした。');
    await this.prisma.tool.delete({
      where: {
        id: toolId,
      },
    });
  }

  async updateTool(toolId: number, dto: UpdateToolDto): Promise<Tool> {
    const tool = await this.prisma.tool.findUnique({
      where: {
        id: toolId,
      },
    });
    if (!tool) throw new ForbiddenException('タスクが見つかりませんでした。');
    return this.prisma.tool.update({
      where: {
        id: toolId,
      },
      data: {
        ...dto,
      },
    });
  }
}
