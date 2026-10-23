/**
 * @file backend-nestjs/src/prisma/prisma.module.ts
 * @description Module bọc PrismaService và khai báo @Global() để mọi Module khác
 * (Auth, Reviews, Branches, Bookings...) đều có thể dùng mà không cần import lại.
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Biến PrismaService thành dịch vụ toàn cục trong toàn bộ ứng dụng Backend
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Xuất PrismaService ra ngoài để các Module khác tiêm (inject) vào
})
export class PrismaModule {}
