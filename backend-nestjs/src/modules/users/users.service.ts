import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

/**
 * @author Thành viên B (Task B2.1)
 * @description Xử lý logic quản lý nhân sự Quản lý chi nhánh (Role 2) dành riêng cho Admin (Role 3).
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @author Thành viên B (Task B2.1)
   * @description Lấy danh sách tất cả các tài khoản Quản lý chi nhánh (Role 2).
   * @returns Danh sách tài khoản MANAGER kèm tên chi nhánh được phân công.
   */
  async findManagers() {
    // Bước 1: Truy vấn danh sách người dùng có role là MANAGER
    return this.prisma.user.findMany({
      where: { role: Role.MANAGER },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        branchId: true,
        createdAt: true,
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });
  }

  /**
   * @author Thành viên B (Task B2.1)
   * @description Cấp mới tài khoản Quản lý (Role 2) và gán vào một chi nhánh cụ thể.
   * @param dto Thông tin tài khoản quản lý (fullName, email, password, branchId)
   */
  async createManager(dto: CreateManagerDto) {
    // Bước 1: Kiểm tra email đã có người sử dụng chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email này đã được đăng ký trong hệ thống!');
    }

    // Bước 2: Kiểm tra chi nhánh được phân công có tồn tại hợp lệ không
    const branch = await this.prisma.branch.findUnique({
      where: { id: dto.branchId },
    });

    if (!branch) {
      throw new BadRequestException('Mã chi nhánh được phân công không tồn tại!');
    }

    // Bước 3: Mã hóa mật khẩu bảo mật bằng bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Bước 4: Lưu tài khoản Quản lý mới vào bảng users với role MANAGER
    const newManager = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        role: Role.MANAGER,
        branchId: dto.branchId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        branchId: true,
        createdAt: true,
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return newManager;
  }

  /**
   * @author Thành viên B (Task B2.1)
   * @description Xóa tài khoản Quản lý chi nhánh theo ID (Chỉ Admin mới có quyền).
   * @param id Mã định danh UUID của tài khoản quản lý
   */
  async deleteManager(id: string) {
    // Bước 1: Kiểm tra xem tài khoản có tồn tại và đúng là MANAGER không
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản để xóa!');
    }

    if (user.role !== Role.MANAGER) {
      throw new BadRequestException('Bạn chỉ có thể xóa tài khoản Quản lý qua chức năng này!');
    }

    // Bước 2: Xóa tài khoản khỏi cơ sở dữ liệu
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Đã xóa tài khoản Quản lý thành công.' };
  }
}
