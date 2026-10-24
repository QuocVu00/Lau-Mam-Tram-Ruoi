'use client';

/**
 * @file frontend-nextjs/src/app/(customer)/layout.tsx
 * @author Thành viên B (Task B1.1)
 * @description Layout chuẩn Mobile-First cho Khách hàng:
 * Tích hợp Khung mô phỏng điện thoại thông minh (MobileFrame) trên Desktop,
 * hiển thị toàn màn hình Native App trên điện thoại thật,
 * kèm Header, BottomNav, Booking Drawer và GoogleOneTapPopup.
 */

import React, { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { BookingDrawerZalo } from '@/components/bookings/BookingDrawerZalo';
import { GoogleOneTapPopup } from '@/components/auth/GoogleOneTapPopup';
import { MobileFrame } from '@/components/layout/MobileFrame';
import { BookingProvider, useBooking } from '@/context/BookingContext';

function CustomerLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, closeBooking, bookingType, openBooking } = useBooking();

  return (
    <MobileFrame>
      <div className="w-full flex-1 flex flex-col justify-between relative min-h-full">
        <Suspense fallback={<div className="h-14 border-b border-neutral-800 bg-neutral-950/80" />}>
          <Header />
        </Suspense>

        <main className="flex-1 px-4 py-3">{children}</main>

        <BottomNav onOpenBookingDrawer={() => openBooking('TAKEAWAY')} />

        {/* Modal / Drawer Đặt bàn qua Zalo */}
        <BookingDrawerZalo
          isOpen={isOpen}
          onClose={closeBooking}
          branchId="b1-default"
          branchName="Lẩu Mắm Trăm Rưỡi - Quận 1"
          initialType={bookingType}
        />

        {/* Popup Google One Tap của Thành viên A */}
        <GoogleOneTapPopup />
      </div>
    </MobileFrame>
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
