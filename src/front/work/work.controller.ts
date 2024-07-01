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

@UseGuards(OptionalAuthGuard)
@Controller('work')
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
    const viewParmission = req.user
      ? req.user.permission
      : VIEW_PERMISSION.GUEST;
    return this.workService.getWorkList(dto, viewParmission);
  }

  @Get('detail/:id')
  getWorkDetail(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ item: Work; nextConstents: Pick<Work, 'id' | 'titleEn'> }> {
    const viewParmission = req.user
      ? req.user.permission
      : VIEW_PERMISSION.GUEST;
    return this.workService.getWorkDetail(viewParmission, id);
  }
}
