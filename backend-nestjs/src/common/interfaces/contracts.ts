/**
 * @file backend-nestjs/src/common/interfaces/contracts.ts
 * @description Hợp đồng dữ liệu chuẩn dùng trong Backend.
 * @author Thanh Vien A & B
 */

export interface IJwtPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'MANAGER' | 'ADMIN';
  branchId: string | null;
}

export interface IReviewMedia {
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnailUrl?: string;
}

export interface IReviewSnapshot {
  originalReviewId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  rating: number;
  content: string;
  mediaUrls: IReviewMedia[];
  originalCreatedAt: string;
  deletionReason?: string;
}
