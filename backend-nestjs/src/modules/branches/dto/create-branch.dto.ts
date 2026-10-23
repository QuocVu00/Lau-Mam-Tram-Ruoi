import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @author Thành viên B (Task B1.2)
 * @description DTO truyền dữ liệu khi Admin (Role 3) tạo chi nhánh mới.
 */
export class CreateBranchDto {
  @IsNotEmpty({ message: 'Tên chi nhánh không được để trống' })
  @IsString({ message: 'Tên chi nhánh phải là chuỗi ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Địa chỉ quán không được để trống' })
  @IsString({ message: 'Địa chỉ quán phải là chuỗi ký tự' })
  address: string;

  @IsNotEmpty({ message: 'Số điện thoại hotline không được để trống' })
  @IsString({ message: 'Số điện thoại hotline phải là chuỗi ký tự' })
  phone: string;
}
