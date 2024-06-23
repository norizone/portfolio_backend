import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Msg } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<Msg> {
    const { permission, email, password } = dto;
    const hashed = await bcrypt.hash(password, 12);
    try {
      await this.prisma.user.create({
        data: {
          email,
          hashedPassword: hashed,
          permission: permission,
        },
      });
      return {
        message: 'ok',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'このメールアドレスはすでに使用されています。',
          );
        }
      }
      throw error;
    }
  }
}
