import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { Work } from '@prisma/client';
import { WorksList } from './dto/list-work.dto';
import { CreateWorkDto } from './dto/create-work';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { uploadImagePath } from './interfaces/work.interface';

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
  createWork(@Body() dto: CreateWorkDto): Promise<Work> {
    return this.workService.createWork(dto);
  }

  @Post('upload_images')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'archiveImg', maxCount: 1 },
      { name: 'singleImgMain', maxCount: 1 },
      { name: 'singleImgSub', maxCount: 1 },
      { name: 'singleImgSub2', maxCount: 1 },
    ]),
  )
  uploadImage(
    @UploadedFiles()
    files: {
      archiveImg?: Express.Multer.File[];
      singleImgMain?: Express.Multer.File[];
      singleImgSub?: Express.Multer.File[];
      singleImgSub2?: Express.Multer.File[];
    },
  ): Promise<uploadImagePath> {
    return this.workService.uploadWorkImage(files);
  }
}
