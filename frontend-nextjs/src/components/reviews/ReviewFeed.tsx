/**
 * @file frontend-nextjs/src/components/reviews/ReviewFeed.tsx
 * @description Bảng tin bài đánh giá từ thực khách:
 * - Hiển thị bài viết của TẤT CẢ các chi nhánh hoặc 1 chi nhánh đang lọc
 * - Mỗi thẻ bài đánh giá hiển thị rõ TÊN CHI NHÁNH
 * - Tông màu Nâu ấm cúng kết hợp chữ Vàng đồng chuẩn phong cách Miền Tây
 * - Bấm vào thẻ bài đánh giá sẽ kích hoạt luồng chọn bài và đi vào chi nhánh đó
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquarePlus, Edit3, Image as ImageIcon, ChevronDown, Store, MapPin, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IReview } from '@/lib/contracts';
import ReviewForm from './ReviewForm';

interface ReviewFeedProps {
  branchId?: string; // Nếu rỗng hoặc all thì lấy toàn bộ chi nhánh
  onSelectReviewBranch?: (branchId: string) => void; // Hàm callback khi khách bấm vào bài đánh giá
}

export function ReviewFeed({ branchId = '', onSelectReviewBranch }: ReviewFeedProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  // Hàm tải danh sách bài đánh giá từ Backend
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

  // Tự động tải lại khi đổi chi nhánh
  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  return (
    <div className="w-full max-w-xl mx-auto pb-6">
      {/* Thanh tiêu đề & Nút Viết đánh giá */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-base font-black text-yellow-400 flex items-center gap-2">
            <span>Đánh Giá Từ Thực Khách</span>
          </h2>
          <p className="text-xs text-amber-200/70">
            {branchId && branchId !== 'ALL'
              ? 'Đang xem bài viết của chi nhánh này'
              : 'Tổng hợp đánh giá toàn hệ thống (Chế độ xem)'}
          </p>
        </div>

        {/* ĐIỀU KIỆN NGHIỆP VỤ: 
            Chỉ cho phép khách bấm "Viết đánh giá" khi đã chọn 1 chi nhánh cụ thể. 
            Nếu đang ở mục tổng tất cả (ALL), KHÔNG cho ai đánh giá, chỉ để hiển thị đọc! */}
        {branchId && branchId !== 'ALL' ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 text-xs font-black rounded-xl shadow-md shadow-black/50 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-yellow-400/40"
          >
            <MessageSquarePlus className="w-4 h-4 text-stone-950" />
            <span>Viết đánh giá</span>
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-amber-300/80 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800/50">
            Chỉ xem tổng hợp
          </span>
        )}
      </div>

      {/* Hiệu ứng Skeleton Loading khi đang tải */}
      {isLoading && reviews.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 bg-[#2e160c] rounded-2xl border border-amber-900/60 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-950 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-24 h-3.5 bg-amber-950 rounded" />
                  <div className="w-36 h-2.5 bg-amber-950 rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-amber-950/60 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Thông báo nếu chưa có bài nào */}
      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-10 px-4 bg-[#241209]/80 rounded-2xl border border-dashed border-amber-900/80">
          <Star className="w-10 h-10 text-yellow-500/40 mx-auto mb-2" />
          <p className="text-sm font-bold text-amber-200">Chưa có bài đánh giá nào</p>
          <p className="text-xs text-amber-300/70 mt-0.5">Hãy là người đầu tiên chia sẻ cảm nhận về lẩu mắm nhé!</p>
        </div>
      )}

      {/* Danh sách các thẻ bài đánh giá */}
      <div className="space-y-3.5">
        {reviews.map((review) => {
          const isOwner = currentUserId && review.userId === currentUserId;
          // Tên chi nhánh của bài viết
          const branchName = review.branch?.name || (review.branchId === 'b2-default' ? 'Chi nhánh Bình Thạnh' : 'Chi nhánh Quận 1');

          return (
            <div
              key={review.id}
              onClick={() => onSelectReviewBranch && onSelectReviewBranch(review.branchId)}
              className="p-4 bg-gradient-to-br from-[#2e160c] to-[#1f0d06] rounded-2xl border border-amber-900/70 shadow-lg shadow-black/50 transition-all hover:border-yellow-400/60 cursor-pointer group"
            >
              {/* Thẻ Chi Nhánh gắn trên đầu mỗi bài đánh giá */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-amber-900/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                  <Store className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{branchName}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-300/80 font-medium">
                  <span>Xem chi nhánh</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Thông tin người đăng */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-stone-950 text-xs font-black uppercase shadow-sm border border-yellow-400/40">
                    {review.user?.fullName?.charAt(0) || 'K'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">
                      {review.user?.fullName || 'Khách hàng'}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {/* Số sao */}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-amber-300/60">•</span>
                      <span className="text-[10px] text-amber-300/60">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nhãn Đã sửa */}
                {review.isEdited && (
                  <span className="text-[10px] font-medium text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/40">
                    Đã sửa
                  </span>
                )}
              </div>

              {/* Nội dung nhận xét */}
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {review.content}
              </p>

              {/* Phương tiện đính kèm: Hỗ trợ cả Hình ảnh lẫn Video */}
              {review.mediaUrls && review.mediaUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {review.mediaUrls.map((media, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-amber-900/80 bg-black group/media">
                      {media.type === 'VIDEO' ? (
                        <video
                          src={media.url}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={media.url}
                          alt="Món ăn"
                          className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nút tải thêm đánh giá */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchReviews(page + 1, true)}
            disabled={isLoading}
            className="px-4 py-2 bg-[#2c150b] hover:bg-[#3d1e10] border border-amber-800/60 text-amber-200 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Tải thêm đánh giá</span>
            <ChevronDown className="w-3.5 h-3.5 text-yellow-400" />
          </button>
        </div>
      )}

      {/* Modal viết đánh giá */}
      {isFormOpen && (
        <ReviewForm
          branchId={branchId && branchId !== 'ALL' ? branchId : 'branch-q1-uuid-demo'}
          onSuccess={() => fetchReviews(1, false)}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
export default ReviewFeed;
