/**
 * @file backend-nestjs/src/common/guards/jwt-auth.guard.ts
 * @description Người gác cổng (Guard) kiểm tra xem request gửi lên có đính kèm
 * mã JWT Token hợp lệ hay không (trong header: Authorization: Bearer <token>).
 * @author Thanh Vien A
 */

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * canActivate: Quyết định xem request có được phép đi tiếp hay bị chặn đứng lại.
   */
  canActivate(context: ExecutionContext) {
    // Gọi cơ chế xác thực mặc định của thư viện Passport JWT
    return super.canActivate(context);
  }

  /**
   * handleRequest: Tùy chỉnh thông báo lỗi nếu token không hợp lệ hoặc hết hạn.
   */
  handleRequest(err: any, user: any, info: any) {
    // Nếu có lỗi hoặc không tìm thấy thông tin user từ token -> Bắn ra lỗi 401 Unauthorized
    if (err || !user) {
      throw err || new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn! Vui lòng đăng nhập lại.');
    }

    // Trả về thông tin user đã giải mã để NestJS tự động gắn vào request.user
    return user;
  }
}
