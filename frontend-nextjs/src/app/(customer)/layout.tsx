'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/layout.tsx
 * @description Layout responsive cho luồng khách hàng:
 * - Trên điện thoại: Chiếm toàn màn hình, Header cố định trên, BottomNav cố định dưới
 * - Trên màn hình lớn (PC/tablet): Giới hạn max-w-lg, căn giữa cho dễ đọc
 * - Tự động đổi màu theo chế độ sáng/tối của thiết bị
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BookingDrawerZalo } from '@/components/bookings/BookingDrawerZalo';
import { BookingProvider, useBooking } from '@/context/BookingContext';

function CustomerLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, closeBooking, bookingType, openBooking } = useBooking();

  return (
    // Bọc nền toàn trang theo màu hệ thống
    <div className="min-h-screen w-full bg-[var(--bg-app)]">

      {/* Header sticky cố định trên cùng - hiển thị trên mọi trang con */}
      <Header />

      {/* Nội dung trang: full-width trên điện thoại, giới hạn max-w-lg và căn giữa trên PC
           pt-4: đệm trên sau Header, pb-28: đệm dưới tránh bị BottomNav che */}
      <main className="w-full max-w-lg mx-auto px-4 pt-4 pb-28">
        {children}
      </main>

      {/* Thanh điều hướng cố định đáy — hiển thị trên mọi kích thước màn hình */}
      <BottomNav onOpenBookingDrawer={() => openBooking('TAKEAWAY')} />

      {/* Ngăn kéo Đặt bàn / Mang về */}
      <BookingDrawerZalo
        isOpen={isOpen}
        onClose={closeBooking}
        branchId="branch-q1-uuid-demo"
        branchName="Lẩu Mắm Trăm Rưỡi - Quận 1"
        initialType={bookingType}
      />
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
