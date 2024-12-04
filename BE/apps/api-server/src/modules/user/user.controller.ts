import { Controller, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@User() user) {
    try {
      return await this.userService.getUserInfo(user.id);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
