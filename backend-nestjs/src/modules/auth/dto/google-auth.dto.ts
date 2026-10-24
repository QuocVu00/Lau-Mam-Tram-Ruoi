/**
 * @file backend-nestjs/src/modules/auth/dto/google-auth.dto.ts
 * @description Khuôn mẫu dữ liệu (DTO) khi Khách vãng lai (Role 1) đăng nhập bằng Google One Tap.
 * @author Thanh Vien A
 */

import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  /**
   * Mã chuỗi xác thực (Google ID Token) do thư viện Google Identity Services (GIS)
   * trên trình duyệt điện thoại của khách trả về khi họ chạm 1 lần vào popup Google One Tap.
   */
  @IsString({ message: 'Credential phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Mã xác thực Google không được để trống!' })
  credential: string;
}
