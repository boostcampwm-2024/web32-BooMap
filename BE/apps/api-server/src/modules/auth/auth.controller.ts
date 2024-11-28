import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserCreateDto } from '../user/dto';

export interface AuthenticatedRequest extends Request {
  user: {
    id?: number;
    email: string;
    name?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const email = req.user.email;
    let user = await this.userService.findByGithubEmail(email);

    if (!user) {
      const newUser = plainToInstance(UserCreateDto, req.user);
      user = await this.userService.createGithubUser(newUser);
    }

    const refreshToken = this.authService.generateRefreshToken(user);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.redirect(`/auth`);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async googleLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async googleLoginCallback(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const email = req.user.email;
    let user = await this.userService.findByKakaoEmail(email);

    if (!user) {
      const newUser = plainToInstance(UserCreateDto, req.user);
      user = await this.userService.createKakaoUser(newUser);
    }

    const refreshToken = this.authService.generateRefreshToken(user);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.redirect(`/auth`);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = await this.authService.verifiedRefreshToken(refreshToken);
    res.json({ accessToken });
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.json({ message: 'success' });
  }
}
