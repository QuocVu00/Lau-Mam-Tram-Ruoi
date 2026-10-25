'use client';

/**
 * @file frontend-nextjs/src/components/layout/BottomNav.tsx
 * @description Thanh điều hướng dưới đáy màn hình điện thoại (Mobile Bottom Navigation):
 * - Thích ứng màu sắc theo máy (Light/Dark mode)
 * - Tương thích thanh vuốt đáy iPhone/Android với pb-safe
 * - Nút Trang chủ, Đánh giá, và Nút nổi bật Đặt bàn / Món
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareText, CalendarDays, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onOpenBookingDrawer?: () => void;
}

export function BottomNav({ onOpenBookingDrawer }: BottomNavProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isReviews = pathname === '/reviews';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-color)] bg-[var(--bg-card)]/95 backdrop-blur-lg shadow-lg transition-colors duration-200">
      {/* Vùng chứa giới hạn max-w-lg để đồng bộ với main content, full-width trên điện thoại */}
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 pt-2 pb-safe">
        
        {/* Nút 1: Trang chủ / Menu giới thiệu */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer active:scale-95',
            isHome
              ? 'text-[var(--primary)] font-black'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)]',
          )}
        >
          <div className={cn(
            'p-1.5 rounded-xl transition-colors',
            isHome
              ? 'bg-[var(--bg-muted)] text-[var(--primary)] shadow-xs'
              : 'text-[var(--text-sub)]',
          )}>
            <Home className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold">Trang chủ</span>
        </Link>

        {/* Nút 2: Đánh giá món ăn */}
        <Link
          href="/reviews"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer active:scale-95',
            isReviews
              ? 'text-[var(--primary)] font-black'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)]',
          )}
        >
          <div className={cn(
            'p-1.5 rounded-xl transition-colors',
            isReviews
              ? 'bg-[var(--bg-muted)] text-[var(--primary)] shadow-xs'
              : 'text-[var(--text-sub)]',
          )}>
            <MessageSquareText className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold">Đánh giá</span>
        </Link>

        {/* Nút 3: Nút nổi bật Đặt bàn & Đặt món mang về (Call to action chính) */}
        <button
          onClick={onOpenBookingDrawer}
          type="button"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:opacity-95 text-stone-950 font-black rounded-2xl px-4 py-2.5 shadow-md shadow-amber-900/20 active:scale-95 transition-all duration-150 cursor-pointer border border-yellow-300/40"
        >
          <CalendarDays className="h-4 w-4 text-stone-950" />
          <span className="text-xs uppercase tracking-wide">Đặt bàn / Món</span>
        </button>
      </div>
    </nav>
  );
}
