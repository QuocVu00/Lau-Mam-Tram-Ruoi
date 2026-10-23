import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from '../../common/interfaces/contracts';

@Controller('reviews') // Tiền tố: /reviews/...
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * API Đăng bài đánh giá mới
   * Tuyến đường: POST /reviews
   * Quyền: Bắt buộc đã đăng nhập (Khách đã chạm Google One Tap)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @CurrentUser('userId') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(userId, createReviewDto);
  }

  /**
   * API Lấy danh sách đánh giá theo chi nhánh (hỗ trợ cuộn trang Infinite Scroll)
   * Tuyến đường: GET /reviews?branchId=uuid-chi-nhanh&page=1&limit=10
   * Quyền: Công khai (ai cũng xem được)
   */
  @Get()
  async getReviewsByBranch(@Query() queryDto: QueryReviewDto) {
    return this.reviewsService.findAllByBranch(queryDto);
  }

  /**
   * API Chỉnh sửa bài đánh giá của chính mình
   * Tuyến đường: PATCH /reviews/:id
   * Quyền: Bắt buộc là chính chủ người đã viết bài
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @CurrentUser('userId') userId: string,
    @Param('id') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(userId, reviewId, updateReviewDto);
  }

  /**
   * API Xóa bài đánh giá vi phạm (Nghiệp vụ cốt lõi của Thành viên A)
   * Tuyến đường: DELETE /reviews/:id
   * Quyền: CHỈ DÀNH RIÊNG CHO QUẢN LÝ (MANAGER) VÀ ADMIN
   * (Khách hàng gọi vào API này sẽ lập tức bị chặn với lỗi 403 Forbidden)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  async deleteReview(
    @CurrentUser() user: IJwtPayload,
    @Param('id') reviewId: string,
    @Body() deleteReviewDto: DeleteReviewDto,
  ) {
    return this.reviewsService.deleteByManager(user, reviewId, deleteReviewDto);
  }
}

