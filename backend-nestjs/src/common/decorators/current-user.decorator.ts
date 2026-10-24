/**
 * @file backend-nestjs/src/common/decorators/current-user.decorator.ts
 * @description Decorator tùy chỉnh giúp trích xuất trực tiếp thông tin người dùng
 * (đã được JwtAuthGuard giải mã từ token) ngay tại tham số của hàm trong Controller.
 * @author Thanh Vien A
 * 
 * Cách dùng trong Controller:
 * @Get('profile')
 * getProfile(@CurrentUser() user: IJwtPayload) {
 *   return user;
 * }
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { IJwtPayload } from '../interfaces/contracts';

export const CurrentUser = createParamDecorator(
  /**
   * @param data Dữ liệu truyền vào decorator (nếu có, ví dụ @CurrentUser('userId'))
   * @param ctx Ngữ cảnh thực thi của request hiện tại trong NestJS
   */
  (data: keyof IJwtPayload | undefined, ctx: ExecutionContext) => {
    // Lấy đối tượng request từ giao thức HTTP
    const request = ctx.switchToHttp().getRequest();

    // Đối tượng user này đã được JwtAuthGuard gán vào request sau khi xác thực token hợp lệ
    const user = request.user as IJwtPayload;

    // Nếu người dùng chỉ định lấy 1 trường cụ thể (ví dụ @CurrentUser('userId')), chỉ trả về trường đó
    if (data && user) {
      return user[data];
    }

    // Mặc định trả về toàn bộ thông tin người dùng trong token ({ userId, email, role, branchId })
    return user;
  },
);
