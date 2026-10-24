/**
 * @file backend-nestjs/src/contracts.ts
 * @description Bản sao hợp đồng dữ liệu dùng chung trong backend-nestjs
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
