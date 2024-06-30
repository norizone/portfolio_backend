import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard('jwtAdmin'))
@Controller('admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/dashboard')
  getAllUsers(): Promise<any> {
    return this.dashboardService.dashboardData();
  }
}
