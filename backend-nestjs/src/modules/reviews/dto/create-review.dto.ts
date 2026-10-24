/**
 * @file backend-nestjs/src/modules/reviews/dto/create-review.dto.ts
 * @description Khuôn mẫu dữ liệu (DTO) khi Khách hàng gửi bài đánh giá mới.
 * @author Thanh Vien A (Task A2.1)
 */

import { IsNotEmpty, IsString, IsInt, Min, Max, MinLength, IsArray, IsOptional } from 'class-validator';
import { IReviewMedia } from '../../../common/interfaces/contracts';

export class CreateReviewDto {
  // Mã ID chi nhánh mà khách muốn đánh giá (bắt buộc)
  @IsString({ message: 'Mã chi nhánh phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Vui lòng chọn chi nhánh cần đánh giá!' })
  branchId: string;

  // Điểm đánh giá: Bắt buộc là số nguyên từ 1 đến 5
  @IsInt({ message: 'Điểm đánh giá phải là số nguyên!' })
  @Min(1, { message: 'Điểm đánh giá tối thiểu là 1!' })
  @Max(5, { message: 'Điểm đánh giá tối đa là 5!' })
  rating: number;

  // Nội dung cảm nhận của khách
  @IsString({ message: 'Nội dung nhận xét phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Vui lòng nhập nội dung đánh giá!' })
  @MinLength(5, { message: 'Nội dung đánh giá phải có ít nhất 5 ký tự!' })
  content: string;

  // Danh sách hình ảnh / video đính kèm (không bắt buộc, nếu có thì là mảng JSON)
  @IsArray({ message: 'Danh sách ảnh/video phải là một mảng!' })
  @IsOptional()
  mediaUrls?: IReviewMedia[];
}
