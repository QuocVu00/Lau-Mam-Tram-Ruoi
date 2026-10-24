'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/page.tsx
 * @description Trang chủ dành cho Khách vãng lai:
 * Tinh gọn chỉ tập trung đúng 3 nội dung trọng tâm:
 * 1. Đặt bàn ăn tại quán (BOOK_TABLE)
 * 2. Đặt món mang về (TAKEAWAY)
 * 3. Dòng thời gian bài đánh giá từ thực khách (ReviewFeed)
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Utensils, ShoppingBag, Star, Flame, Sparkles, MapPin, CalendarDays } from 'lucide-react';
import { ReviewFeed } from '@/components/reviews/ReviewFeed';
import { useBooking } from '@/context/BookingContext';

interface BranchItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
}

function CustomerHomeContent() {
  const searchParams = useSearchParams();
  const selectedBranchId = searchParams.get('branchId');
  const { openBooking } = useBooking();

  // Danh sách chi nhánh của quán
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: 'b1-default',
      name: 'Chi nhánh Quận 1',
      address: '150 Nguyễn Trãi, P. Bến Thành, Quận 1, TP.HCM',
      phone: '0909 150 150',
      avgRating: 4.9,
    },
    {
      id: 'b2-default',
      name: 'Chi nhánh Bình Thạnh',
      address: '280 Phan Xích Long nối dài, P. 2, Q. Phú Nhuận',
      phone: '0909 150 151',
      avgRating: 4.8,
    },
  ]);

  // Tải chi nhánh từ Backend nếu có
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
        // Sử dụng dữ liệu mẫu nếu backend đang bận
      }
    }
    fetchBranches();
  }, []);

  const currentBranch =
    branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------- */}
      {/* KHỐI 1 & 2: HAI NÚT HÀNH ĐỘNG CỐT LÕI - ĐẶT BÀN & MANG VỀ      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Nút 1: Đặt bàn ăn tại quán */}
        <button
          type="button"
          onClick={() => openBooking('BOOK_TABLE')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-950/40 border border-amber-500/30 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer group"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold bg-black/30 px-2 py-0.5 rounded-full text-amber-200">
              Tại Quán
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black leading-tight text-white group-hover:text-amber-100">
              Đặt Bàn Trước
            </h3>
            <p className="text-[11px] text-amber-100/80 mt-0.5">
              Chọn giờ & giữ bàn đẹp
            </p>
          </div>
        </button>

        {/* Nút 2: Mua mang về */}
        <button
          type="button"
          onClick={() => openBooking('TAKEAWAY')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg shadow-orange-950/40 border border-orange-500/30 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer group"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold bg-black/30 px-2 py-0.5 rounded-full text-orange-200">
              Giao Tận Nơi
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black leading-tight text-white group-hover:text-orange-100">
              Đặt Mang Về
            </h3>
            <p className="text-[11px] text-orange-100/80 mt-0.5">
              Chọn món từ Menu nóng hổi
            </p>
          </div>
        </button>
      </div>

      {/* Thẻ thông tin chi nhánh đang chọn */}
      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-stone-300 truncate">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-semibold text-white truncate">{currentBranch?.name}</span>
          <span className="text-[10px] text-stone-500 hidden sm:inline truncate">({currentBranch?.address})</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-lg border border-amber-500/20 text-[11px]">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{currentBranch?.avgRating.toFixed(1)}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* KHỐI 3: DÒNG THỜI GIAN BÀI ĐÁNH GIÁ CỦA THỰC KHÁCH (REVIEW FEED) */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-1">
        <ReviewFeed branchId={currentBranch?.id} />
      </div>
    </div>
  );
}

export default function CustomerHomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Đang tải Lẩu Mắm Trăm Rưỡi...</div>}>
      <CustomerHomeContent />
    </Suspense>
  );
}
