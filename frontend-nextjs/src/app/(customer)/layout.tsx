'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/layout.tsx
 * @description Layout giao diện điện thoại mặc định (Native Mobile Layout):
 * Hiển thị trực tiếp theo tỷ lệ điện thoại (max-w-md), không dùng khung vỏ giả điện thoại,
 * tích hợp Header, BottomNav, Drawer Đặt bàn và Popup Google One Tap.
 */

import React, { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BookingDrawerZalo } from '@/components/bookings/BookingDrawerZalo';
import { GoogleOneTapPopup } from '@/components/auth/GoogleOneTapPopup';
import { BookingProvider, useBooking } from '@/context/BookingContext';

function CustomerLayoutInner({ children }: { children: React.ReactNode }) {
  // Lấy các trạng thái mở/đóng và loại đặt chỗ từ Booking Context
  const { isOpen, closeBooking, bookingType, openBooking } = useBooking();

  return (
    // 1. Container bao bọc toàn màn hình với nền tối sang trọng
    <div className="min-h-screen bg-stone-950 text-stone-100 flex justify-center">
      
      {/* 2. Khung màn hình điện thoại mặc định: 
          - Chiều rộng cố định chuẩn smartphone (max-w-md ~ 448px)
          - Chiều cao chiếm trọn màn hình (min-h-screen)
          - Không còn viền đen hay dynamic island giả lập
      */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-stone-900 border-x border-stone-800 shadow-2xl relative">
        
        {/* Thanh Header di động */}
        <Suspense fallback={<div className="h-14 border-b border-stone-800 bg-stone-950/80" />}>
          <Header />
        </Suspense>

        {/* Nội dung trang chính với khoảng đệm để không bị che khuất */}
        <main className="flex-1 px-4 py-3 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Thanh Bottom Navigation cố định đáy màn hình */}
        <BottomNav onOpenBookingDrawer={() => openBooking('TAKEAWAY')} />

        {/* Drawer Đặt bàn / Đặt món mang về qua Zalo */}
        <BookingDrawerZalo
          isOpen={isOpen}
          onClose={closeBooking}
          branchId="b1-default"
          branchName="Lẩu Mắm Trăm Rưỡi - Quận 1"
          initialType={bookingType}
        />

        {/* Popup chạm đăng nhập nhanh Google One Tap */}
        <GoogleOneTapPopup />
      </div>
    </div>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Bọc toàn bộ trong BookingProvider để quản lý trạng thái đặt bàn xuyên suốt
    <BookingProvider>
      <CustomerLayoutInner>{children}</CustomerLayoutInner>
    </BookingProvider>
  );
}
