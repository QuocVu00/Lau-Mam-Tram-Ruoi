/**
 * @file backend-nestjs/src/modules/auth/auth.controller.ts
 * @description Bộ điều hướng (Controller) tiếp nhận các yêu cầu HTTP liên quan tới Xác thực.
 * @author Thanh Vien A (Task A1.1)
 */

import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../../common/interfaces/contracts';

@Controller('auth') // Tiền tố của toàn bộ các API trong file này là: /auth/...
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * API Đăng nhập Email/Mật khẩu dành cho Quản lý chi nhánh (Role 2) & Admin (Role 3)
   * Tuyến đường: POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Trả về mã HTTP 200 OK thay vì 201 Created mặc định của Post
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * API Đăng nhập 1 chạm bằng Google One Tap dành cho Khách vãng lai (Role 1)
   * Tuyến đường: POST /auth/google
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(googleAuthDto);
  }

  /**
   * API Lấy thông tin tài khoản hiện tại từ mã JWT Token
   * Tuyến đường: GET /auth/me
   * Yêu cầu: Bắt buộc phải đính kèm Header: Authorization: Bearer <token>
   */
  @Get('me')
  @UseGuards(JwtAuthGuard) // "Người gác cổng" kiểm tra token trước khi cho vào hàm này
  async getProfile(@CurrentUser() user: IJwtPayload) {
    return {
      message: 'Lấy thông tin tài khoản thành công!',
      currentUser: user,
    };
  }
}
