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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Msg } from './interfaces/user.interface';

@UseGuards(AuthGuard('jwtAdmin'))
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body() dto: CreateUserDto): Promise<Msg> {
    return this.userService.createUser(dto);
  }
}
