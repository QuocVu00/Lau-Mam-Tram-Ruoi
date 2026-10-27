'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/reviews/page.tsx
 * @description Trang BÀI ĐÁNH GIÁ RIÊNG BIỆT:
 * - Hiển thị các bài đánh giá kèm tên chi nhánh
 * - Có bộ lọc chi nhánh lấy động từ Backend NestJS hoặc xem tất cả
 * - Nút viết đánh giá (chụp ảnh, quay video, thư viện)
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Store, Star, Award } from 'lucide-react';
import { ReviewFeed } from '@/components/reviews/ReviewFeed';
import { apiClient } from '@/lib/api';

// Định nghĩa kiểu dữ liệu chi nhánh
interface BranchTab {
  id: string;
  name: string;
}

function CustomerReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const branchParam = searchParams.get('branchId') || 'ALL';

  // Chi nhánh đang được lọc để xem hoặc viết đánh giá
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branchParam);

  // Danh sách các chi nhánh động tải từ Backend NestJS (dự phòng Tô Kí)
  const [branches, setBranches] = useState<BranchTab[]>([
    { id: '79f67a99-a392-45c2-93ec-bdc2f18e0c0e', name: 'Lẩu Mắm Tô Kí' },
  ]);

  // Tự động tải danh sách chi nhánh trực tiếp từ Backend khi mở trang
  useEffect(() => {
    async function loadBranches() {
      try {
        // Gửi GET /branches tới NestJS
        const data = await apiClient<any[]>('/branches');
        if (Array.isArray(data) && data.length > 0) {
          // Lấy ID và Tên của từng chi nhánh để làm danh sách tab lọc
          setBranches(
            data.map((b) => ({
              id: b.id,
              name: b.name,
            })),
          );
        }
      } catch (err) {
        console.warn('Không thể tải chi nhánh từ backend cho trang reviews:', err);
      }
    }

    loadBranches();
  }, []);

  // Xử lý chuyển đổi chi nhánh qua URL query parameter
  const handleFilterBranch = (branchId: string) => {
    setSelectedBranchId(branchId);
    if (branchId === 'ALL') {
      router.replace('/reviews');
    } else {
      router.replace(`/reviews?branchId=${branchId}`);
    }
  };

  return (
    <div className="space-y-4 transition-colors duration-200">


      {/* Thanh cuộn ngang chọn chi nhánh lọc (Filter Chips) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Nút lọc tất cả các chi nhánh */}
        <button
          type="button"
          onClick={() => handleFilterBranch('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
            selectedBranchId === 'ALL'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 font-black shadow-xs'
              : 'bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          Tất cả chi nhánh
        </button>

        {/* Lặp qua danh sách chi nhánh lấy từ Backend để render các nút bấm */}
        {branches.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => handleFilterBranch(b.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedBranchId === b.id
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 font-black shadow-xs'
                : 'bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Danh sách các bài đánh giá của chi nhánh */}
      <div className="pt-1">
        <ReviewFeed
          branchId={selectedBranchId}
          onSelectReviewBranch={handleFilterBranch}
        />
      </div>
    </div>
  );
}

export default function CustomerReviewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-yellow-500/70">Đang tải bài đánh giá...</div>}>
      <CustomerReviewsContent />
    </Suspense>
  );
}
