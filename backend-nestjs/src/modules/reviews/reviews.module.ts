/**
 * @file backend-nestjs/src/modules/reviews/reviews.module.ts
 * @description Đóng gói toàn bộ module quản lý Bài đánh giá của Thành viên A.
 * @author Thanh Vien A (Task A2.1)
 */

import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService], // Xuất ReviewsService ra ngoài để module khác (như Xóa đánh giá) dùng lại
})
export class ReviewsModule {}
