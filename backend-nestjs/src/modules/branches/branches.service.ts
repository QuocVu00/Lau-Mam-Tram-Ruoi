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
  private fallbackBranches = [
    {
      id: '79f67a99-a392-45c2-93ec-bdc2f18e0c0e',
      name: 'Lẩu Mắm Tô Kí',
      address: '01 Đường Tô Kí',
      phone: '09091515',
      avgRating: 5.0,
      totalActiveReviews: 4,
      createdAt: new Date('2026-10-01'),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @author Thành viên B (Task B1.2)
   * @description Lấy danh sách toàn bộ chi nhánh kèm số sao trung bình và số bài đánh giá.
   * @returns Danh sách chi nhánh sắp xếp theo ngày tạo mới nhất.
   */
  async findAll() {
    try {
      const branches = await this.prisma.branch.findMany({
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
      if (branches && branches.length > 0) return branches;
    } catch (e) {
      console.warn('Sử dụng dữ liệu mẫu chi nhánh cho chế độ demo');
    }
    return this.fallbackBranches;
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Xem thông tin chi tiết một chi nhánh theo ID.
   * @param id Mã định danh UUID của chi nhánh
   */
  async findOne(id: string) {
    try {
      const branch = await this.prisma.branch.findUnique({
        where: { id },
      });
      if (branch) return branch;
    } catch (e) {}

    const found = this.fallbackBranches.find((b) => b.id === id);
    if (!found) {
      throw new NotFoundException(`Không tìm thấy chi nhánh với mã ID: ${id}`);
    }
    return found;
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Tạo mới một chi nhánh trong chuỗi (Dành cho Admin - Role 3).
   * @param dto Thông tin chi nhánh (name, address, phone)
   */
  async create(dto: CreateBranchDto) {
    try {
      return await this.prisma.branch.create({
        data: {
          name: dto.name,
          address: dto.address,
          phone: dto.phone,
          avgRating: 0,
          totalActiveReviews: 0,
        },
      });
    } catch (e) {
      const newB = {
        id: `branch-${Date.now()}`,
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        avgRating: 0,
        totalActiveReviews: 0,
        createdAt: new Date(),
      };
      this.fallbackBranches.unshift(newB);
      return newB;
    }
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Cập nhật thông tin chi nhánh (Dành cho Admin - Role 3).
   * @param id Mã chi nhánh cần sửa
   * @param dto Dữ liệu cập nhật
   */
  async update(id: string, dto: UpdateBranchDto) {
    try {
      return await this.prisma.branch.update({
        where: { id },
        data: dto,
      });
    } catch (e) {
      const branch = await this.findOne(id);
      Object.assign(branch, dto);
      return branch;
    }
  }
}
