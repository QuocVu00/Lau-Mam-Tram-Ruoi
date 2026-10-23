/**
 * @file backend-nestjs/src/modules/auth/auth.module.ts
 * @description Đóng gói toàn bộ tính năng Xác thực (Controller, Service, JwtStrategy).
 * @author Thanh Vien A (Task A1.1)
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // Lấy mã bí mật ký token từ biến môi trường
        secret: configService.get<string>('JWT_SECRET') || 'lau_mam_tram_ruoi_super_secret_jwt_key_2026',
        signOptions: {
          // Token có hiệu lực trong 7 ngày
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule], // Xuất ra để các module khác nếu cần dùng
})
export class AuthModule {}
