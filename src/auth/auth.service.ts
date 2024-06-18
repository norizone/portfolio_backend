import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async createUser(dto: CreateAuthDto): Promise<Msg> {
    const hashed = await bcrypt.hash(dto.password, 12);
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
          permission: dto.permission,
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

  async login(dto: AuthDto): Promise<Jwt> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user)
      throw new ForbiddenException(
        'メールアドレスかパスワードが間違っています。',
      );
    const isValid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!isValid)
      throw new ForbiddenException(
        'メールアドレスかパスワードが間違っています。',
      );
    return this.generateJwt(user.id, user.email, user.permission);
  }

  async generateJwt(userId: number, email: string, role: number): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JTW_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m', // アクセストークン有効期限
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }
}
