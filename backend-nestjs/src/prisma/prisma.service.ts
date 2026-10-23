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
    await this.$connect();
  }

  /**
   * Tự động đóng kết nối cơ sở dữ liệu an toàn khi tắt server hoặc khởi động lại.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
