import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';
import { AuthGuard } from '@nestjs/passport';
import { Admin } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }

  @Post('signup')
  sinnUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK) //statusを200番で変えす
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: this.config.get('COOKIE_SAME_SITE'),
      domain: this.config.get('COOKIE_DOMAIN'),
      path: '/',
    });
    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK) //statusを200番で変えす
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: this.config.get('COOKIE_SAME_SITE'),
      domain: this.config.get('COOKIE_DOMAIN'),
      path: '/',
    });
    return {
      message: 'ok',
    };
  }

  @Get('/')
  @UseGuards(AuthGuard('jwtAdmin'))
  async getProfileEmail(
    @Req() req: Request,
  ): Promise<Pick<Admin, 'id' | 'email'>> {
    // JWT トークンのペイロードからユーザーIDを取得
    const userId = req.user.id;
    const userData = await this.authService.getUser(userId);
    return userData;
  }
}
