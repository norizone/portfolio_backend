import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Msg } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const uniqueErrorMessage = ({
  error,
  userName = 'このメールアドレス',
}: {
  error: unknown;
  userName?: string;
}) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ForbiddenException(`${userName}は既に使用されています。`);
    }
  }
};

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
      uniqueErrorMessage({ error });
      throw error;
    }
  }

  async getAllUsers(): Promise<Pick<User, 'id' | 'email' | 'permission'>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        email: true,
        permission: true,
      },
    });
    return users.length > 0 ? users : [];
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('ユーザーが見つかりませんでした。');
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async updateUser(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('ユーザーが見つかりませんでした。');
    try {
      const updateUser = this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });
      delete (await updateUser).hashedPassword;
      return updateUser;
    } catch (error) {
      uniqueErrorMessage({ error });
      throw error;
    }
  }
}
