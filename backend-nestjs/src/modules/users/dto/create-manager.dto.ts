import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * @author Thành viên B (Task B2.1)
 * @description DTO truyền dữ liệu khi Admin (Role 3) tạo tài khoản Quản lý chi nhánh (Role 2).
 */
export class CreateManagerDto {
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự' })
  fullName: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Chi nhánh quản lý không được để trống' })
  @IsString({ message: 'Mã chi nhánh phải là chuỗi UUID' })
  branchId: string;
}
