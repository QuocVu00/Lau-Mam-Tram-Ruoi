/**
 * @file backend-nestjs/src/modules/reviews/dto/query-review.dto.ts
 * @description Khuôn mẫu dữ liệu truy vấn danh sách đánh giá (hỗ trợ phân trang Infinite Scroll).
 * @author Thanh Vien A (Task A2.1)
 */

import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryReviewDto {
  // Lọc đánh giá theo chi nhánh cụ thể
  @IsString({ message: 'branchId phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Vui lòng cung cấp branchId cần lấy đánh giá!' })
  branchId: string;

  // Trang số mấy (mặc định trang 1)
  @Type(() => Number) // Tự động ép kiểu chuỗi từ URL "?page=1" thành số 1
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  // Số lượng bài viết lấy trong 1 lần tải (mặc định 10 bài để tối ưu mạng điện thoại)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
