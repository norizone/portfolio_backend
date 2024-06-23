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
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard('jwtAdmin'))
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  getUserList(): Promise<Pick<User, 'id' | 'email' | 'permission'>[]> {
    return this.userService.getUsers();
  }

  @Post('create')
  createUser(@Body() dto: CreateUserDto): Promise<Msg> {
    return this.userService.createUser(dto);
  }

  @Patch('edit/:id')
  updataTool(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return this.userService.updateUser(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  deleteTool(@Param('id', ParseIntPipe) userId: number): Promise<void> {
    return this.userService.deleteUser(userId);
  }
}
