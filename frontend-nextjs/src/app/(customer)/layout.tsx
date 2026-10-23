'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/layout.tsx
 * @author Thành viên B (Task B1.1)
 * @description Layout chuẩn Mobile-First cho Khách hàng:
 * Dựng khung Header, BottomNav và tích hợp Booking Drawer cùng GoogleOneTapPopup của A.
 */

import React, { useState, Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BookingDrawerZalo } from '@/components/bookings/BookingDrawerZalo';
import { GoogleOneTapPopup } from '@/components/auth/GoogleOneTapPopup';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      {/* Khung giới hạn chiều rộng chuẩn Mobile-First (tối đa max-w-lg căn giữa) */}
      <div className="mx-auto w-full max-w-lg min-h-screen flex flex-col pb-24 shadow-2xl bg-neutral-900/60 border-x border-neutral-800/80">
        <Suspense fallback={<div className="h-14 border-b border-neutral-800 bg-neutral-950/80" />}>
          <Header />
        </Suspense>

        <main className="flex-1 px-4 py-4">{children}</main>

        <BottomNav onOpenBookingDrawer={() => setIsBookingOpen(true)} />

        {/* Modal / Drawer Đặt bàn qua Zalo */}
        <BookingDrawerZalo
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          branchId="b1-default"
          branchName="Lẩu Mắm Trăm Rưỡi - Quận 1"
        />

        {/* Popup Google One Tap của Thành viên A */}
        <GoogleOneTapPopup />
      </div>
    </div>
  );
}
