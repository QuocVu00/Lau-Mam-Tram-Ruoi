import { IsOptional, IsString } from 'class-validator';

/**
 * @author Thành viên B (Task B1.2)
 * @description DTO cập nhật thông tin chi nhánh.
 */
export class UpdateBranchDto {
  @IsOptional()
  @IsString({ message: 'Tên chi nhánh phải là chuỗi ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ quán phải là chuỗi ký tự' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại hotline phải là chuỗi ký tự' })
  phone?: string;
}
