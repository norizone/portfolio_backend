import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { Work } from '@prisma/client';
import { Request } from 'express';
import { WorksList } from './dto/list-work.dto';
import { VIEW_PERMISSION } from 'src/util/enum';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { DetailWorkRes } from './types/work.type';

@UseGuards(OptionalAuthGuard)
@Controller('front/work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}
  @Post('/list')
  getWorks(
    @Req() req: Request,
    @Body() dto: WorksList,
  ): Promise<{
    items: Pick<Work, 'id' | 'titleEn' | 'archiveImg'>[];
    totalPages: number;
    totalCount: number;
  }> {
    const viewPermission = req.user
      ? req.user.permission
      : VIEW_PERMISSION.GUEST;
    return this.workService.getWorkList(dto, viewPermission);
  }

  @Get('detail/:id')
  getWorkDetail(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailWorkRes> {
    const viewPermission = req.user
      ? req.user.permission
      : VIEW_PERMISSION.GUEST;
    return this.workService.getWorkDetail(viewPermission, id);
  }
}
