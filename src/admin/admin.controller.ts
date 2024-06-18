import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { USER_ROLE } from 'src/util/enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(USER_ROLE.ADMIN)
@Controller('admin')
export class AdminController {
  //TODO: adminで使用するやつはこっちで使えるようにする
}
