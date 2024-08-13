import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Jwt } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

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
      expiresIn: '1440m', // アクセストークン有効期限
      secret: secret,
    });
    return {
      accessToken: token,
    };
  }

  async getUser(userId: number): Promise<{ userPermission: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return {
      userPermission: user.permission,
    };
  }
}
