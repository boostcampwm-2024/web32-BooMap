import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from '@app/interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: AuthenticatedRequest) {
    return await this.userService.getUserInfo(req.user.id);
  }
}
