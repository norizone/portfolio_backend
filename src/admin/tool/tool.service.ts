import { ForbiddenException, Injectable } from '@nestjs/common';
import { Tool } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateToolDto } from './dto/update-tool.dto';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolsDto } from './dto/update-tools.dto';
@Injectable()
export class ToolService {
  constructor(private prisma: PrismaService) {}

  async getAllTools(): Promise<Pick<Tool, 'id' | 'toolName' | 'order'>[]> {
    return this.prisma.tool.findMany({
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        order: true,
        toolName: true,
      },
    });
  }

  async createTool(dto: CreateToolDto): Promise<Tool> {
    const tool = await this.prisma.tool.create({
      data: { ...dto },
    });
    return tool;
  }

  async deleatTooById(toolId: number): Promise<void> {
    const tool = await this.prisma.tool.findUnique({
      where: {
        id: toolId,
      },
    });
    if (!tool)
      throw new ForbiddenException('該当ツールが見つかりませんでした。');
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
    if (!tool)
      throw new ForbiddenException('該当ツールが見つかりませんでした。');
    return this.prisma.tool.update({
      where: {
        id: toolId,
      },
      data: {
        ...dto,
      },
    });
  }

  async updateTools(dto: UpdateToolsDto): Promise<Tool[]> {
    const { tools } = dto;
    const updateTools = tools.map((tool) => {
      return this.prisma.tool.update({
        where: {
          id: tool.id,
        },
        data: {
          toolName: tool.toolName,
        },
      });
    });
    const updatedTasks = await Promise.all(updateTools);
    return updatedTasks;
  }
}
