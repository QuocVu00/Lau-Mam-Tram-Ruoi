/**
 * @file backend-nestjs/src/modules/reviews/dto/delete-review.dto.ts
 * @description Khuôn mẫu dữ liệu (DTO) khi Quản lý chi nhánh gửi yêu cầu xóa bài đánh giá.
 * @author Thanh Vien A (Task A3.1)
 */

import { IsOptional, IsString, MaxLength } from 'class-validator';

export class DeleteReviewDto {
  /**
   * Lý do Quản lý xóa bài này (tùy chọn nhưng khuyến khích ghi rõ)
   * Ví dụ: "Bình luận spam", "Nội dung xúc phạm", "Cạnh tranh không lành mạnh"
   */
  @IsString({ message: 'Lý do xóa phải là chuỗi ký tự!' })
  @MaxLength(255, { message: 'Lý do xóa không được vượt quá 255 ký tự!' })
  @IsOptional()
  reason?: string;
}
