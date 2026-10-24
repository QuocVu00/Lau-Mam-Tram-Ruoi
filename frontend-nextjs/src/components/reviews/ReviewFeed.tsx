/**
 * @file frontend-nextjs/src/components/reviews/ReviewFeed.tsx
 * @description Dòng thời gian hiển thị danh sách đánh giá của chi nhánh (Mobile-First).
 * @author Thanh Vien A & B (Task A2.2)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquarePlus, Edit3, ChevronDown, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IReview } from '@/lib/contracts';
import ReviewForm from './ReviewForm';

interface ReviewFeedProps {
  branchId?: string;
}

export function ReviewFeed({ branchId = '' }: ReviewFeedProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Lấy userId hiện tại từ token đã lưu để kiểm tra xem bài nào là của chính mình
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
        const response = await apiClient<{
          data: IReview[];
          pagination: { page: number; totalCount: number; hasMore: boolean };
        }>('/reviews', {
          params: branchId ? { branchId, page: targetPage, limit: 10 } : { page: targetPage, limit: 10 },
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

  // Tự động tải lại khi đổi chi nhánh (branchId thay đổi)
  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  return (
    <div className="w-full max-w-xl mx-auto pb-10">
      {/* Thanh tác vụ: Nút viết đánh giá */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Đánh Giá Thực Tế Từ Thực Khách</span>
          </h2>
          <p className="text-xs text-neutral-400">Trải nghiệm ăn uống chân thực tại quán</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Viết đánh giá</span>
        </button>
      </div>

      {/* Hiệu ứng khung xương mờ (Skeleton Loading) khi đang tải */}
      {isLoading && reviews.length === 0 && (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-full" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3.5 bg-neutral-800 rounded" />
                  <div className="w-16 h-2.5 bg-neutral-800 rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-neutral-800/60 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Thông báo nếu chưa có bài nào */}
      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-10 px-4 bg-neutral-900/60 rounded-2xl border border-dashed border-neutral-800">
          <Star className="w-10 h-10 text-amber-500/40 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-200">Chưa có bài đánh giá nào</p>
          <p className="text-xs text-neutral-400 mt-0.5">Hãy là người đầu tiên chia sẻ cảm nhận về lẩu mắm nhé!</p>
        </div>
      )}

      {/* Danh sách các thẻ bài đánh giá */}
      <div className="space-y-3.5">
        {reviews.map((review) => {
          const isOwner = currentUserId && review.userId === currentUserId;

          return (
            <div
              key={review.id}
              className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm transition-all hover:border-amber-500/30"
            >
              {/* Thông tin người đăng */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
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
                              s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-neutral-500">•</span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nhãn minh bạch "Đã chỉnh sửa" và nút Sửa bài (nếu là chính chủ) */}
                <div className="flex items-center gap-1.5">
                  {review.isEdited && (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Đã sửa
                    </span>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => alert('Khách có thể bấm sửa điểm sao và nội dung bài của mình!')}
                      className="p-1 text-neutral-400 hover:text-amber-400 rounded-lg transition-all cursor-pointer"
                      title="Chỉnh sửa bài của bạn"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Nội dung nhận xét */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {review.content}
              </p>

              {/* Phương tiện đính kèm: Hỗ trợ cả Hình ảnh lẫn Video */}
              {review.mediaUrls && review.mediaUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {review.mediaUrls.map((media, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-800 bg-black group">
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Tải thêm đánh giá</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal viết đánh giá */}
      {isFormOpen && (
        <ReviewForm
          branchId={branchId}
          onSuccess={() => fetchReviews(1, false)}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}

export default ReviewFeed;
