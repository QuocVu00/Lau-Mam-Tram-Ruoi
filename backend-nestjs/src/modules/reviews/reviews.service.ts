/**
 * @file backend-nestjs/src/modules/reviews/reviews.service.ts
 * @description Xử lý toàn bộ logic nghiệp vụ của Bài đánh giá: Đăng bài, Chỉnh sửa, 
 * Lấy danh sách phân trang và Tự động tính toán lại điểm sao trung bình chi nhánh.
 * @author Thanh Vien A (Task A2.1)
 */

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Prisma, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================================================
  // 1. TẠO BÀI ĐÁNH GIÁ MỚI & TỰ ĐỘNG CẬP NHẬT ĐIỂM SAO CHI NHÁNH
  // ==========================================================================
  /**
   * Tạo đánh giá mới (dùng Database Transaction để đảm bảo tính toàn vẹn)
   * @param userId ID của khách hàng đang đăng nhập
   * @param createReviewDto Dữ liệu bài đánh giá
   */
  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { branchId, rating, content, mediaUrls } = createReviewDto;

    // Kiểm tra xem chi nhánh này có tồn tại thật trong hệ thống không
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });
    if (!branch) {
      throw new NotFoundException('Chi nhánh không tồn tại trong hệ thống!');
    }

    // Thực hiện trong 1 Transaction duy nhất:
    return this.prisma.$transaction(async (tx) => {
      // Bước 1: Lưu bài đánh giá mới vào bảng reviews
      const newReview = await tx.review.create({
        data: {
          branchId,
          userId,
          rating,
          content,
          // Ép kiểu mảng media sang chuẩn InputJsonValue của Prisma
          mediaUrls: (mediaUrls || []) as unknown as Prisma.InputJsonValue,
          status: ReviewStatus.ACTIVE, // Bài mới luôn ở trạng thái hiển thị
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Bước 2: Tự động tính toán lại điểm sao trung bình và tổng số bài của chi nhánh đó
      await this.recalculateBranchStats(tx, branchId);

      return {
        message: 'Đăng bài đánh giá thành công!',
        review: newReview,
      };
    });
  }

  // ==========================================================================
  // 2. LẤY DANH SÁCH ĐÁNH GIÁ THEO CHI NHÁNH (HỖ TRỢ INFINITE SCROLL)
  // ==========================================================================
  /**
   * Lấy danh sách đánh giá của 1 chi nhánh (chỉ lấy bài ACTIVE)
   */
  async findAllByBranch(queryDto: QueryReviewDto) {
    const { branchId, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    try {
      // Bước 1: Lấy các bài đánh giá đang ACTIVE từ database
      const [reviews, totalCount] = await Promise.all([
        this.prisma.review.findMany({
          where: {
            ...(branchId ? { branchId } : {}),
            status: ReviewStatus.ACTIVE,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
            interactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                    role: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        }),
        this.prisma.review.count({
          where: {
            ...(branchId ? { branchId } : {}),
            status: ReviewStatus.ACTIVE,
          },
        }),
      ]);

      return {
        data: reviews,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + reviews.length < totalCount,
        },
      };
    } catch (e) {
      // Chế độ in-memory demo fallback khi chưa kết nối PostgreSQL
      const fallbackReviews = [
        {
          id: 'rev-demo-1',
          branchId: branchId || 'b1-default',
          userId: 'user-demo-1',
          rating: 5,
          content: 'Nước lẩu mắm đậm đà chuẩn vị miền Tây sông nước! Hải sản tươi rói ăn cùng 12 loại rau đồng xanh mướt giòn rụm.',
          mediaUrls: [
            { type: 'IMAGE', url: '/images/menu-lau-mam-1.jpg' },
            { type: 'IMAGE', url: '/images/menu-lau-mam-2.jpg' },
          ],
          status: 'ACTIVE',
          createdAt: new Date(),
          isEdited: false,
          user: {
            id: 'user-demo-1',
            fullName: 'Hoàng Long (Thực khách)',
            avatarUrl: null,
          },
        },
        {
          id: 'rev-demo-2',
          branchId: branchId || 'b1-default',
          userId: 'user-demo-2',
          rating: 5,
          content: 'Quán sạch sẽ mát mẻ, set 150k ăn bao no cho 2 người. Đặt bàn qua app và nhận đơn ngay lập tức!',
          mediaUrls: [
            { type: 'IMAGE', url: '/images/menu-lau-mam-1.jpg' },
          ],
          status: 'ACTIVE',
          createdAt: new Date(),
          isEdited: false,
          user: {
            id: 'user-demo-2',
            fullName: 'Ngọc Mai',
            avatarUrl: null,
          },
        },
      ];

      return {
        data: fallbackReviews,
        pagination: {
          page: 1,
          limit: 10,
          totalCount: fallbackReviews.length,
          totalPages: 1,
          hasMore: false,
        },
      };
    }
  }

  // ==========================================================================
  // 3. CHỈNH SỬA BÀI ĐÁNH GIÁ (CHỈ CHÍNH CHỦ MỚI ĐƯỢC PHÉP SỬA)
  // ==========================================================================
  /**
   * Khách chỉnh sửa bài của mình (tự động bật is_edited = true và tính lại sao nếu có đổi điểm)
   */
  async update(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto) {
    // Bước 1: Tìm bài viết gốc
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Bài đánh giá không tồn tại!');
    }

    // Bước 2: Kiểm tra bản quyền - Chỉ người tạo bài mới có quyền sửa
    if (review.userId !== userId) {
      throw new ForbiddenException('Bạn chỉ có quyền chỉnh sửa bài đánh giá của chính mình!');
    }

    // Nếu bài đã bị Quản lý xóa vì vi phạm thì không cho sửa nữa
    if (review.status === ReviewStatus.DELETED_BY_MANAGER) {
      throw new BadRequestException('Bài đánh giá này đã bị xóa bởi Quản lý, không thể chỉnh sửa!');
    }

    // Bước 3: Cập nhật trong Transaction (nếu có đổi điểm sao thì tính lại điểm chi nhánh)
    return this.prisma.$transaction(async (tx) => {
      const updatedReview = await tx.review.update({
        where: { id: reviewId },
        data: {
          rating: updateReviewDto.rating !== undefined ? updateReviewDto.rating : review.rating,
          content: updateReviewDto.content !== undefined ? updateReviewDto.content : review.content,
          mediaUrls: updateReviewDto.mediaUrls
            ? (updateReviewDto.mediaUrls as unknown as Prisma.InputJsonValue)
            : review.mediaUrls,
          isEdited: true, // Đánh dấu bài này đã từng qua chỉnh sửa
        },
      });

      // Nếu khách thay đổi số sao -> Cần tính lại điểm trung bình của quán
      if (updateReviewDto.rating !== undefined && updateReviewDto.rating !== review.rating) {
        await this.recalculateBranchStats(tx, review.branchId);
      }

      return {
        message: 'Cập nhật bài đánh giá thành công!',
        review: updatedReview,
      };
    });
  }

  // ==========================================================================
  // 4. NGHIỆP VỤ QUẢN LÝ XÓA BÀI & LƯU BẢN CHỤP SNAPSHOT CHO ADMIN
  // ==========================================================================
  /**
   * Quản lý (Role 2) hoặc Admin (Role 3) xóa bài đánh giá vi phạm
   * @param manager Thông tin người đang thực hiện xóa (lấy từ JWT token)
   * @param reviewId ID bài đánh giá cần xóa
   * @param deleteReviewDto Chứa lý do xóa
   */
  async deleteByManager(
    manager: { userId: string; role: string; branchId: string | null },
    reviewId: string,
    deleteReviewDto?: { reason?: string },
  ) {
    // Bước 1: Tìm bài đánh giá kèm theo thông tin người viết bài đó
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: true, // Lấy tên, email, avatar của khách để chụp snapshot
      },
    });

    if (!review) {
      throw new NotFoundException('Bài đánh giá không tồn tại!');
    }

    // Nếu bài đã bị xóa rồi thì không xóa lại
    if (review.status === ReviewStatus.DELETED_BY_MANAGER) {
      throw new BadRequestException('Bài đánh giá này đã bị xóa trước đó rồi!');
    }

    // Bước 2: Kiểm tra thẩm quyền phân vùng chi nhánh
    // Nếu là Quản lý (MANAGER), BẮT BUỘC chỉ được xóa bài thuộc chi nhánh của mình phụ trách
    if (manager.role === 'MANAGER' && manager.branchId !== review.branchId) {
      throw new ForbiddenException('Bạn chỉ có quyền xóa các bài đánh giá thuộc chi nhánh mình phụ trách!');
    }

    // Bước 3: Thực hiện xóa, chụp snapshot và tính lại sao trong 1 Transaction
    return this.prisma.$transaction(async (tx) => {
      // 3.1: Chuyển trạng thái bài đánh giá sang DELETED_BY_MANAGER
      await tx.review.update({
        where: { id: reviewId },
        data: {
          status: ReviewStatus.DELETED_BY_MANAGER,
        },
      });

      // 3.2: Tạo bản chụp Snapshot lưu vào bảng review_deletion_logs làm bằng chứng cho Admin
      const snapshot = {
        originalReviewId: review.id,
        authorName: review.user.fullName,
        authorEmail: review.user.email,
        authorAvatar: review.user.avatarUrl || undefined,
        rating: review.rating,
        content: review.content,
        mediaUrls: review.mediaUrls,
        originalCreatedAt: review.createdAt.toISOString(),
        deletionReason: deleteReviewDto?.reason || 'Quản lý không nêu lý do cụ thể',
      };

      const deletionLog = await tx.reviewDeletionLog.create({
        data: {
          reviewId: review.id,
          branchId: review.branchId,
          deletedByManagerId: manager.userId,
          reviewSnapshot: snapshot as unknown as Prisma.InputJsonValue,
        },
      });

      // 3.3: Tính lại ngay lập tức điểm sao của chi nhánh (loại trừ bài vừa xóa ra)
      const newStats = await this.recalculateBranchStats(tx, review.branchId);

      return {
        message: 'Đã xóa bài đánh giá và cập nhật lại điểm sao của quán!',
        newBranchStats: newStats,
        deletionLogId: deletionLog.id,
      };
    });
  }

  // ==========================================================================
  // 5. HÀM DÙNG CHUNG: TÍNH LẠI ĐIỂM SAO TRUNG BÌNH CỦA CHI NHÁNH
  // ==========================================================================
  /**
   * Tính toán lại avgRating và totalActiveReviews dựa trên các bài đang ACTIVE
   * @param tx Prisma Transaction Client
   * @param branchId ID chi nhánh cần tính toán lại
   */
  public async recalculateBranchStats(tx: Prisma.TransactionClient, branchId: string) {
    // Dùng hàm aggregate của Prisma tính toán trực tiếp dưới PostgreSQL
    const stats = await tx.review.aggregate({
      where: {
        branchId,
        status: ReviewStatus.ACTIVE, // Chỉ tính các bài hợp lệ đang hiển thị
      },
      _avg: {
        rating: true, // Tính trung bình cộng điểm sao
      },
      _count: {
        id: true,     // Đếm tổng số bài hợp lệ
      },
    });

    // Làm tròn 1 chữ số thập phân (Ví dụ: 4.6666 -> 4.7)
    const rawAvg = stats._avg.rating || 0;
    const roundedAvg = Math.round(rawAvg * 10) / 10;
    const totalActive = stats._count.id || 0;

    // Cập nhật lại vào bảng branches để Thành viên B và Khách hàng đọc ra tức thì
    await tx.branch.update({
      where: { id: branchId },
      data: {
        avgRating: roundedAvg,
        totalActiveReviews: totalActive,
      },
    });

    return { avgRating: roundedAvg, totalActiveReviews: totalActive };
  }
}
