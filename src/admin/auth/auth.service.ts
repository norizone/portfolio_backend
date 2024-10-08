import { Injectable, ForbiddenException } from '@nestjs/common';
import { Admin, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: AuthDto): Promise<Msg> {
    const hashed = await bcrypt.hash(dto.password, 12);
    try {
      await this.prisma.admin.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
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
    const user = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user)
      throw new ForbiddenException(
        `メールアドレスかパスワード\nが間違っています。`,
      );
    const isValid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!isValid)
      throw new ForbiddenException(
        `メールアドレスかパスワード\nが間違っています。`,
      );
    return this.generateJwt(user.id, user.email);
  }

  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JTW_SECRET_ADMIN');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '4320m', // アクセストークン有効期限
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }

  async getUser(userId: number): Promise<Pick<Admin, 'id' | 'email'>> {
    const user = await this.prisma.admin.findUnique({
      where: { id: userId },
      select: { email: true, id: true },
    });

    return {
      id: user?.id,
      email: user?.email,
    };
  }
}
