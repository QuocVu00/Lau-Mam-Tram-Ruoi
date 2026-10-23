/**
 * @file backend-nestjs/src/modules/deletion-logs/deletion-logs.service.ts
 * @description Xử lý nghiệp vụ kiểm soát Lịch sử xóa đánh giá dành riêng cho Admin (Role 3).
 * @author Thanh Vien A (Task A3.1)
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeletionLogsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lấy danh sách lịch sử xóa của toàn bộ hệ thống (dành cho Dashboard của Admin)
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [logs, totalCount] = await Promise.all([
      this.prisma.reviewDeletionLog.findMany({
        skip,
        take: limit,
        orderBy: {
          deletedAt: 'desc', // Bài mới bị xóa xếp lên đầu
        },
        include: {
          // Lấy thông tin chi nhánh nơi bài viết bị xóa
          branch: {
            select: {
              id: true,
              name: true,
            },
          },
          // Lấy thông tin Quản lý nào đã thực hiện hành động xóa
          deletedByManager: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),

      this.prisma.reviewDeletionLog.count(),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Xem chi tiết bản chụp Snapshot của 1 bài bị xóa
   * @param id ID của bản ghi lịch sử xóa
   */
  async findOne(id: string) {
    const log = await this.prisma.reviewDeletionLog.findUnique({
      where: { id },
      include: {
        branch: true,
        deletedByManager: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!log) {
      throw new NotFoundException('Không tìm thấy bản ghi lịch sử xóa này!');
    }

    return log;
  }

  /**
   * Admin thực hiện quyền "Xóa vĩnh viễn" bản ghi lịch sử xóa
   * @param id ID của bản ghi lịch sử cần xóa
   */
  async remove(id: string) {
    // Kiểm tra xem bản ghi có tồn tại không
    await this.findOne(id);

    // Xóa vĩnh viễn khỏi bảng review_deletion_logs
    await this.prisma.reviewDeletionLog.delete({
      where: { id },
    });

    return {
      message: 'Đã xóa vĩnh viễn bản ghi lịch sử này khỏi hệ thống!',
    };
  }
}
