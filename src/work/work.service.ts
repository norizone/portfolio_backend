import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetWorkList } from './dto/list-work.dto';
import { USER_ROLE, Work } from '@prisma/client';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  async getList(
    dto: GetWorkList,
    userRole: USER_ROLE,
  ): Promise<{ data: Work[]; totalPages: number; totalCount: number }> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const totalCount = await this.prisma.work.count({
      where: {
        viewPermission: {
          in: [userRole],
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    const data = await this.prisma.work.findMany({
      skip,
      take: limit,
      orderBy: {
        order: 'asc',
      },
      where: {
        viewPermission: {
          in: [userRole],
        },
      },
    });

    return {
      data,
      totalPages,
      totalCount,
    };
  }
}
