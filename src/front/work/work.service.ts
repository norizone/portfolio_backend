import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorksList } from './dto/list-work.dto';
import { Work } from '@prisma/client';
import { VIEW_PERMISSION, PUBLICATION_STATUS } from 'src/util/enum';
import { CreateWorkDto } from './dto/create-work';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkList(
    dto: WorksList,
    viewParmission: VIEW_PERMISSION,
  ): Promise<{
    items: Pick<Work, 'id' | 'titleEn' | 'archiveImg'>[];
    totalPages: number;
    totalCount: number;
  }> {
    const where = {
      permission: {
        lte: viewParmission,
        publication: {
          in: [PUBLICATION_STATUS.PUBLIC],
        },
      },
    };

    const { page = 1, limit = 5 } = dto;
    const skip = (page - 1) * limit;
    const totalCount = await this.prisma.work.count({
      where,
    });

    if (totalCount === 0)
      return {
        items: [],
        totalPages: 0,
        totalCount: 0,
      };

    const totalPages = Math.ceil(totalCount / limit);
    const data = await this.prisma.work.findMany({
      skip,
      take: limit,
      orderBy: {
        order: 'asc',
      },
      where,
      select: {
        id: true,
        titleEn: true,
        archiveImg: true,
        useTools: true,
      },
    });

    return {
      items: data,
      totalPages,
      totalCount,
    };
  }

  async getWork(viewParmission: VIEW_PERMISSION, id: number): Promise<Work> {
    const where = {
      id,
      permission: {
        lte: viewParmission,
      },
      publication: {
        in: [PUBLICATION_STATUS.PUBLIC],
      },
    };
    const data = await this.prisma.work.findMany({
      where,
    });

    if (data.length === 0) {
      throw new NotFoundException('Work not found');
    }

    return data[0];
  }

  async createWork(dto: CreateWorkDto): Promise<Work> {
    const { useTools, ...rest } = dto;
    // ToolDtoをToolCreateWithoutWorkInputに変換
    const useToolsInput = useTools.map((tool) => ({
      id: tool.id,
    }));

    const work = await this.prisma.work.create({
      data: {
        ...rest,
        useTools: {
          connect: useToolsInput,
        },
      },
    });

    return work;
  }

  async editWork() {}

  async deleteWork() {}
}
