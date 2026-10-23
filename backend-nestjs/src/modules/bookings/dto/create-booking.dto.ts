import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BookingType } from '@prisma/client';

/**
 * @author Thành viên B (Task B3.1)
 * @description DTO gửi yêu cầu Đặt bàn hoặc Mua mang về từ Khách hàng.
 */
export class CreateBookingDto {
  @IsNotEmpty({ message: 'Chi nhánh không được để trống' })
  @IsString({ message: 'Mã chi nhánh phải là chuỗi UUID' })
  branchId: string;

  @IsNotEmpty({ message: 'Tên khách hàng không được để trống' })
  @IsString({ message: 'Tên khách hàng phải là chuỗi ký tự' })
  customerName: string;

  @IsNotEmpty({ message: 'Số điện thoại Zalo không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  zaloPhone: string;

  @IsOptional()
  @IsNumber({}, { message: 'Số lượng khách phải là số' })
  @Min(1, { message: 'Số lượng khách phải từ 1 người trở lên' })
  guestCount?: number;

  @IsNotEmpty({ message: 'Loại đơn không được để trống' })
  @IsEnum(BookingType, { message: 'Loại đơn phải là BOOK_TABLE hoặc TAKEAWAY' })
  type: BookingType;

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  details?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
