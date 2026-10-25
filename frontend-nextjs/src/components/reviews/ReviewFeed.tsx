'use client';

/**
 * @file frontend-nextjs/src/components/reviews/ReviewFeed.tsx
 * @description Bảng tin đánh giá thực khách:
 * - Hỗ trợ lọc theo từng chi nhánh hoặc xem toàn bộ hệ thống
 * - Khi bấm vào bất kỳ bài đánh giá nào -> Mở ReviewDetailModal xem chi tiết, thả cảm xúc, bình luận
 * - Thích ứng hoàn hảo theo chế độ màu của máy (Light/Dark mode)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Star,
  MessageSquarePlus,
  Edit3,
  Image as ImageIcon,
  ChevronDown,
  Store,
  MapPin,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IReview } from '@/lib/contracts';
import ReviewForm from './ReviewForm';
import ReviewDetailModal from './ReviewDetailModal';

interface ReviewFeedProps {
  branchId?: string; // Nếu rỗng hoặc 'ALL' thì lấy toàn bộ chi nhánh
  onSelectReviewBranch?: (branchId: string) => void; // Hàm callback lọc sang chi nhánh cụ thể
}

export function ReviewFeed({ branchId = '', onSelectReviewBranch }: ReviewFeedProps) {
  // Danh sách các bài đánh giá nhận từ Backend
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Trạng thái mở modal viết đánh giá mới
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Bài đánh giá đang được chọn để mở Modal Xem Chi Tiết
  const [selectedReviewForDetail, setSelectedReviewForDetail] = useState<IReview | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Lấy userId hiện tại nếu khách đã đăng nhập
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('user_info');
      if (userInfoStr) {
        try {
          const user = JSON.parse(userInfoStr);
          setCurrentUserId(user.id);
        } catch {}
      }
    }
  }, []);

  // Hàm tải danh sách bài đánh giá từ Backend NestJS
  const fetchReviews = useCallback(
    async (targetPage: number = 1, append: boolean = false) => {
      setIsLoading(true);

      try {
        const queryParams: Record<string, any> = { page: targetPage, limit: 10 };
        if (branchId && branchId !== 'ALL') {
          queryParams.branchId = branchId;
        }

        const response = await apiClient<{
          data: IReview[];
          pagination: { page: number; totalCount: number; hasMore: boolean };
        }>('/reviews', {
          params: queryParams,
        });

        if (append) {
          setReviews((prev) => [...prev, ...(response.data || [])]);
        } else {
          setReviews(response.data || []);
        }

        setHasMore(response.pagination?.hasMore || false);
        setPage(targetPage);
      } catch (err) {
        console.warn('Lỗi khi tải đánh giá:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [branchId],
  );

  // Tự động tải lại khi đổi chi nhánh lọc
  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  return (
    <div className="w-full max-w-xl mx-auto pb-6">
      {/* 1. Thanh tiêu đề & Nút Viết đánh giá */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-base font-black text-[var(--primary)] flex items-center gap-2">
            <span>Đánh Giá Từ Thực Khách</span>
          </h2>
          <p className="text-xs text-[var(--text-sub)]">
            {branchId && branchId !== 'ALL'
              ? 'Đang xem bài viết của chi nhánh này'
              : 'Tổng hợp đánh giá toàn hệ thống (Chạm bài để xem chi tiết)'}
          </p>
        </div>

        {/* Nghiệp vụ: Chỉ cho phép viết đánh giá khi đã chọn 1 chi nhánh cụ thể */}
        {branchId && branchId !== 'ALL' ? (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:opacity-90 text-stone-950 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-yellow-400/40"
          >
            <MessageSquarePlus className="w-4 h-4 text-stone-950" />
            <span>Viết đánh giá</span>
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-[var(--text-sub)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-xl border border-[var(--border-color)]">
            Chỉ xem tổng hợp
          </span>
        )}
      </div>

      {/* 2. Hiệu ứng Skeleton Loading khi đang tải */}
      {isLoading && reviews.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[var(--bg-muted)] rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-24 h-3.5 bg-[var(--bg-muted)] rounded" />
                  <div className="w-36 h-2.5 bg-[var(--bg-muted)] rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-[var(--bg-muted)] rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* 3. Thông báo nếu chưa có bài nào */}
      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-10 px-4 bg-[var(--bg-card)] rounded-2xl border border-dashed border-[var(--border-color)]">
          <Star className="w-10 h-10 text-[var(--primary)]/40 mx-auto mb-2" />
          <p className="text-sm font-bold text-[var(--text-main)]">Chưa có bài đánh giá nào</p>
          <p className="text-xs text-[var(--text-sub)] mt-0.5">Hãy là người đầu tiên chia sẻ cảm nhận về lẩu mắm nhé!</p>
        </div>
      )}

      {/* 4. Danh sách các thẻ bài đánh giá */}
      <div className="space-y-3.5">
        {reviews.map((review) => {
          const isOwner = currentUserId && review.userId === currentUserId;
          // Tên chi nhánh của bài viết
          const branchName = review.branch?.name || (review.branchId === 'b2-default' ? 'Chi nhánh Bình Thạnh' : 'Chi nhánh Quận 1');

          return (
            <article
              key={review.id}
              onClick={() => setSelectedReviewForDetail(review)}
              className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group"
            >
              {/* Thẻ Chi Nhánh gắn trên đầu mỗi bài đánh giá */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={(e) => {
                    // Ngăn chặn sự kiện nổi bọt lên thẻ cha khi người dùng chỉ muốn lọc chi nhánh
                    e.stopPropagation();
                    if (onSelectReviewBranch) {
                      onSelectReviewBranch(review.branchId);
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline truncate"
                  title="Nhấn để chỉ xem chi nhánh này"
                >
                  <Store className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                  <span className="truncate">{branchName}</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-[var(--text-sub)] font-medium shrink-0">
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Thông tin người đăng */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-stone-950 text-xs font-black uppercase shadow-xs">
                    {review.user?.fullName?.charAt(0) || 'K'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-main)] leading-tight">
                      {review.user?.fullName || 'Khách hàng'}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {/* Số sao */}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[var(--text-sub)]">•</span>
                      <span className="text-[10px] text-[var(--text-sub)]">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nhãn Đã sửa nếu có */}
                {review.isEdited && (
                  <span className="text-[10px] font-medium text-[var(--text-sub)] bg-[var(--bg-muted)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
                    Đã sửa
                  </span>
                )}
              </div>

              {/* Nội dung nhận xét: Cắt tối đa 3 dòng nếu quá dài */}
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed line-clamp-3">
                {review.content}
              </p>

              {/* Phương tiện đính kèm (Ảnh & Video) */}
              {review.mediaUrls && review.mediaUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {review.mediaUrls.slice(0, 3).map((media, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border-color)] bg-black/40">
                      {media.type === 'VIDEO' ? (
                        <video
                          src={media.url}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={media.url}
                          alt="Món ăn"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Nút hành động trực quan báo hiệu khách có thể bấm xem chi tiết */}
              <div className="mt-3 pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--text-sub)]">
                  Chạm để xem chi tiết & tương tác
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-[var(--primary)] group-hover:translate-x-0.5 transition-transform">
                  <span>Xem bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* 5. Nút tải thêm đánh giá */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => fetchReviews(page + 1, true)}
            disabled={isLoading}
            className="px-4 py-2 bg-[var(--bg-muted)] hover:opacity-90 border border-[var(--border-color)] text-[var(--text-main)] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Tải thêm đánh giá</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--primary)]" />
          </button>
        </div>
      )}

      {/* 6. Modal viết đánh giá mới */}
      {isFormOpen && (
        <ReviewForm
          branchId={branchId && branchId !== 'ALL' ? branchId : 'branch-q1-uuid-demo'}
          onSuccess={() => fetchReviews(1, false)}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* 7. Modal xem chi tiết bài đánh giá (Khi người dùng bấm vào bài bất kỳ) */}
      <ReviewDetailModal
        review={selectedReviewForDetail}
        onClose={() => setSelectedReviewForDetail(null)}
        onFilterBranch={onSelectReviewBranch}
      />
    </div>
  );
}

export default ReviewFeed;

