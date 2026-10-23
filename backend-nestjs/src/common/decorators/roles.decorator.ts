/**
 * @file backend-nestjs/src/common/decorators/roles.decorator.ts
 * @description Decorator dùng để gắn thẻ (Metadata) phân quyền trên từng API endpoint.
 * @author Thanh Vien A
 * 
 * Cách dùng:
 * @Roles('ADMIN')               -> Chỉ Admin được gọi
 * @Roles('ADMIN', 'MANAGER')   -> Cả Admin và Quản lý đều được gọi
 */

import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Khóa định danh dùng để lưu và đọc danh sách Role trong hệ thống Metadata của NestJS
export const ROLES_KEY = 'roles';

/**
 * Gắn danh sách vai trò được phép truy cập vào Controller hoặc Endpoint
 * @param roles Danh sách các vai trò (CUSTOMER, MANAGER, ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
