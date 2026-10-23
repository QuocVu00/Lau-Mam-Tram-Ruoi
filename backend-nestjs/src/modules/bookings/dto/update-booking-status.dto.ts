import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '@prisma/client';

/**
 * @author Thành viên B (Task B3.1)
 * @description DTO cập nhật trạng thái đơn đặt bàn của Quản lý chi nhánh.
 */
export class UpdateBookingStatusDto {
  @IsNotEmpty({ message: 'Trạng thái đơn không được để trống' })
  @IsEnum(BookingStatus, {
    message: 'Trạng thái đơn phải là NEW, CONFIRMED hoặc DONE',
  })
  status: BookingStatus;
}
