'use client';

/**
 * @file frontend-nextjs/src/app/manager/bookings/page.tsx
 * @author Thành viên B (Task B3.2)
 * @description Màn hình Tiếp nhận đơn Đặt bàn / Mua mang về Realtime ("Ting")
 * dành cho Quản lý chi nhánh (Role 2).
 * Tích hợp Socket.io tự phát âm thanh Ting, hiển thị thông báo tức thì và nút mở nhanh Zalo khách.
 */

import React, { useState, useEffect } from 'react';
import { Bell, Phone, Utensils, CalendarDays, CheckCircle2, Clock, Users, ArrowUpRight, RefreshCw } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { ManagerRealtimeAlert } from '@/components/bookings/ManagerRealtimeAlert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BookingItem {
  id: string;
  customerName: string;
  zaloPhone: string;
  guestCount: number;
  type: 'BOOK_TABLE' | 'TAKEAWAY';
  details?: string;
  status: 'NEW' | 'CONFIRMED' | 'DONE';
  createdAt: string;
}

export default function ManagerBookingsPage() {
  const currentBranchId = 'b1-default';
  const currentBranchName = 'Lẩu Mắm Trăm Rưỡi - Quận 1';

  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: 'ord-101',
      customerName: 'Anh Quốc Tuấn',
      zaloPhone: '0988 123 456',
      guestCount: 4,
      type: 'BOOK_TABLE',
      details: 'Cần bàn gần cửa sổ, ăn cay vừa',
      status: 'NEW',
      createdAt: '10 phút trước',
    },
    {
      id: 'ord-102',
      customerName: 'Chị Mai Linh',
      zaloPhone: '0912 345 678',
      guestCount: 2,
      type: 'TAKEAWAY',
      details: 'Lấy lúc 18h30, thêm rau đắng',
      status: 'CONFIRMED',
      createdAt: '30 phút trước',
    },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'CONFIRMED' | 'DONE'>('ALL');

  // Khi có sự kiện Realtime bắn xuống từ ManagerRealtimeAlert
  const handleRealtimeNewBooking = (newAlert: any) => {
    setBookings((prev) => [
      {
        id: newAlert.bookingId,
        customerName: newAlert.customerName,
        zaloPhone: newAlert.zaloPhone,
        guestCount: newAlert.guestCount,
        type: newAlert.type,
        status: 'NEW',
        createdAt: 'Vừa xong',
      },
      ...prev,
    ]);
  };

  const handleUpdateStatus = (id: string, newStatus: 'NEW' | 'CONFIRMED' | 'DONE') => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
    );
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row">
      {/* Sidebar Role 2 */}
      <AdminSidebar role="MANAGER" branchName={currentBranchName} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl">
        {/* Header & Realtime Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-950/50">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white">
                  Tiếp Nhận Đơn Realtime ("Ting")
                </h1>
                <p className="text-xs text-neutral-400">
                  Chi nhánh: <span className="text-amber-400 font-semibold">{currentBranchName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Realtime Alert Listener & Indicator */}
          <ManagerRealtimeAlert
            branchId={currentBranchId}
            onNewBooking={handleRealtimeNewBooking}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['ALL', 'NEW', 'CONFIRMED', 'DONE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                filter === tab
                  ? 'bg-amber-500 text-white shadow-md shadow-orange-950/40'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800',
              )}
            >
              {tab === 'ALL' && `Tất cả (${bookings.length})`}
              {tab === 'NEW' && `Đơn mới (${bookings.filter((b) => b.status === 'NEW').length})`}
              {tab === 'CONFIRMED' && `Đã xác nhận (${bookings.filter((b) => b.status === 'CONFIRMED').length})`}
              {tab === 'DONE' && `Hoàn tất (${bookings.filter((b) => b.status === 'DONE').length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center text-xs text-neutral-400">
              Không có đơn nào trong mục này
            </Card>
          ) : (
            filteredBookings.map((order) => {
              const isNew = order.status === 'NEW';
              return (
                <Card
                  key={order.id}
                  className={cn(
                    'p-5 transition-all space-y-4 border',
                    isNew
                      ? 'border-amber-500/70 bg-neutral-900/90 shadow-lg shadow-amber-950/30'
                      : 'border-neutral-800 bg-neutral-900/50',
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-2xl shrink-0',
                          order.type === 'BOOK_TABLE'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
                        )}
                      >
                        {order.type === 'BOOK_TABLE' ? (
                          <Utensils className="h-5 w-5" />
                        ) : (
                          <CalendarDays className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white">
                            {order.customerName}
                          </h3>
                          <Badge
                            variant={
                              order.status === 'NEW'
                                ? 'warning'
                                : order.status === 'CONFIRMED'
                                ? 'info'
                                : 'success'
                            }
                          >
                            {order.status === 'NEW' && 'MỚI "TING"'}
                            {order.status === 'CONFIRMED' && 'ĐÃ XÁC NHẬN'}
                            {order.status === 'DONE' && 'HOÀN TẤT'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-neutral-500" />
                            {order.createdAt}
                          </span>
                          {order.type === 'BOOK_TABLE' && (
                            <span className="flex items-center gap-1 text-neutral-300 font-medium">
                              <Users className="h-3.5 w-3.5 text-amber-500" />
                              {order.guestCount} khách
                            </span>
                          )}
                          <span className="text-amber-400 font-medium">
                            {order.type === 'BOOK_TABLE' ? 'Ăn tại quán' : 'Mua mang về'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Open Zalo & Change Status */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://zalo.me/${order.zaloPhone.replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-950/40 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Nhắn Zalo: {order.zaloPhone}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>

                      {order.status === 'NEW' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                        >
                          Xác nhận
                        </Button>
                      )}

                      {order.status === 'CONFIRMED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'DONE')}
                        >
                          Hoàn tất
                        </Button>
                      )}
                    </div>
                  </div>

                  {order.details && (
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                      <span className="text-neutral-500 font-semibold mr-1">Ghi chú:</span>
                      {order.details}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
