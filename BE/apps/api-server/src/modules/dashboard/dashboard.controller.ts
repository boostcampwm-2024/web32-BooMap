import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@User() user) {
    this.logger.log('대시보드 조회 요청 수신');
    const responseData = await this.dashboardService.findAll(user.id);
    return responseData;
  }
}
