import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WorkService } from './work.service';
import { Work } from '@prisma/client';
// import { Request } from 'express';
import { WorksList } from './dto/list-work.dto';
import { CreateWorkDto } from './dto/create-work';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwtAdmin'))
@Controller('admin/work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post('/list')
  getWorks(@Body() dto: WorksList): Promise<{
    items: Pick<Work, 'id' | 'title' | 'order' | 'publication'>[];
    totalPages: number;
    totalCount: number;
  }> {
    return this.workService.getWorkList(dto);
  }

  @Post('create')
  createTool(@Body() dto: CreateWorkDto): Promise<Work> {
    return this.workService.createWork(dto);
  }
}
