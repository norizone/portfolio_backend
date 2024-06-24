import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorksList } from './dto/list-work.dto';
import { Work } from '@prisma/client';
import { VIEW_PERMISSION, PUBLICATION_STATUS } from 'src/util/enum';
import { CreateWorkDto } from './dto/create-work';
import { uploadImagePath } from './interfaces/work.interface';

@Injectable()
export class WorkService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkList(dto: WorksList): Promise<{
    items: Pick<Work, 'id' | 'title' | 'order' | 'publication'>[];
    totalPages: number;
    totalCount: number;
  }> {
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

  async uploadWorkImage(files: {
    archiveImg?: Express.Multer.File[];
    singleImgMain?: Express.Multer.File[];
    singleImgSub?: Express.Multer.File[];
    singleImgSub2?: Express.Multer.File[];
  }): Promise<uploadImagePath> {
    const { archiveImg, singleImgMain, singleImgSub, singleImgSub2 } = files;
    const archiveImgPath = archiveImg ? archiveImg[0].path : null;
    const singleImgMainPath = singleImgMain ? singleImgMain[0].path : null;
    const singleImgSubPath = singleImgSub ? singleImgSub[0].path : null;
    const singleImgSub2Path = singleImgSub2 ? singleImgSub2[0].path : null;
    return {
      archiveImg: archiveImgPath,
      singleImgMain: singleImgMainPath,
      singleImgSub: singleImgSubPath,
      singleImgSub2: singleImgSub2Path,
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

  async editWork() {}

  async deleteWork() {}
}
