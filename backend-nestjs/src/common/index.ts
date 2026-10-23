/**
 * @file backend-nestjs/src/common/index.ts
 * @description Tệp xuất khẩu tập trung (Barrel export) các Decorator và Guard dùng chung.
 * Giúp Thành viên B hoặc các module khác chỉ cần 1 dòng import gọn gàng:
 * import { CurrentUser, Roles, JwtAuthGuard, RolesGuard } from 'src/common';
 */

export * from './decorators/current-user.decorator';
export * from './decorators/roles.decorator';
export * from './guards/jwt-auth.guard';
export * from './guards/roles.guard';
