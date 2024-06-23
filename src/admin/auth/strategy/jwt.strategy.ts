import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class jwtAdminStrategy extends PassportStrategy(Strategy, 'jwtAdmin') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          if (req && req.cookies) {
            jwt = req.cookies['access_token'];
          }
          return jwt;
        },
      ]),
      ignoreExpiration: false, //有効期限が切れてても判定するか
      secretOrKey: config.get('JTW_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    delete admin.hashedPassword;
    return admin;
  }
}
