/**
 * @file backend-nestjs/src/app.module.ts
 * @description Root Module của toàn bộ Backend API.
 * ⚠️ QUY TẮC CHỐNG CONFLICT GIT: Mỗi thành viên chỉ thêm Module của mình vào đúng khu vực!
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

// ============================================================================
// [KHU VỰC DÀNH CHO THÀNH VIÊN A IMPORT MODULES]
// Ví dụ khi bạn viết xong AuthModule, ReviewModule:
// import { AuthModule } from './modules/auth/auth.module';
// import { ReviewsModule } from './modules/reviews/reviews.module';
// ============================================================================

// ============================================================================
// [KHU VỰC DÀNH CHO THÀNH VIÊN B IMPORT MODULES]
// import { BranchesModule } from './modules/branches/branches.module';
// import { BookingsModule } from './modules/bookings/bookings.module';
// ============================================================================

@Module({
  imports: [
    // 1. Cấu hình biến môi trường (.env) toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Module kết nối cơ sở dữ liệu PostgreSQL Prisma dùng chung
    PrismaModule,

    // ------------------------------------------------------------------------
    // 🔴 [MODULES CỦA THÀNH VIÊN A] - Bạn thêm các module của bạn tại đây:
    // AuthModule,
    // ReviewsModule,
    // DeletionLogsModule,
    // MediaModule,
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // 🔵 [MODULES CỦA THÀNH VIÊN B] - Thành viên B thêm module của họ tại đây:
    // BranchesModule,
    // UsersModule,
    // BookingsModule,
    // ------------------------------------------------------------------------
  ],
})
export class AppModule {}
