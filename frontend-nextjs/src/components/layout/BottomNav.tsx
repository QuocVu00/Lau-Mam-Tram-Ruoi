'use client';

/**
 * @file frontend-nextjs/src/components/layout/BottomNav.tsx
 * @description Thanh điều hướng dưới đáy màn hình phong cách Miền Tây sông nước:
 * Tách biệt rõ 2 nút:
 * 1. "Đánh giá": Chuyển sang trang riêng /reviews
 * 2. "Đặt bàn / Món": Mở ngăn kéo đặt bàn/đặt món
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
  const isReviews = pathname === '/reviews';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 border-t border-amber-900/60 bg-[#241209]/95 backdrop-blur-md shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
      <div className="flex w-full items-center justify-around px-5 py-2.5">
        
        {/* Nút 1: Đánh giá món ăn (Chuyển trang riêng sang /reviews) */}
        <Link
          href="/reviews"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer group',
            isReviews
              ? 'text-yellow-400 font-black'
              : 'text-amber-200/70 hover:text-amber-200',
          )}
        >
          <div className={cn(
            'p-1 rounded-lg border transition-colors',
            isReviews
              ? 'bg-amber-500/20 border-yellow-400/60 text-yellow-400'
              : 'bg-amber-950/80 border-amber-600/30 text-amber-400',
          )}>
            <MessageSquareText className="h-5 w-5" />
          </div>
          <span className="text-[11px] font-bold">Đánh giá</span>
        </Link>

        {/* Nút 2: Đặt bàn / Mang về (Nút nổi bật tông màu Nâu đỏ - Vàng đồng) */}
        <button
          onClick={onOpenBookingDrawer}
          type="button"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-stone-950 rounded-2xl px-5 py-2.5 shadow-lg shadow-black/50 active:scale-95 transition-all duration-200 border border-amber-300/40 cursor-pointer"
        >
          <CalendarDays className="h-5 w-5 text-stone-950" />
          <span className="text-xs font-black tracking-wide uppercase text-stone-950">Đặt bàn / Món</span>
        </button>
      </div>
    </nav>
  );
}
