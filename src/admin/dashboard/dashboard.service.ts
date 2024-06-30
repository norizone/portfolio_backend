import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async dashboardData(): Promise<any> {
    const toolCountPromise = this.prisma.tool.count();
    const userCountPromise = this.prisma.user.count();
    const workCountPromise = this.prisma.work.count();

    const [toolCount, userCount, workCount] = await Promise.all([
      toolCountPromise,
      userCountPromise,
      workCountPromise,
    ]);
    return {
      toolCount,
      userCount,
      workCount,
    };
  }
}
