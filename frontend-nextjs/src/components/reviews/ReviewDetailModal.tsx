'use client';

/**
 * @file frontend-nextjs/src/components/reviews/ReviewDetailModal.tsx
 * @description Modal xem chi tiết bài đánh giá dạng BottomSheet chuẩn điện thoại:
 * - Hiển thị đầy đủ thông tin: Người đánh giá, Số sao, Thời gian, Chi nhánh
 * - Xem ảnh và phát video món ăn kích thước lớn
 * - Thả cảm xúc tương tác (Thích, Yêu thích, Ngon miệng)
 * - Đọc và viết phản hồi / bình luận cho bài đánh giá
 * - Nút chuyển nhanh sang lọc bài viết của chi nhánh này
 */

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Star,
  Store,
  MapPin,
  Heart,
  ThumbsUp,
  Smile,
  MessageSquare,
  Send,
  ArrowRight,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { IReview } from '@/lib/contracts';

interface ReviewDetailModalProps {
  review: IReview | null;
  onClose: () => void;
  onFilterBranch?: (branchId: string) => void;
}

export function ReviewDetailModal({
  review,
  onClose,
  onFilterBranch,
}: ReviewDetailModalProps) {
  // Nếu không có bài đánh giá được chọn thì không hiển thị gì
  if (!review) return null;

  // Tên chi nhánh được hiển thị
  const branchName =
    review.branch?.name ||
    (review.branchId === 'b2-default'
      ? 'Chi nhánh Bình Thạnh'
      : 'Chi nhánh Quận 1');

  // Trạng thái cảm xúc đã chọn của người dùng hiện tại
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  // Danh sách các cảm xúc mẫu kèm số lượng
  const [reactionsCount, setReactionsCount] = useState({
    LIKE: 12,
    LOVE: 8,
    YUMMY: 25,
  });

  // Trạng thái nội dung phản hồi mới đang nhập
  const [newComment, setNewComment] = useState('');

  // Danh sách các phản hồi (bao gồm các phản hồi có sẵn từ backend hoặc phản hồi mẫu)
  const [comments, setComments] = useState<Array<{ id: string; author: string; role: string; content: string; time: string }>>([
    {
      id: 'c1',
      author: 'Lẩu Mắm Trăm Rưỡi',
      role: 'Chủ quán',
      content: 'Cảm ơn quý khách đã ghé thăm và gửi đánh giá quý báu cho quán ạ! Rất mong được đón tiếp quý khách trong những lần sau.',
      time: 'Vừa xong',
    },
    ...(review.interactions
      ?.filter((i) => i.type === 'REPLY' && i.replyContent)
      .map((i) => ({
        id: i.id,
        author: i.user?.fullName || 'Thực khách',
        role: i.user?.role === 'MANAGER' ? 'Quản lý' : 'Thực khách',
        content: i.replyContent || '',
        time: new Date(i.createdAt).toLocaleDateString('vi-VN'),
      })) || []),
  ]);

  // Hàm xử lý khi khách bấm thả cảm xúc
  const handleToggleReaction = (type: 'LIKE' | 'LOVE' | 'YUMMY') => {
    if (selectedReaction === type) {
      // Hủy cảm xúc nếu bấm lại lần 2
      setSelectedReaction(null);
      setReactionsCount((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    } else {
      // Đổi cảm xúc mới
      setReactionsCount((prev) => {
        const updated = { ...prev };
        if (selectedReaction) {
          updated[selectedReaction as 'LIKE' | 'LOVE' | 'YUMMY'] -= 1;
        }
        updated[type] += 1;
        return updated;
      });
      setSelectedReaction(type);
    }
  };

  // Hàm gửi phản hồi bình luận mới
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Lấy tên khách hàng đang đăng nhập hoặc mặc định
    let authorName = 'Bạn';
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          authorName = user.fullName || 'Bạn';
        } catch {}
      }
    }

    // Thêm bình luận mới vào danh sách hiển thị
    const newEntry = {
      id: `local-${Date.now()}`,
      author: authorName,
      role: 'Thực khách',
      content: newComment.trim(),
      time: 'Vừa xong',
    };

    setComments((prev) => [...prev, newEntry]);
    setNewComment('');
  };

  return (
    // Lớp phủ nền mờ (Backdrop)
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Khung nội dung BottomSheet: Trượt từ dưới lên trên di động */}
      <div className="w-full max-w-md max-h-[90vh] bg-[var(--bg-card)] text-[var(--text-main)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        
        {/* 1. Header của Modal: Nút Đóng & Tiêu đề */}
        <div className="px-4 py-3.5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-muted)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--primary)]">
              Chi Tiết Bài Đánh Giá
            </h3>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--bg-card)] hover:opacity-80 flex items-center justify-center border border-[var(--border-color)] text-[var(--text-main)] active:scale-90 transition-transform cursor-pointer"
            title="Đóng chi tiết"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Vùng cuộn xem nội dung chi tiết bài viết */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Thông tin Chi Nhánh & Nút Lọc riêng chi nhánh */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-[var(--primary)] shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-[var(--text-main)] truncate">
                  {branchName}
                </h4>
                <p className="text-[10px] text-[var(--text-sub)] truncate">
                  Đặc sản Lẩu Mắm Nam Bộ
                </p>
              </div>
            </div>

            {onFilterBranch && (
              <button
                type="button"
                onClick={() => {
                  onFilterBranch(review.branchId);
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--primary)] text-stone-950 text-[11px] font-black shrink-0 shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                <span>Xem chi nhánh</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Tác giả & Đánh giá sao */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar khách */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-stone-950 text-sm font-black uppercase shadow-xs">
                {review.user?.fullName?.charAt(0) || 'K'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <span>{review.user?.fullName || 'Khách hàng'}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                </h4>
                <p className="text-[11px] text-[var(--text-sub)]">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Khối hiển thị số sao to đẹp */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-black text-amber-500">
                {review.rating}.0
              </span>
            </div>
          </div>

          {/* Nội dung bài nhận xét */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-color)]">
            <p className="text-sm leading-relaxed text-[var(--text-main)] whitespace-pre-wrap">
              {review.content}
            </p>
          </div>

          {/* Hình ảnh và video đính kèm chất lượng cao */}
          {review.mediaUrls && review.mediaUrls.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
                Hình ảnh & Video đính kèm ({review.mediaUrls.length})
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {review.mediaUrls.map((media, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black"
                  >
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
                        alt="Ảnh món ăn"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Phần Thả Cảm Xúc (Reactions) */}
          <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
            <h5 className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
              Cảm Xúc Của Bạn
            </h5>
            <div className="flex items-center gap-2">
              {/* Nút Thích */}
              <button
                type="button"
                onClick={() => handleToggleReaction('LIKE')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-95 cursor-pointer ${
                  selectedReaction === 'LIKE'
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-black shadow-xs'
                    : 'bg-[var(--bg-muted)] text-[var(--text-main)] border-[var(--border-color)]'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Thích ({reactionsCount.LIKE})</span>
              </button>

              {/* Nút Thả Tim */}
              <button
                type="button"
                onClick={() => handleToggleReaction('LOVE')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-95 cursor-pointer ${
                  selectedReaction === 'LOVE'
                    ? 'bg-rose-500 text-white border-rose-500 font-black shadow-xs'
                    : 'bg-[var(--bg-muted)] text-[var(--text-main)] border-[var(--border-color)]'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Yêu thích ({reactionsCount.LOVE})</span>
              </button>

              {/* Nút Ngon Miệng */}
              <button
                type="button"
                onClick={() => handleToggleReaction('YUMMY')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-95 cursor-pointer ${
                  selectedReaction === 'YUMMY'
                    ? 'bg-amber-600 text-white border-amber-600 font-black shadow-xs'
                    : 'bg-[var(--bg-muted)] text-[var(--text-main)] border-[var(--border-color)]'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Ngon ({reactionsCount.YUMMY})</span>
              </button>
            </div>
          </div>

          {/* 4. Phần Danh Sách Phản Hồi & Bình Luận */}
          <div className="pt-2 border-t border-[var(--border-color)] space-y-2.5">
            <h5 className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Phản hồi & Thảo luận ({comments.length})</span>
            </h5>

            <div className="space-y-2">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-color)] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span>{c.author}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/15 text-[var(--primary)] font-semibold">
                        {c.role}
                      </span>
                    </span>
                    <span className="text-[10px] text-[var(--text-sub)]">
                      {c.time}
                    </span>
                  </div>
                  <p className="text-[var(--text-main)] text-[12px] leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Khung nhập bình luận cố định ở đáy modal */}
        <form
          onSubmit={handleSendComment}
          className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-muted)] flex items-center gap-2 shrink-0 pb-safe"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết phản hồi của bạn..."
            className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-sub)] focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="w-9 h-9 rounded-xl bg-[var(--primary)] hover:opacity-90 disabled:opacity-40 text-stone-950 flex items-center justify-center shrink-0 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Gửi phản hồi"
          >
            <Send className="w-4 h-4 text-stone-950" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewDetailModal;
