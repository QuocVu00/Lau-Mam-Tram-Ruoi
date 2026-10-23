/**
 * @file backend-nestjs/src/common/guards/roles.guard.ts
 * @description Người gác cổng (Guard) kiểm tra quyền hạn (Role) của người dùng.
 * @author Thanh Vien A
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IJwtPayload } from '../../../../shared/contracts';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector là công cụ của NestJS giúp đọc các Metadata (thẻ) gắn trên controller
  constructor(private reflector: Reflector) {}

  /**
   * canActivate: So sánh quyền của user hiện tại với các quyền được phép của API.
   */
  canActivate(context: ExecutionContext): boolean {
    // Bước 1: Đọc danh sách vai trò được yêu cầu từ Decorator @Roles() gắn trên endpoint hoặc controller
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Kiểm tra trên từng hàm (endpoint)
      context.getClass(),   // Kiểm tra trên cả class Controller
    ]);

    // Nếu endpoint đó không khai báo @Roles(), nghĩa là API này công khai hoặc chỉ cần đăng nhập là được vào
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Bước 2: Lấy thông tin user hiện tại từ request (được gắn bởi JwtAuthGuard trước đó)
    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    // Nếu chưa đăng nhập hoặc không có vai trò hợp lệ -> Từ chối truy cập
    if (!user || !user.role) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này!');
    }

    // Bước 3: Kiểm tra xem vai trò của user có nằm trong danh sách được phép không
    const hasPermission = requiredRoles.includes(user.role as Role);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Quyền '${user.role}' không được phép thực hiện hành động này. Yêu cầu: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
