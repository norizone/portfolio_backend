import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorksList } from './dto/list-work.dto';
import { Work } from '@prisma/client';
import { CreateWorkDto } from './dto/create-work';
import { UpdateWorkDto } from './dto/update-work';
import { DetailWorkRes, WorkListRes } from './types/work.type';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkList(dto: WorksList): Promise<WorkListRes> {
    const { page = 1, pageSize = 5 } = dto;
    const skip = Math.max((page - 1) * pageSize, 0);
    const totalCount = await this.prisma.work.count();

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
      select: {
        id: true,
        title: true,
        order: true,
        publication: true,
      },
    });

    return {
      items: data,
      totalPages,
      totalCount,
    };
  }

  async getWorkDetail(id: number): Promise<DetailWorkRes> {
    const data = await this.prisma.work.findUnique({
      where: { id },
      select: {
        id: true,
        order: true,
        permission: true,
        publication: true,
        title: true,
        titleEn: true,
        archiveImg: true,
        comment: true,
        url: true,
        gitUrl: true,
        role: true,
        singleImgMain: true,
        singleImgSub: true,
        singleImgSub2: true,
        useTools: true,
      },
    });

    if (!data)
      throw new NotFoundException('該当データが見つかりませんでした。');

    const useToolIds = data.useTools.map((tool) => ({
      id: tool.id,
    }));

    return {
      ...data,
      useTools: useToolIds,
    };
  }

  async createWork(dto: CreateWorkDto): Promise<Work> {
    const { useTools, ...rest } = dto;
    const work = await this.prisma.work.create({
      data: {
        ...rest,
        useTools: {
          connect: useTools,
        },
      },
    });

    return work;
  }

  async editWork(id: number, dto: UpdateWorkDto): Promise<Work> {
    const { useTools, ...rest } = dto;
    const work = await this.prisma.work.findUnique({
      where: {
        id,
      },
    });
    if (!work) throw new ForbiddenException('該当実績が見つかりませんでした。');
    return this.prisma.work.update({
      where: {
        id,
      },
      data: {
        ...rest,
        useTools: {
          set: [],
          connect: useTools,
        },
      },
    });
  }

  async deleteWorkId(id: number): Promise<void> {
    const work = await this.prisma.work.findUnique({
      where: {
        id,
      },
    });
    if (!work) throw new ForbiddenException('該当実績が見つかりませんでした。');
    await this.prisma.work.delete({
      where: {
        id,
      },
    });
  }
}
