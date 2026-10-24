'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/layout.tsx
 * @description Layout giao diện điện thoại mặc định (Native Mobile Layout):
 * Tông màu Nâu đất miền Tây, chứa Header, BottomNav, Drawer Đặt bàn
 * và cơ chế tự động đăng nhập tài khoản Google khách hàng khi lần đầu vào web.
 */

import React, { Suspense, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BookingDrawerZalo } from '@/components/bookings/BookingDrawerZalo';
import { BookingProvider, useBooking } from '@/context/BookingContext';

function CustomerLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, closeBooking, bookingType, openBooking } = useBooking();

  return (
    // Container bao bọc toàn màn hình nền Nâu đất nung
    <div className="min-h-screen bg-[#120703] text-amber-100 flex justify-center">
      
      {/* Khung màn hình điện thoại mặc định tông màu Nâu Miền Tây (max-w-md ~ 448px) */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#241209] border-x border-amber-900/60 shadow-2xl relative">
        
        {/* Nội dung trang chính */}
        <main className="flex-1 px-4 py-3 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Thanh Bottom Navigation cố định đáy */}
        <BottomNav onOpenBookingDrawer={() => openBooking('TAKEAWAY')} />

        {/* Drawer Đặt bàn / Đặt món mang về qua Zalo */}
        <BookingDrawerZalo
          isOpen={isOpen}
          onClose={closeBooking}
          branchId="branch-q1-uuid-demo"
          branchName="Lẩu Mắm Trăm Rưỡi - Quận 1"
          initialType={bookingType}
        />
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
    <BookingProvider>
      <CustomerLayoutInner>{children}</CustomerLayoutInner>
    </BookingProvider>
  );
}
