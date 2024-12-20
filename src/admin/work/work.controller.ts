import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { Work } from '@prisma/client';
import { WorksList } from './dto/list-work.dto';
import { CreateEditWorkDto } from './dto/create-work';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { DetailWorkRes, Msg, WorkListRes } from './types/work.type';
import { UpdateWorkOrderDto } from './dto/update-order.dto';

@UseGuards(AuthGuard('jwtAdmin'))
@Controller('admin/work')
export class WorkController {
  constructor(
    private readonly workService: WorkService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('list')
  getWorks(@Body() dto: WorksList): Promise<WorkListRes> {
    return this.workService.getWorkList(dto);
  }

  @Get('list_all')
  getAllWorks(): Promise<Pick<Work, 'id' | 'title' | 'order'>[]> {
    return this.workService.getAllWorkList();
  }

  @Get('detail/:id')
  getWorkDetail(@Param('id', ParseIntPipe) id: number): Promise<DetailWorkRes> {
    return this.workService.getWorkDetail(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  deleteTool(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.workService.deleteWorkId(id);
  }

  @Post('create')
  createWork(@Body() dto: CreateEditWorkDto): Promise<Work> {
    return this.workService.createWork(dto);
  }

  @Post('upload_image')
  @UseInterceptors(FileInterceptor('uploadImg'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.s3Service.uploadFile(file);
  }

  @Post('delete_image')
  async deleteImage(@Body('fileName') fileName: string): Promise<void> {
    return this.s3Service.deleteFile(fileName);
  }

  @Post('edit_image')
  @UseInterceptors(FileInterceptor('uploadImg'))
  async editImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('oldFileName') oldFileName: string,
  ): Promise<string> {
    return this.s3Service.editFile(file, oldFileName);
  }

  @Patch('edit/:id')
  editWork(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEditWorkDto,
  ): Promise<Work> {
    return this.workService.editWork(id, dto);
  }

  @Patch('edit_order')
  updateOrderWork(
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<Msg> {
    return this.workService.reorderWork(updateWorkOrderDto);
  }
}
