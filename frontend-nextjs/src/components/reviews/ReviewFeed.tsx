'use client';

/**
 * @file frontend-nextjs/src/components/reviews/ReviewFeed.tsx
 * @author Thành viên A (Task A2.2)
 * @description Luồng hiển thị bài đánh giá (Reviews Feed) theo branchId.
 * (Placeholder sẵn sàng để Thành viên A tích hợp API NestJS, Skeleton Loading, HLS video)
 */

import React from 'react';
import { Star, MessageSquare, ThumbsUp, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewFeedProps {
  branchId?: string;
}

export function ReviewFeed({ branchId }: ReviewFeedProps) {
  // Dữ liệu mẫu ban đầu để giao diện hiển thị trực quan sinh động
  const sampleReviews = [
    {
      id: 'rev-1',
      authorName: 'Hoàng Long',
      rating: 5,
      content: 'Nước lẩu đậm đà chuẩn vị miền Tây! Cà tím mềm thơm, hải sản tươi rói ăn cùng rau đắng, bông so đũa giòn sần sật.',
      createdAt: '2 giờ trước',
      likes: 12,
      replies: 2,
    },
    {
      id: 'rev-2',
      authorName: 'Bích Phương',
      rating: 5,
      content: 'Quán rộng rãi, nhân viên chu đáo. Set lẩu mắm 150k quá no cho 2 người, nước dùng ngọt thanh không bị gắt mùi mắm.',
      createdAt: '5 giờ trước',
      likes: 8,
      replies: 1,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Đánh Giá Thực Tế Từ Khách Hàng</span>
        </h2>
        <span className="text-xs text-amber-400 font-medium">Mới nhất</span>
      </div>

      <div className="space-y-3">
        {sampleReviews.map((rev) => (
          <Card key={rev.id} className="p-4 space-y-3">
            {/* Header: Author & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                  {rev.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.authorName}</h4>
                  <span className="text-[10px] text-neutral-400">{rev.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-3.5 w-3.5 ${
                      idx < rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <p className="text-xs text-neutral-300 leading-relaxed">{rev.content}</p>

            {/* Media Banner Placeholder */}
            <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-2.5 flex items-center gap-2 text-neutral-400 text-xs">
              <ImageIcon className="h-4 w-4 text-amber-500" />
              <span>Ảnh & Video lẩu mắm tươi ngon (Đang tải...)</span>
            </div>

            {/* Actions: Thả cảm xúc & Bình luận */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
              <button className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{rev.likes} Thích</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{rev.replies} Bình luận</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
