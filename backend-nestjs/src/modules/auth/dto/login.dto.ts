/**
 * @file backend-nestjs/src/modules/auth/dto/login.dto.ts
 * @description Khuôn mẫu dữ liệu (DTO) khi Quản lý hoặc Admin gửi yêu cầu đăng nhập.
 * @author Thanh Vien A
 */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  // Bắt buộc phải là định dạng email hợp lệ (VD: manager@laumam.vn)
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @IsNotEmpty({ message: 'Vui lòng không để trống email!' })
  email: string;

  // Mật khẩu bắt buộc là chuỗi, tối thiểu 6 ký tự
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Vui lòng không để trống mật khẩu!' })
  @MinLength(6, { message: 'Mật khẩu phải có độ dài ít nhất 6 ký tự!' })
  password: string;
}
