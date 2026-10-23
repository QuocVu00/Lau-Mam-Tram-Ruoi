import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Role } from '@prisma/client';
import { Roles, RolesGuard, JwtAuthGuard } from '../../common';

/**
 * @author Thành viên B (Task B2.1)
 * @description Controller API quản lý tài khoản Quản lý chi nhánh (Role 2) dành riêng cho Admin.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @author Thành viên B (Task B2.1)
   * @description Lấy danh sách tài khoản Quản lý (Chỉ Super Admin - Role 3).
   * @endpoint GET /users/managers
   */
  @Get('managers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findManagers() {
    return this.usersService.findManagers();
  }

  /**
   * @author Thành viên B (Task B2.1)
   * @description Cấp mới tài khoản Quản lý và phân công chi nhánh (Chỉ Super Admin - Role 3).
   * @endpoint POST /users/managers
   */
  @Post('managers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createManager(@Body() dto: CreateManagerDto) {
    return this.usersService.createManager(dto);
  }

  /**
   * @author Thành viên B (Task B2.1)
   * @description Xóa tài khoản Quản lý chi nhánh (Chỉ Super Admin - Role 3).
   * @endpoint DELETE /users/managers/:id
   */
  @Delete('managers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteManager(@Param('id') id: string) {
    return this.usersService.deleteManager(id);
  }
}
