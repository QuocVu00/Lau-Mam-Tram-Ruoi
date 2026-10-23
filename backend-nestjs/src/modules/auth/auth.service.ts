/**
 * @file backend-nestjs/src/modules/auth/auth.service.ts
 * @description Xử lý nghiệp vụ xác thực người dùng: Đăng nhập Email/Mật khẩu và Google One Tap.
 * @author Thanh Vien A (Task A1.1)
 */

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { IJwtPayload } from '../../common/interfaces/contracts';

@Injectable()
export class AuthService {
  // Đối tượng giao tiếp với máy chủ Google OAuth
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Khởi tạo client Google với Client ID cấu hình trong file .env
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(clientId);
  }

  // ==========================================================================
  // 1. NGHIỆP VỤ ĐĂNG NHẬP CHO QUẢN LÝ (ROLE 2) & ADMIN (ROLE 3)
  // ==========================================================================
  /**
   * Xác thực tài khoản bằng Email và Mật khẩu
   * @param loginDto Chứa email và password từ người dùng
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Bước 1: Tìm người dùng trong cơ sở dữ liệu theo email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Nếu không tìm thấy người dùng hoặc tài khoản này không có mật khẩu (tài khoản đăng nhập qua Google)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // Bước 2: So sánh mật khẩu người dùng vừa nhập với chuỗi băm (hash) trong database bằng bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    // Bước 3: Đóng gói thông tin vào Payload theo đúng hợp đồng dữ liệu IJwtPayload đã cam kết với Thành viên B
    const payload: IJwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      branchId: user.branchId, // Quản lý thì có branchId, Admin thì null
    };

    // Bước 4: Ký và tạo ra chuỗi token JWT
    const accessToken = this.jwtService.sign(payload);

    // Bước 5: Trả về token kèm thông tin cơ bản của người dùng (không trả về passwordHash)
    return {
      message: 'Đăng nhập thành công!',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        branchId: user.branchId,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  // ==========================================================================
  // 2. NGHIỆP VỤ ĐĂNG NHẬP 1 CHẠM GOOGLE ONE TAP CHO KHÁCH (ROLE 1)
  // ==========================================================================
  /**
   * Xác thực mã Token của Google One Tap và tự động đăng ký tài khoản Khách nếu là lần đầu
   * @param googleAuthDto Chứa credential token gửi từ trình duyệt điện thoại
   */
  async loginWithGoogle(googleAuthDto: GoogleAuthDto) {
    const { credential } = googleAuthDto;

    let payloadGoogle: any;

    try {
      // Bước 1: Gửi mã credential lên máy chủ Google để kiểm tra xem có đúng là Google cấp không
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      payloadGoogle = ticket.getPayload();
    } catch (error) {
      // Nếu mã giả mạo hoặc hết hạn
      throw new BadRequestException('Mã xác thực Google không hợp lệ hoặc đã hết hạn!');
    }

    if (!payloadGoogle || !payloadGoogle.email) {
      throw new BadRequestException('Không thể lấy thông tin email từ tài khoản Google này!');
    }

    const { email, name, picture } = payloadGoogle;

    // Bước 2: Kiểm tra xem người dùng này đã có trong cơ sở dữ liệu chưa
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Bước 3: Nếu là khách mới lần đầu truy cập web -> Tự động tạo tài khoản vai trò CUSTOMER
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName: name || 'Khách hàng',
          avatarUrl: picture || null,
          role: Role.CUSTOMER, // Mặc định là Khách vãng lai
          passwordHash: null,  // Đăng nhập qua Google nên không có mật khẩu
          branchId: null,      // Khách vãng lai không thuộc chi nhánh nào cố định
        },
      });
    }

    // Bước 4: Đóng gói thông tin vào Payload JWT
    const payload: IJwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
    };

    // Bước 5: Cấp mã JWT Token cho khách
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập Google One Tap thành công!',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        branchId: user.branchId,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
