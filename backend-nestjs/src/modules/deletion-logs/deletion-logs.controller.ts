/**
 * @file backend-nestjs/src/modules/deletion-logs/deletion-logs.controller.ts
 * @description Bộ điều hướng tiếp nhận các yêu cầu kiểm soát Lịch sử xóa của Admin.
 * ⚠️ BẢO MẬT TUYỆT ĐỐI: Toàn bộ controller này được khóa cứng chỉ dành riêng cho ADMIN (Role 3).
 * @author Thanh Vien A (Task A3.1)
 */

import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { DeletionLogsService } from './deletion-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('deletion-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN) // Chỉ Super Admin mới được bước chân vào các API dưới đây!
export class DeletionLogsController {
  constructor(private readonly deletionLogsService: DeletionLogsService) {}

  /**
   * API Xem danh sách toàn bộ các bài bị Quản lý xóa ở tất cả chi nhánh
   * Tuyến đường: GET /deletion-logs?page=1&limit=10
   */
  @Get()
  async getLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.deletionLogsService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  /**
   * API Xem chi tiết bản chụp Snapshot (ảnh, video, chữ, lý do xóa) của 1 bài bị xóa
   * Tuyến đường: GET /deletion-logs/:id
   */
  @Get(':id')
  async getLogDetail(@Param('id') id: string) {
    return this.deletionLogsService.findOne(id);
  }

  /**
   * API Xóa vĩnh viễn bản ghi lịch sử này khỏi hệ thống (Đặc quyền riêng của Admin)
   * Tuyến đường: DELETE /deletion-logs/:id
   */
  @Delete(':id')
  async deleteLog(@Param('id') id: string) {
    return this.deletionLogsService.remove(id);
  }
}
