/**
 * @file backend-nestjs/src/prisma/prisma.service.ts
 * @description Dịch vụ quản lý vòng đời kết nối tới PostgreSQL thông qua Prisma ORM.
 * @author Dung chung cho ca Thanh Vien A va B
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Tự động kết nối tới cơ sở dữ liệu PostgreSQL ngay khi ứng dụng NestJS vừa khởi động.
   */
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Kết nối PostgreSQL thành công!');
    } catch (err) {
      console.warn('⚠️ Chưa kết nối được PostgreSQL (đang chạy chế độ demo/in-memory fallback):', (err as any).message);
    }
  }

  /**
   * Tự động đóng kết nối cơ sở dữ liệu an toàn khi tắt server hoặc khởi động lại.
   */
  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (e) {}
  }
}
