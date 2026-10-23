import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

/**
 * @author Thành viên B (Task B1.2)
 * @description Xử lý toàn bộ logic nghiệp vụ quản lý Chi nhánh trong hệ thống Lẩu Mắm Trăm Rưỡi.
 */
@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @author Thành viên B (Task B1.2)
   * @description Lấy danh sách toàn bộ chi nhánh kèm số sao trung bình và số bài đánh giá.
   * @returns Danh sách chi nhánh sắp xếp theo ngày tạo mới nhất.
   */
  async findAll() {
    // Bước 1: Truy vấn toàn bộ chi nhánh từ cơ sở dữ liệu
    return this.prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        avgRating: true,
        totalActiveReviews: true,
        createdAt: true,
      },
    });
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Xem thông tin chi tiết một chi nhánh theo ID.
   * @param id Mã định danh UUID của chi nhánh
   */
  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      throw new NotFoundException(`Không tìm thấy chi nhánh với mã ID: ${id}`);
    }

    return branch;
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Tạo mới một chi nhánh trong chuỗi (Dành cho Admin - Role 3).
   * @param dto Thông tin chi nhánh (name, address, phone)
   */
  async create(dto: CreateBranchDto) {
    // Bước 1: Lưu chi nhánh mới vào database với điểm đánh giá mặc định là 0
    return this.prisma.branch.create({
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        avgRating: 0,
        totalActiveReviews: 0,
      },
    });
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Cập nhật thông tin chi nhánh (Dành cho Admin - Role 3).
   * @param id Mã chi nhánh cần sửa
   * @param dto Dữ liệu cập nhật
   */
  async update(id: string, dto: UpdateBranchDto) {
    // Bước 1: Kiểm tra xem chi nhánh có tồn tại không
    await this.findOne(id);

    // Bước 2: Cập nhật thông tin vào cơ sở dữ liệu
    return this.prisma.branch.update({
      where: { id },
      data: dto,
    });
  }
}
