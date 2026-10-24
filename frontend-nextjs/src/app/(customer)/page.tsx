'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/page.tsx
 * @description TRANG GIỚI THIỆU QUÁN LẨU MẮM TRĂM RƯỠI (TINH GỌN, ĐƠN GIẢN, KHÔNG RỐI MẮT):
 * 1. Banner món lẩu mắm đặc sản miền Tây (nấu cốt cá linh, cá sặc, 12 loại rau đồng).
 * 2. 2 Nút hành động chính: Đặt bàn ăn tại quán & Đặt mang về.
 * 3. Khung chọn chi nhánh đơn giản: Ấn vào chi nhánh để thấy ảnh, tên, địa chỉ.
 * 4. Nút bấm nổi bật: "Xem bài đánh giá thực khách →" để chuyển sang trang đánh giá riêng biệt!
 */

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils,
  ShoppingBag,
  Star,
  Flame,
  MapPin,
  Award,
  Fish,
  Store,
  Phone,
  Clock,
  ArrowRight,
  MessageSquareText,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useBooking } from '@/context/BookingContext';

interface BranchInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  image: string;
}

const BRANCHES: BranchInfo[] = [
  {
    id: 'branch-q1-uuid-demo',
    name: 'Chi nhánh Quận 1',
    address: '150 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM',
    phone: '0901 234 567',
    avgRating: 5.0,
    image: '/images/chinhanh1.jpg',
  },
  {
    id: 'b2-default',
    name: 'Chi nhánh Bình Thạnh',
    address: '280 Phan Xích Long nối dài, Phường 2, Q. Phú Nhuận, TP.HCM',
    phone: '0909 150 151',
    avgRating: 4.8,
    image: '/images/chinhanh3.jpg',
  },
];

export default function CustomerIntroPage() {
  const router = useRouter();
  const { openBooking } = useBooking();

  // Chi nhánh đang được khách bấm chọn xem chi tiết trong khung
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo>(BRANCHES[0]);

  return (
    <div className="space-y-4 text-amber-100 pb-4">
      {/* Header điện thoại */}
      <div className="-mx-4 -mt-3 mb-1">
        <Header currentBranchName={selectedBranch.name} />
      </div>

      {/* 1. BANNER GIỚI THIỆU ĐẶC SẢN MIỀN TÂY */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d1e10] via-[#2a1309] to-[#1a0a04] p-5 border-2 border-amber-600/40 shadow-xl shadow-black/80">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 font-black text-[11px] shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>ĐẶC SẢN MIỀN TÂY</span>
          </span>

          <span className="text-xs font-black text-yellow-400 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-600/30">
            150.000đ/người
          </span>
        </div>

        <h2 className="text-lg font-black text-yellow-400 leading-tight">
          Lẩu Mắm Trăm Rưỡi Chuẩn Vị Nam Bộ
        </h2>

        <p className="text-xs text-amber-200/80 mt-2 leading-relaxed">
          Nồi lẩu mắm đậm đà nấu từ cốt <strong className="text-yellow-300">mắm cá linh, cá sặc Châu Đốc</strong> trứ danh, nước dừa tươi thanh ngọt, ăn kèm tôm cá tươi rói và mẹt <strong className="text-yellow-300">12 loại rau đồng xanh mướt</strong>.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-amber-900/40 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Fish className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Mắm cá linh nguyên chất</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Mở cửa: 10h00 - 22h00</span>
          </div>
        </div>
      </div>

      {/* 2. HAI NÚT HÀNH ĐỘNG CỐT LÕI: ĐẶT BÀN & ĐẶT MANG VỀ */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => openBooking('BOOK_TABLE')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#4d2513] to-[#2c1409] hover:from-[#5d2d17] hover:to-[#38190c] text-white shadow-lg border border-amber-500/40 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Utensils className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-[10px] font-black bg-amber-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
              Tại Quán
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black text-yellow-400 leading-tight">
              Đặt Bàn Trước
            </h3>
            <p className="text-[10px] text-amber-200/70 mt-0.5">
              Giữ chỗ & phục vụ nhanh
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openBooking('TAKEAWAY')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#4d2513] to-[#2c1409] hover:from-[#5d2d17] hover:to-[#38190c] text-white shadow-lg border border-yellow-500/40 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-[10px] font-black bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
              Giao Tận Nơi
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black text-yellow-400 leading-tight">
              Đặt Mang Về
            </h3>
            <p className="text-[10px] text-amber-200/70 mt-0.5">
              Xem Menu & chọn món
            </p>
          </div>
        </button>
      </div>

      {/* 3. KHUNG CHI NHÁNH ĐƠN GIẢN: ẤN VÀO ĐỂ THẤY CHI NHÁNH (ẢNH, TÊN, ĐỊA CHỈ) */}
      <div className="rounded-3xl bg-[#281309] p-4 border border-amber-900/60 shadow-xl space-y-3">
        <h3 className="text-xs font-black text-yellow-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Store className="w-4 h-4 text-amber-500" />
          <span>Chọn Chi Nhánh Để Xem</span>
        </h3>

        {/* 2 tab chi nhánh để khách ấn chuyển đổi nhanh */}
        <div className="grid grid-cols-2 gap-2">
          {BRANCHES.map((b) => {
            const isSelected = selectedBranch.id === b.id;

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBranch(b)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center truncate border ${
                  isSelected
                    ? 'bg-yellow-400 text-stone-950 border-yellow-400 shadow-md font-black'
                    : 'bg-[#1c0d06] text-amber-300 border-amber-900/60 hover:border-amber-600/60'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>

        {/* Khung hiển thị ĐƠN GIẢN: Ảnh chi nhánh, Tên, Địa chỉ */}
        <div className="rounded-2xl overflow-hidden border-2 border-amber-600/40 bg-[#1c0d06] shadow-lg">
          <div className="relative h-44 w-full">
            <Image
              src={selectedBranch.image}
              alt={selectedBranch.name}
              fill
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 420px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            
            <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-yellow-500/40 flex items-center gap-1 text-[11px] font-bold text-yellow-400">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{selectedBranch.avgRating.toFixed(1)} / 5.0</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
              <h4 className="text-sm font-black text-yellow-400">
                {selectedBranch.name}
              </h4>
              <p className="text-xs text-amber-100 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{selectedBranch.address}</span>
              </p>
              <p className="text-[11px] text-amber-300/80 flex items-center gap-1 pt-0.5">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>Hotline: {selectedBranch.phone}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. NÚT CHUYỂN SANG TRANG ĐÁNH GIÁ (ẤN VÀO THÌ QUA XEM BÀI ĐÁNH GIÁ) */}
      <div className="pt-1">
        <Link
          href={`/reviews?branchId=${selectedBranch.id}`}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-black text-xs flex items-center justify-between shadow-xl shadow-black/70 border border-yellow-300 transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-4 h-4 text-stone-950" />
            <span>Xem Bài Đánh Giá Của Khách Hàng</span>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-950" />
        </Link>
      </div>
    </div>
  );
}
