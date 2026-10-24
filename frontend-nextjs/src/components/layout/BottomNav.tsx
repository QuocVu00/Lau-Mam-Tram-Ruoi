'use client';

/**
 * @file frontend-nextjs/src/components/layout/BottomNav.tsx
 * @description Thanh điều hướng cố định dưới đáy màn hình dành riêng cho Khách hàng:
 * Chỉ hiển thị 2 thao tác của khách: "Đánh giá" và "Đặt bàn / Món".
 * Hoàn toàn loại bỏ tab Quản trị & Thực khách theo yêu cầu đóng khung của bạn.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareText, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onOpenBookingDrawer?: () => void;
}

export function BottomNav({ onOpenBookingDrawer }: BottomNavProps) {
  const pathname = usePathname();
  const isReviews = pathname === '/';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 border-t border-stone-800 bg-stone-900/95 backdrop-blur-lg">
      <div className="flex w-full items-center justify-around px-6 py-2.5">
        {/* Tab 1: Đánh giá món ăn */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-colors duration-150',
            isReviews
              ? 'text-amber-500 font-bold'
              : 'text-stone-400 hover:text-stone-200',
          )}
        >
          <MessageSquareText className="h-5 w-5" />
          <span className="text-[11px] font-semibold">Đánh giá</span>
        </Link>

        {/* Tab 2: Nút Đặt bàn / Mang về nổi bật ở giữa */}
        <button
          onClick={onOpenBookingDrawer}
          type="button"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl px-5 py-2.5 shadow-lg shadow-orange-950/60 active:scale-95 transition-all duration-200 border border-orange-400/40 cursor-pointer"
        >
          <CalendarDays className="h-5 w-5 text-white" />
          <span className="text-xs font-bold">Đặt bàn / Mang về</span>
        </button>
      </div>
    </nav>
  );
}
