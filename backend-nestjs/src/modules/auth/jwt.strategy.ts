/**
 * @file backend-nestjs/src/modules/auth/jwt.strategy.ts
 * @description Chiến lược xác thực Passport JWT dùng để giải mã và kiểm tra tính hợp lệ của token.
 * @author Thanh Vien A
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../../common/interfaces/contracts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 1. Tự động tìm và bóc tách token nằm sau chữ 'Bearer ' trong header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Không bỏ qua token hết hạn (nếu token quá hạn sẽ tự động báo lỗi ngay)
      ignoreExpiration: false,

      // 3. Khóa bí mật dùng để đối chiếu chữ ký số của token (đọc từ file .env)
      secretOrKey: configService.get<string>('JWT_SECRET') || 'lau_mam_tram_ruoi_super_secret_jwt_key_2026',
    });
  }

  /**
   * Hàm validate được Passport tự động gọi sau khi đã giải mã và xác nhận token hợp lệ.
   * Dữ liệu trả về từ hàm này sẽ được NestJS gắn thẳng vào đối tượng `request.user`.
   * @param payload Dữ liệu chứa bên trong token theo chuẩn IJwtPayload
   */
  async validate(payload: IJwtPayload): Promise<IJwtPayload> {
    // Kiểm tra xem payload có đầy đủ thông tin tối thiểu không
    if (!payload.userId || !payload.role) {
      throw new UnauthorizedException('Token bị lỗi hoặc thiếu thông tin định danh!');
    }

    // Trả về thông tin người dùng sạch sẽ để các Guard và Decorator sử dụng
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      branchId: payload.branchId,
    };
  }
}
