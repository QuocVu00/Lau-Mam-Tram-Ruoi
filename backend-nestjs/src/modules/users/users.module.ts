import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * @author Thành viên B (Task B2.1)
 * @description Module quản lý Tài khoản Người dùng & Nhân sự Quản lý (Role 2).
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
