'use client';

/**
 * @author Thành viên B (Task B1.1)
 * @description Thanh điều hướng cố định dưới đáy màn hình (Bottom Navigation Bar)
 * chuẩn Mobile-First cho Khách hàng (Role 1), kèm nút mở nhanh Drawer Đặt bàn qua Zalo.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareText, CalendarDays, Store, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onOpenBookingDrawer?: () => void;
}

export function BottomNav({ onOpenBookingDrawer }: BottomNavProps) {
  const pathname = usePathname();

  const isReviews = pathname === '/';
  const isBranches = pathname === '/branches';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-800 bg-neutral-950/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {/* Tab 1: Đánh giá */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors duration-150',
            isReviews
              ? 'text-amber-500 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200',
          )}
        >
          <MessageSquareText className="h-5 w-5" />
          <span className="text-[11px]">Đánh giá</span>
        </Link>

        {/* Tab 2: Nút Đặt bàn nổi bật ở giữa */}
        <button
          onClick={onOpenBookingDrawer}
          type="button"
          className="flex flex-col items-center gap-1 -mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl px-4 py-2.5 shadow-lg shadow-orange-950/60 active:scale-95 transition-all duration-200 border border-orange-400/40 cursor-pointer"
        >
          <CalendarDays className="h-5 w-5 text-white" />
          <span className="text-[11px] font-bold">Đặt bàn / Mang về</span>
        </button>

        {/* Tab 3: Chi nhánh */}
        <Link
          href="/#branches-section"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors duration-150',
            isBranches
              ? 'text-amber-500 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200',
          )}
        >
          <Store className="h-5 w-5" />
          <span className="text-[11px]">Chi nhánh</span>
        </Link>

        {/* Tab 4: Đăng nhập nhân sự / Admin */}
        <Link
          href="/login"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-neutral-400 hover:text-neutral-200 transition-colors duration-150"
        >
          <UserCircle className="h-5 w-5" />
          <span className="text-[11px]">Nhân sự</span>
        </Link>
      </div>
    </nav>
  );
}
