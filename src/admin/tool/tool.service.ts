import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, Tool } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateToolDto } from './dto/update-tool.dto';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolsDto } from './dto/update-tools.dto';
import { UpdateToolOrderDto } from './dto/update-order.dto';

const uniqueErrorMessage = ({
  error,
  toolName = 'このツール名',
}: {
  error: unknown;
  toolName?: string;
}) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ForbiddenException(`${toolName}は既に使用されています。`);
    }
  }
};
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
    try {
      const tool = await this.prisma.tool.create({
        data: { ...dto },
      });
      return tool;
    } catch (error) {
      console.log(error);
      uniqueErrorMessage({ error, toolName: dto.toolName });
      throw error;
    }
  }

  async deleteTooById(toolId: number): Promise<void> {
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
    try {
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
    } catch (error) {
      console.log(error);
      uniqueErrorMessage({ error });
      throw error;
    }
  }

  async reorderTools(dto: UpdateToolOrderDto) {
    const { id, order: newOrder } = dto;

    // 現在の順序を取得
    const currentTool = await this.prisma.tool.findUnique({
      where: { id },
    });

    if (!currentTool) {
      throw new Error('Tool not found');
    }

    const currentOrder = currentTool.order;

    if (newOrder < currentOrder) {
      await this.prisma.tool.updateMany({
        where: {
          order: {
            gte: newOrder,
            lt: currentOrder,
          },
        },
        data: {
          order: {
            increment: 1, // 1つずつorderを上げる
          },
        },
      });
    } else if (newOrder > currentOrder) {
      await this.prisma.tool.updateMany({
        where: {
          order: {
            gt: currentOrder,
            lte: newOrder,
          },
        },
        data: {
          order: {
            decrement: 1, // 1つずつorderを下げる
          },
        },
      });
    }

    // 変更されたツール自体のorderを更新
    await this.prisma.tool.update({
      where: { id },
      data: { order: newOrder },
    });

    return { message: 'Tools reordered successfully' };
  }
}
