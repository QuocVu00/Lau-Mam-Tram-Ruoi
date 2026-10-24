/**
 * @file frontend-nextjs/src/lib/contracts.ts
 * @description Kiểu dữ liệu TypeScript chuẩn dùng cho toàn bộ Frontend Next.js.
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

export interface IReview {
  id: string;
  branchId: string;
  userId: string;
  rating: number;
  content: string;
  mediaUrls: IReviewMedia[];
  isEdited: boolean;
  status: 'ACTIVE' | 'DELETED_BY_MANAGER';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  };
  branch?: {
    id: string;
    name: string;
    address: string;
  };
  interactions?: Array<{
    id: string;
    type: 'REPLY' | 'REACTION';
    reactionType?: string;
    replyContent?: string;
    createdAt: string;
    user: {
      id: string;
      fullName: string;
      role: string;
    };
  }>;
}

export interface IDeletionLog {
  id: string;
  reviewId: string;
  branchId: string;
  deletedByManagerId: string;
  reviewSnapshot: IReviewSnapshot;
  deletedAt: string;
  branch: {
    id: string;
    name: string;
  };
  deletedByManager: {
    id: string;
    fullName: string;
    email: string;
  };
}
