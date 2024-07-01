import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorksList } from './dto/list-work.dto';
import { Work } from '@prisma/client';
import { VIEW_PERMISSION, PUBLICATION_STATUS } from 'src/util/enum';

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

  async getWorkDetail(
    viewParmission: VIEW_PERMISSION,
    id: number,
  ): Promise<{ item: Work; nextConstents: Pick<Work, 'id' | 'titleEn'> }> {
    const defaultWhere = {
      permission: {
        lte: viewParmission,
      },
      publication: {
        in: [PUBLICATION_STATUS.PUBLIC],
      },
    };

    const currentWork = await this.prisma.work.findFirst({
      where: {
        id,
        ...defaultWhere,
      },
    });

    if (!currentWork) {
      throw new NotFoundException('Work not found');
    }

    const nextWork = await this.prisma.work.findFirst({
      where: {
        order: {
          gt: currentWork.order,
        },
        ...defaultWhere,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        titleEn: true,
        id: true,
      },
    });

    return {
      item: currentWork,
      nextConstents: nextWork,
    };
  }
}
