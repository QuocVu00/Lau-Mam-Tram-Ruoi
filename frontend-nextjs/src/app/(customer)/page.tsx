'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/page.tsx
 * @author Thành viên B (Task B1.1 & Task B1.3)
 * @description Trang chủ khách hàng: Hiển thị Banner món lẩu mắm trứ danh,
 * Nút mở Menu đặt mang về nhanh, Bộ chọn chi nhánh của B ở trên và nhúng <ReviewFeed /> của A ở dưới.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Flame, Star, Sparkles, MapPin, Award, ShoppingBag, Utensils } from 'lucide-react';
import { BranchSelector, Branch } from '@/components/branches/BranchSelector';
import { ReviewFeed } from '@/components/reviews/ReviewFeed';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';

function CustomerHomeContent() {
  const searchParams = useSearchParams();
  const selectedBranchId = searchParams.get('branchId');
  const { openBooking } = useBooking();

  // Dữ liệu chi nhánh mẫu ban đầu (sẽ load từ API NestJS /branches)
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 'b1-default',
      name: 'Lẩu Mắm Trăm Rưỡi - Quận 1',
      address: '150 Nguyễn Trãi, P. Bến Thành, Quận 1, TP.HCM',
      phone: '0909 150 150',
      avgRating: 4.9,
      totalActiveReviews: 128,
    },
    {
      id: 'b2-default',
      name: 'Lẩu Mắm Trăm Rưỡi - Bình Thạnh',
      address: '280 Phan Xích Long nối dài, P. 2, Q. Phú Nhuận',
      phone: '0909 150 151',
      avgRating: 4.8,
      totalActiveReviews: 96,
    },
  ]);

  // Thử gọi API backend nếu server đang chạy
  useEffect(() => {
    async function fetchBranches() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/branches`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBranches(data);
          }
        }
      } catch (e) {
        // Fallback to sample data
      }
    }
    fetchBranches();
  }, []);

  const currentBranch =
    branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <div className="space-y-6">
      {/* Hero Food Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-900 p-5 text-white shadow-xl shadow-orange-950/40 border border-orange-500/30">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-neutral-900/80 text-amber-300 border-amber-400/30 backdrop-blur-sm">
              <Award className="h-3 w-3 mr-1 text-amber-400" />
              Đặc sản miền Tây
            </Badge>
            <span className="text-[11px] text-amber-100/90 font-medium">Chỉ 150.000đ/người</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight leading-tight">
            Nồi Lẩu Mắm Trăm Rưỡi Đậm Đà Ngon Khó Cưỡng!
          </h2>

          <p className="text-xs text-amber-100/80 leading-relaxed">
            Hương thơm quyến rũ từ mắm cá linh, cá sặc đồng quê, kèm khay hải sản tươi rói và 12 loại rau đồng xanh mướt.
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs font-semibold">
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl">
              <Flame className="h-3.5 w-3.5 text-amber-300" />
              <span>Nước lẩu bí truyền</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>{currentBranch?.avgRating.toFixed(1)} Sao</span>
            </div>
          </div>

          {/* Quick Action Buttons on Banner */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => openBooking('TAKEAWAY')}
              type="button"
              className="flex-1 py-2.5 px-3 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-black/30 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-orange-600" />
              <span>Xem Menu & Đặt Mang Về</span>
            </button>
            <button
              onClick={() => openBooking('BOOK_TABLE')}
              type="button"
              className="py-2.5 px-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Utensils className="h-4 w-4 text-amber-300" />
              <span>Đặt Bàn Quán</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />
      </div>

      {/* Phía trên: Bộ chọn Chi nhánh của Thành viên B */}
      <BranchSelector branches={branches} />

      {/* Phía dưới: Nhúng luồng Đánh giá của Thành viên A */}
      <ReviewFeed branchId={currentBranch?.id} />
    </div>
  );
}

export default function CustomerHomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Đang tải trải nghiệm Lẩu Mắm...</div>}>
      <CustomerHomeContent />
    </Suspense>
  );
}
