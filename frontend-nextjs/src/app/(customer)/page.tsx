'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/page.tsx
 * @description TRANG GIỚI THIỆU QUÁN LẨU MẮM TRĂM RƯỠI (TINH GỌN, ĐƠN GIẢN, KHÔNG RỐI MẮT):
 * 1. Banner món lẩu mắm đặc sản miền Tây (nấu cốt cá linh, cá sặc, 12 loại rau đồng).
 * 2. 2 Nút hành động chính: Đặt bàn ăn tại quán & Đặt mang về.
 * 3. Khung chọn chi nhánh đơn giản: Ấn vào chi nhánh để thấy ảnh, tên, địa chỉ.
 * 4. Nút bấm nổi bật: "Xem bài đánh giá thực khách →" để chuyển sang trang đánh giá riêng biệt!
 */

import React, { useState, useEffect } from 'react';
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
import { useBooking } from '@/context/BookingContext';
import { apiClient } from '@/lib/api'; // Trạm kết nối gọi API sang Backend NestJS

interface BranchInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  image: string;
}

// Dữ liệu dự phòng hiển thị tạm thời khi hệ thống vừa tải trang
const DEFAULT_BRANCHES: BranchInfo[] = [
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
  // Lấy hàm openBooking và setSelectedBranch từ Context
  const { openBooking, setSelectedBranch: setGlobalBranch } = useBooking();

  // Danh sách các chi nhánh lấy từ Backend (khởi tạo với dữ liệu mặc định để không bị trắng trang khi đang tải)
  const [branches, setBranches] = useState<BranchInfo[]>(DEFAULT_BRANCHES);

  // Chi nhánh đang được khách chọn để xem thông tin (mặc định là chi nhánh đầu tiên)
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo>(DEFAULT_BRANCHES[0]);

  // Hàm chuyển đổi chi nhánh: vừa cập nhật state nội bộ vừa đồng bộ lên Context toàn cục
  const handleSelectBranch = (branch: BranchInfo) => {
    setSelectedBranch(branch);
    // Cập nhật chi nhánh vào Context để Modal Đặt bàn nhận đúng chi nhánh này
    setGlobalBranch({ id: branch.id, name: branch.name });
  };

  // Hook useEffect: Tự động chạy 1 lần duy nhất khi người dùng mở trang web
  useEffect(() => {
    // Hàm bất đồng bộ (async) để gửi HTTP Request sang Backend NestJS
    async function fetchLiveBranches() {
      try {
        // Gửi GET /branches sang http://localhost:3001/branches
        const liveBranches = await apiClient<any[]>('/branches');

        // Nếu Backend trả về mảng có dữ liệu chi nhánh
        if (Array.isArray(liveBranches) && liveBranches.length > 0) {
          // Chuẩn hóa dữ liệu từ database: gán ảnh mẫu nếu database chưa lưu ảnh
          const formatted = liveBranches.map((b, index) => ({
            id: b.id,
            name: b.name,
            address: b.address,
            phone: b.phone,
            avgRating: Number(b.avgRating) || 5.0, // Điểm số sao tính theo đánh giá thực tế
            image: index === 0 ? '/images/chinhanh1.jpg' : '/images/chinhanh3.jpg',
          }));

          // Cập nhật State: React sẽ tự động re-render hiển thị chi nhánh mới nhất từ PostgreSQL
          setBranches(formatted);
          setSelectedBranch(formatted[0]);
          // Đồng bộ chi nhánh đầu tiên từ Backend vào Context
          setGlobalBranch({ id: formatted[0].id, name: formatted[0].name });
        }
      } catch (err) {
        // Nếu Backend chưa chạy hoặc lỗi mạng, giữ nguyên dữ liệu mặc định để khách vẫn xem được menu
        console.warn('Lưu ý: Không thể tải chi nhánh từ Backend, đang dùng dữ liệu dự phòng:', err);
      }
    }

    fetchLiveBranches();
  }, [setGlobalBranch]); // Chạy khi component mount

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 pb-2 transition-colors duration-200">

      {/* CỘT BÊN TRÁI TRÊN DESKTOP: Banner Món & Nút Xem Đánh Giá */}
      <div className="lg:col-span-6 space-y-4">
        {/* 2. BANNER MÓN LẨU MẮM - ĐẬM CHẤT MIỀN TÂY */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-50 p-5 shadow-lg border border-amber-500/40">
          {/* Họa tiết trang trí nền tinh tế */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-stone-950 font-black text-[11px] shadow-xs">
              <Award className="w-3.5 h-3.5" />
              <span>ĐẶC SẢN MIỀN TÂY</span>
            </span>

            <span className="text-xs font-black text-yellow-300 bg-stone-950/60 backdrop-blur-md px-3 py-1 rounded-xl border border-yellow-400/40">
              150.000đ/phần
            </span>
          </div>

          <h2 className="text-lg font-black text-white leading-tight relative z-10">
            Lẩu Mắm Trăm Rưỡi Chuẩn Vị Miền Tây
          </h2>

          <p className="text-xs text-amber-100/90 mt-2 leading-relaxed relative z-10">
            Nồi lẩu mắm đậm đà ninh từ cốt <strong className="text-yellow-300">mắm cá linh, cá sặc Châu Đốc</strong> trứ danh, nước dừa tươi thanh ngọt, ăn kèm tôm cá tươi rói và mẹt <strong className="text-yellow-300">12 loại rau đồng xanh mướt</strong>.
          </p>

          {/* Thông số món ăn & thời gian phục vụ */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-amber-500/30 text-[11px] relative z-10">
            <div className="flex items-center gap-1.5 text-amber-100 font-medium">
              <Fish className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Mắm cá linh nguyên chất</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-100 font-medium">
              <Clock className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Mở cửa: 16h30 - 24h00</span>
            </div>
          </div>
        </section>

      </div>

      {/* CỘT BÊN PHẢI TRÊN DESKTOP: Đặt Bàn / Mang Về & Khung Chọn Chi Nhánh */}
      <div className="lg:col-span-6 space-y-4">
        {/* 3. HAI NÚT HÀNH ĐỘNG GỌN GÀNG (ĐÃ THU NHỎ & BỎ TEXT PHỤ / BADGE) */}
        <section className="grid grid-cols-2 gap-2.5">
          {/* Nút 1: Đặt bàn ăn tại quán */}
          <button
            type="button"
            onClick={() => openBooking('BOOK_TABLE', { id: selectedBranch.id, name: selectedBranch.name })}
            className="px-3 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-left shadow-xs border border-[var(--border-color)] flex items-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-[var(--primary)] shrink-0 group-hover:scale-105 transition-transform">
              <Utensils className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <h3 className="text-xs font-black text-[var(--text-main)] truncate">
              Đặt Bàn Trước
            </h3>
          </button>

          {/* Nút 2: Đặt món mang về qua Zalo */}
          <button
            type="button"
            onClick={() => openBooking('TAKEAWAY', { id: selectedBranch.id, name: selectedBranch.name })}
            className="px-3 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-left shadow-xs border border-[var(--border-color)] flex items-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-xs font-black text-[var(--text-main)] truncate">
              Đặt Mang Về
            </h3>
          </button>
        </section>

        {/* 4. KHUNG CHỌN CHI NHÁNH & THÔNG TIN LIÊN HỆ ĐIỆN THOẠI */}
        <section className="rounded-3xl bg-[var(--bg-card)] p-4 border border-[var(--border-color)] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5 uppercase tracking-wider">
              <Store className="w-4 h-4 text-[var(--primary)]" />
              <span>Chọn Chi Nhánh Để Xem</span>
            </h3>
            <span className="text-[10px] text-[var(--text-sub)] font-medium">
              2 Chi nhánh đang mở
            </span>
          </div>

          {/* Tab chọn nhanh các chi nhánh từ Database */}
          <div className="grid grid-cols-2 gap-2">
            {branches.map((b) => {
              const isSelected = selectedBranch.id === b.id;

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectBranch(b)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center truncate border ${isSelected
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 border-amber-600 shadow-xs font-black'
                    : 'bg-[var(--bg-muted)] text-[var(--text-main)] border-[var(--border-color)] hover:opacity-90'
                    }`}
                >
                  {b.name}
                </button>
              );
            })}
          </div>

          {/* Khung hiển thị chi tiết chi nhánh với nút gọi hotline điện thoại */}
          <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-muted)] shadow-sm">
            <div className="relative h-44 w-full">
              <Image
                src={selectedBranch.image}
                alt={selectedBranch.name}
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 420px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Điểm đánh giá sao */}
              <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-yellow-400/40 flex items-center gap-1 text-[11px] font-bold text-yellow-300">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{selectedBranch.avgRating.toFixed(1)} / 5.0</span>
              </div>

              {/* Thông tin địa chỉ & Hotline */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-1.5">
                <h4 className="text-sm font-black text-yellow-300">
                  {selectedBranch.name}
                </h4>
                <p className="text-xs text-stone-100 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{selectedBranch.address}</span>
                </p>

                {/* Nút bấm gọi điện thoại trực tiếp khi dùng trên di động */}
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href={`tel:${selectedBranch.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer"
                    title="Bấm để gọi hotline chi nhánh"
                  >
                    <Phone className="w-3 h-3 text-stone-950" />
                    <span>Gọi: {selectedBranch.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NÚT CHUYỂN SANG TRANG ĐÁNH GIÁ (CHUYỂN XUỐNG CUỐI TRANG) */}
        <section className="pt-2">
          <Link
            href={`/reviews?branchId=${selectedBranch.id}`}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:opacity-95 text-stone-950 font-black text-xs flex items-center justify-between shadow-md shadow-amber-900/15 border border-yellow-300/40 transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-950/20 flex items-center justify-center">
                <MessageSquareText className="w-4 h-4 text-stone-950" />
              </div>
              <div>
                <p className="font-black text-xs leading-none">Xem Đánh Giá Khách Hàng</p>
                <p className="text-[10px] text-stone-900/80 font-medium mt-0.5">Hình ảnh & video chân thực từ thực khách</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </Link>
        </section>
      </div>
    </div>
  );
}
