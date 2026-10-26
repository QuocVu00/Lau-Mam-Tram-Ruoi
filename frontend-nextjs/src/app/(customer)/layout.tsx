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
import { BookingDrawerZalo } from '@/components/bookings/BookingDrawerZalo';
import { BookingProvider, useBooking } from '@/context/BookingContext';

function CustomerLayoutInner({ children }: { children: React.ReactNode }) {
  // Trích xuất trạng thái đóng/mở, loại đặt món, và chi nhánh được khách hàng chọn từ context
  const { isOpen, closeBooking, bookingType, selectedBranch } = useBooking();

  return (
    // Bọc nền toàn trang theo màu hệ thống
    <div className="min-h-screen w-full bg-[var(--bg-app)]">

      {/* Header sticky cố định trên cùng - hiển thị trên mọi trang con */}
      <Header />

      {/* Nội dung trang: thêm pb-24 (khoảng đệm dưới) để tránh bị thanh nút Đặt bàn / Mang về cố định che khuất */}
      <main className="w-full max-w-lg lg:max-w-5xl mx-auto px-4 pt-4 pb-24">
        {children}
      </main>

      {/* Ngăn kéo Đặt bàn / Mang về: Truyền branchId và branchName thực tế của chi nhánh được chọn */}
      <BookingDrawerZalo
        isOpen={isOpen}
        onClose={closeBooking}
        branchId={selectedBranch.id}
        branchName={selectedBranch.name}
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
