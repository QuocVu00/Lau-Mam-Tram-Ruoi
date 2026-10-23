/**
 * @file frontend-nextjs/src/components/reviews/ReviewForm.tsx
 * @description Form viết bài đánh giá mới dành cho Khách hàng (Role 1).
 * @author Thanh Vien A (Task A2.2)
 */

'use client';

import { useState } from 'react';
import { Star, Image as ImageIcon, X, Send } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IReviewMedia } from '@/lib/contracts';

interface ReviewFormProps {
  branchId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ReviewForm({ branchId, onSuccess, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(5); // Mặc định chấm 5 sao
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaList, setMediaList] = useState<IReviewMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Thêm đường dẫn ảnh vào danh sách
  const handleAddMedia = () => {
    if (!mediaUrlInput.trim()) return;
    setMediaList((prev) => [...prev, { type: 'IMAGE', url: mediaUrlInput.trim() }]);
    setMediaUrlInput('');
  };

  // Xóa ảnh khỏi danh sách đính kèm
  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  // Nút gửi bài đánh giá
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 5) {
      setError('Nội dung đánh giá phải có ít nhất 5 ký tự!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Gửi bài đánh giá sang API Backend: POST /reviews
      await apiClient('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          branchId,
          rating,
          content: content.trim(),
          mediaUrls: mediaList,
        }),
      });

      // Thông báo cho component cha tải lại danh sách bài viết
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Bạn cần đăng nhập để gửi bài đánh giá!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Khung Form trượt từ dưới lên trên Mobile */}
      <div className="w-full sm:max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-slideUp sm:animate-fadeIn">
        {/* Thanh tiêu đề */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white">
            Viết đánh giá món ăn
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Chọn số sao (1-5 sao) */}
          <div className="text-center py-2">
            <p className="text-xs text-stone-500 mb-2 font-medium">Bạn chấm món ăn này mấy sao?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform active:scale-125"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 dark:text-stone-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              {rating === 5 && 'Tuyệt vời, ngon chuẩn vị! 🍲'}
              {rating === 4 && 'Rất ngon, sẽ quay lại! 👍'}
              {rating === 3 && 'Tạm ổn, cần cải thiện! 👌'}
              {rating === 2 && 'Chưa được ngon lắm! 😐'}
              {rating === 1 && 'Rất thất vọng! 👎'}
            </span>
          </div>

          {/* Ô nhập nội dung nhận xét */}
          <div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nồi lẩu mắm hôm nay thế nào? Nước lẩu có đậm đà, rau và cá có tươi ngon không?..."
              required
              className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none transition-all"
            />
          </div>

          {/* Ô đính kèm ảnh */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">
              Đính kèm hình ảnh món ăn:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                placeholder="Dán link ảnh (https://...)"
                className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddMedia}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            {/* Xem trước danh sách ảnh đã thêm */}
            {mediaList.length > 0 && (
              <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
                {mediaList.map((media, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0 group">
                    <img src={media.url} alt="Review" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-red-600 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Gửi bài đánh giá</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
