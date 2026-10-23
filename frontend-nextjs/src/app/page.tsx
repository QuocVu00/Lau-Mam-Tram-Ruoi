/**
 * @file frontend-nextjs/src/app/page.tsx
 * @description Trang chủ trải nghiệm đánh giá Mobile-First của Khách hàng (Lẩu Mắm Trăm Rưỡi).
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, UserCircle2, Flame, MapPin, Phone } from 'lucide-react';
import ReviewFeed from '@/components/reviews/ReviewFeed';

export default function HomePage() {
  const [selectedBranchId] = useState('branch-q1-uuid-demo');

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Thanh Header Mobile */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-stone-900 dark:text-white leading-tight">
              Lẩu Mắm Trăm Rưỡi
            </h1>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
              Hệ thống đa chi nhánh
            </p>
          </div>
        </div>

        {/* Nút vào trang Đăng nhập nội bộ dành cho Quản lý & Admin */}
        <Link
          href="/login"
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
        >
          <UserCircle2 className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">Quản trị</span>
        </Link>
      </header>

      {/* Thẻ Chi Nhánh Đang Chọn */}
      <div className="max-w-xl mx-auto px-4 pt-4 pb-2">
        <div className="p-4 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl shadow-lg shadow-amber-700/20">
          <div className="flex items-center gap-1.5 text-xs text-amber-200 font-semibold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>Chi nhánh đang xem</span>
          </div>
          <h2 className="text-lg font-black mt-1">Lẩu Mắm Trăm Rưỡi - Chi nhánh Quận 1</h2>

          <div className="flex flex-col gap-1 mt-2 text-xs text-amber-100">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>150 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. HCM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Hotline: 0901234567</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng thời gian Đánh giá của Thành viên A */}
      <div className="px-4 mt-3">
        <ReviewFeed branchId={selectedBranchId} />
      </div>
    </main>
  );
}
