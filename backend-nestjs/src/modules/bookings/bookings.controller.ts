import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Role } from '@prisma/client';
import { Roles, RolesGuard, JwtAuthGuard, CurrentUser } from '../../common';
import { IJwtPayload } from '../../../../shared/contracts';

/**
 * @author Thành viên B (Task B3.1)
 * @description Controller API Đặt bàn & Mua mang về qua Zalo.
 */
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * @author Thành viên B (Task B3.1)
   * @description Khách hàng (Role 1) gửi yêu cầu Đặt bàn / Mang về qua Zalo.
   * Khi gửi thành công, tự động bắn tín hiệu Socket.io "Ting" xuống Quản lý chi nhánh.
   * @endpoint POST /bookings
   */
  @Post()
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBookingAndNotifyManager(dto);
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Lấy danh sách đơn đặt theo chi nhánh (Quản lý Role 2 & Admin Role 3).
   * @endpoint GET /bookings/branch/:branchId
   */
  @Get('branch/:branchId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async findByBranch(@Param('branchId') branchId: string) {
    return this.bookingsService.findByBranch(branchId);
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Quản lý cập nhật trạng thái đơn (NEW -> CONFIRMED -> DONE).
   * @endpoint PATCH /bookings/:id/status
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    return this.bookingsService.updateStatus(id, dto, user);
  }
}
