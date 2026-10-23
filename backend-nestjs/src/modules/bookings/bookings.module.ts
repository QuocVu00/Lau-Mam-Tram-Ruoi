import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsGateway } from './bookings.gateway';

/**
 * @author Thành viên B (Task B3.1)
 * @description Module Đặt bàn / Mua mang về & Thông báo Realtime Socket.io ("Ting").
 */
@Module({
  controllers: [BookingsController],
  providers: [BookingsService, BookingsGateway],
  exports: [BookingsService, BookingsGateway],
})
export class BookingsModule {}
