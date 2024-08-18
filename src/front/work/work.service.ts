import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorksList } from './dto/list-work.dto';
import { Work } from '@prisma/client';
import { VIEW_PERMISSION, PUBLICATION_STATUS } from 'src/util/enum';
import { DetailWorkRes } from './types/work.type';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkList(
    dto: WorksList,
    viewPermission: VIEW_PERMISSION,
  ): Promise<{
    items: Pick<Work, 'id' | 'titleEn' | 'archiveImg'>[];
    totalPages: number;
    totalCount: number;
  }> {
    const where = {
      permission: {
        lte: viewPermission,
      },
      publication: {
        in: [PUBLICATION_STATUS.PUBLIC],
      },
    };

    const { page = 1, pageSize = 5 } = dto;
    const skip = (page - 1) * pageSize;
    const totalCount = await this.prisma.work.count({
      where,
    });

    if (totalCount === 0)
      return {
        items: [],
        totalPages: 0,
        totalCount: 0,
      };

    const totalPages = Math.ceil(totalCount / pageSize);
    const data = await this.prisma.work.findMany({
      skip,
      take: pageSize,
      orderBy: {
        order: 'desc',
      },
      where,
      select: {
        id: true,
        titleEn: true,
        archiveImg: true,
        useTools: {
          select: {
            toolName: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return {
      items: data,
      totalPages,
      totalCount,
    };
  }

  async getWorkDetail(
    viewPermission: VIEW_PERMISSION,
    id: number,
  ): Promise<DetailWorkRes> {
    const defaultWhere = {
      permission: {
        lte: viewPermission,
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
      select: {
        title: true,
        id: true,
        titleEn: true,
        archiveImg: true,
        comment: true,
        url: true,
        isLinkToUrl: true,
        gitUrl: true,
        singleImgMain: true,
        singleImgSub: true,
        singleImgSub2: true,
        role: true,
        order: true,
        useTools: {
          select: {
            toolName: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!currentWork) {
      throw new NotFoundException('Work not found');
    }

    const nextWork = await this.prisma.work.findFirst({
      where: {
        order: {
          lt: currentWork.order,
        },
        ...defaultWhere,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        titleEn: true,
        id: true,
      },
    });

    return {
      item: currentWork,
      nextContents: nextWork,
    };
  }
}
