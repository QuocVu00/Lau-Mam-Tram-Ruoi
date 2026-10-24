'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/reviews/page.tsx
 * @description Trang BÀI ĐÁNH GIÁ RIÊNG BIỆT:
 * - Hiển thị các bài đánh giá kèm tên chi nhánh
 * - Có bộ lọc chi nhánh hoặc xem tất cả
 * - Nút viết đánh giá (chụp ảnh, quay video, thư viện)
 */

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Store, Star, Award } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ReviewFeed } from '@/components/reviews/ReviewFeed';

function CustomerReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const branchParam = searchParams.get('branchId') || 'ALL';

  const [selectedBranchId, setSelectedBranchId] = useState<string>(branchParam);

  const handleFilterBranch = (branchId: string) => {
    setSelectedBranchId(branchId);
    if (branchId === 'ALL') {
      router.replace('/reviews');
    } else {
      router.replace(`/reviews?branchId=${branchId}`);
    }
  };

  return (
    <div className="space-y-4 text-amber-100">
      {/* Header trang đánh giá */}
      <div className="-mx-4 -mt-3 mb-2">
        <Header currentBranchName="Đánh giá" />
      </div>

      {/* Nút quay lại trang giới thiệu */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors bg-[#2e160c] px-3 py-1.5 rounded-xl border border-amber-800/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang giới thiệu</span>
        </Link>

        <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-600/40">
          Trải nghiệm thực khách
        </span>
      </div>

      {/* Thông báo phân định nghiệp vụ: Mục Tổng tất cả chỉ để xem, chọn chi nhánh mới được viết bài */}
      {selectedBranchId === 'ALL' && (
        <div className="p-3 rounded-2xl bg-[#281309] border border-amber-800/60 text-xs text-amber-200/90 flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <span>Mục <strong>Tất cả</strong> chỉ hiển thị xem. Chọn một chi nhánh bên dưới để viết đánh giá!</span>
          </div>
        </div>
      )}

      {/* Thanh chọn nhanh lọc chi nhánh */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => handleFilterBranch('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedBranchId === 'ALL'
              ? 'bg-yellow-400 text-stone-950 shadow-md'
              : 'bg-[#281309] text-amber-300 border border-amber-800/60'
          }`}
        >
          Tất cả chi nhánh
        </button>

        <button
          type="button"
          onClick={() => handleFilterBranch('branch-q1-uuid-demo')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedBranchId === 'branch-q1-uuid-demo'
              ? 'bg-yellow-400 text-stone-950 shadow-md'
              : 'bg-[#281309] text-amber-300 border border-amber-800/60'
          }`}
        >
          Chi nhánh Quận 1
        </button>

        <button
          type="button"
          onClick={() => handleFilterBranch('b2-default')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedBranchId === 'b2-default'
              ? 'bg-yellow-400 text-stone-950 shadow-md'
              : 'bg-[#281309] text-amber-300 border border-amber-800/60'
          }`}
        >
          Chi nhánh Bình Thạnh
        </button>
      </div>

      {/* Danh sách bài đánh giá */}
      <div className="pt-2">
        <ReviewFeed branchId={selectedBranchId} />
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
