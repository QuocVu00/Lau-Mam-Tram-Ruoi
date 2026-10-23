/**
 * @file backend-nestjs/src/modules/reviews/dto/update-review.dto.ts
 * @description Khuôn mẫu dữ liệu (DTO) khi Khách hàng chỉnh sửa bài đánh giá của chính mình.
 * @author Thanh Vien A (Task A2.1)
 */

import { IsInt, Min, Max, MinLength, IsArray, IsOptional, IsString } from 'class-validator';
import { IReviewMedia } from '../../../common/interfaces/contracts';

export class UpdateReviewDto {
  // Điểm sao mới (nếu khách muốn đổi số sao)
  @IsInt({ message: 'Điểm đánh giá phải là số nguyên!' })
  @Min(1, { message: 'Điểm đánh giá tối thiểu là 1!' })
  @Max(5, { message: 'Điểm đánh giá tối đa là 5!' })
  @IsOptional()
  rating?: number;

  // Nội dung nhận xét đã sửa
  @IsString({ message: 'Nội dung nhận xét phải là chuỗi ký tự!' })
  @MinLength(5, { message: 'Nội dung đánh giá phải có ít nhất 5 ký tự!' })
  @IsOptional()
  content?: string;

  // Danh sách ảnh/video mới (nếu có thêm bớt)
  @IsArray({ message: 'Danh sách ảnh/video phải là một mảng!' })
  @IsOptional()
  mediaUrls?: IReviewMedia[];
}
