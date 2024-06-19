import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetWorkList } from './dto/list-work.dto';
import { Work } from '@prisma/client';
import { VIEW_PERMISSION, PUBLICATION_STATUS } from 'src/util/enum';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkList(
    dto: GetWorkList,
    viewParmission: VIEW_PERMISSION,
  ): Promise<{
    items: Pick<Work, 'id' | 'titleEn' | 'archiveImg'>[];
    totalPages: number;
    totalCount: number;
  }> {
    const defaltWhere = {
      permission: {
        in: [viewParmission],
      },
    };

    const where =
      viewParmission !== VIEW_PERMISSION.ADMIN
        ? {
            ...defaltWhere,
            publication: {
              in: [PUBLICATION_STATUS.PUBLIC],
            },
          }
        : defaltWhere;

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

  async getWork() {}

  async createWork() {}

  async editWork() {}

  async deleteWork() {}
}
