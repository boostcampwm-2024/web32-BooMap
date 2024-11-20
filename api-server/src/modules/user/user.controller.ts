import { UserInfoDto } from './dto/user.info.dto';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/interface';
import { instanceToPlain } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.getUserInfo(req.user.id);
    const UserInfoDto = instanceToPlain<UserInfoDto>(user, { excludeExtraneousValues: true });
    return UserInfoDto;
  }
}
