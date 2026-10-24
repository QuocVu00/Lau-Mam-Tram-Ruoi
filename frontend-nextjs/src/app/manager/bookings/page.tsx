'use client';

/**
 * @file frontend-nextjs/src/app/manager/bookings/page.tsx
 * @author Thành viên B (Task B3.2)
 * @description Màn hình Tiếp nhận đơn Đặt bàn / Mua mang về Realtime ("Ting")
 * dành cho Quản lý chi nhánh (Role 2).
 * Tích hợp Socket.io tự phát âm thanh Ting, hiển thị thông báo tức thì và nút mở nhanh Zalo khách.
 * Hiển thị nổi bật chi tiết danh sách món khách chọn từ 2 Menu mang về.
 */

import React, { useState } from 'react';
import {
  Bell,
  Phone,
  Utensils,
  CalendarDays,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Users,
  ArrowUpRight,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
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

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: 'ord-101',
      customerName: 'Chị Mai Linh',
      zaloPhone: '0912 345 678',
      guestCount: 3,
      type: 'TAKEAWAY',
      details:
        '[ĐƠN MANG VỀ ĐÃ CHỌN MÓN]\n• 1x Set Đặc Biệt (2-3 người) (299.000đ)\n• 1x Mẹt Rau Đồng Thêm (12 loại rau) (35.000đ)\n• 2x Trà Tắc Hạt Chia (40.000đ)\n=> TỔNG TẠM TÍNH: 374.000đ\n* Ghi chú khách: Lấy lúc 18h30, không ăn cay, cho thêm ớt để riêng',
      status: 'NEW',
      createdAt: '5 phút trước',
    },
    {
      id: 'ord-102',
      customerName: 'Anh Quốc Tuấn',
      zaloPhone: '0988 123 456',
      guestCount: 4,
      type: 'BOOK_TABLE',
      details: 'Cần bàn gần cửa sổ, ăn cay vừa, chuẩn bị 4 bộ chén dĩa',
      status: 'CONFIRMED',
      createdAt: '25 phút trước',
    },
    {
      id: 'ord-103',
      customerName: 'Anh Hoàng Nam',
      zaloPhone: '0933 555 777',
      guestCount: 2,
      type: 'TAKEAWAY',
      details:
        '[ĐƠN MANG VỀ ĐÃ CHỌN MÓN]\n• 1x Set Lẩu 1 Người (150.000đ)\n• 1x Đĩa Ba Rọi Heo (200g) (45.000đ)\n• 1x Nước Sâm Mía Lau Rong Biển (18.000đ)\n=> TỔNG TẠM TÍNH: 213.000đ\n* Ghi chú khách: Nước lẩu nóng hổi, lấy đũa muỗng dùng 1 lần',
      status: 'DONE',
      createdAt: '1 giờ trước',
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
        details: newAlert.details,
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

  const handleCopyDetails = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              {tab === 'CONFIRMED' &&
                `Đã xác nhận (${bookings.filter((b) => b.status === 'CONFIRMED').length})`}
              {tab === 'DONE' && `Hoàn tất (${bookings.filter((b) => b.status === 'DONE').length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center text-xs text-neutral-400">
              Không có đơn nào trong mục này
            </Card>
          ) : (
            filteredBookings.map((order) => {
              const isNew = order.status === 'NEW';
              const isTakeaway = order.type === 'TAKEAWAY';

              return (
                <Card
                  key={order.id}
                  className={cn(
                    'p-5 transition-all space-y-4 border',
                    isNew
                      ? 'border-amber-500/80 bg-neutral-900/90 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/40'
                      : 'border-neutral-800 bg-neutral-900/60',
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 mt-0.5',
                          isTakeaway
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
                        )}
                      >
                        {isTakeaway ? (
                          <ShoppingBag className="h-6 w-6" />
                        ) : (
                          <CalendarDays className="h-6 w-6" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
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
                          <Badge
                            variant={isTakeaway ? 'warning' : 'default'}
                            className="text-[10px]"
                          >
                            {isTakeaway ? 'Mang về (Chọn món từ Menu)' : 'Đặt bàn ăn tại quán'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-neutral-500" />
                            {order.createdAt}
                          </span>
                          {!isTakeaway ? (
                            <span className="flex items-center gap-1 text-neutral-300 font-medium">
                              <Users className="h-3.5 w-3.5 text-amber-500" />
                              {order.guestCount} khách
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-400 font-medium">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                              Đơn món mang về
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Mở Zalo & Cập nhật trạng thái */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
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

                  {/* Chi tiết đơn hàng / Danh sách món khách chọn */}
                  {order.details && (
                    <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                      <div className="flex items-center justify-between text-neutral-400 font-semibold border-b border-neutral-800/80 pb-1.5">
                        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <Utensils className="h-3.5 w-3.5" />
                          <span>Chi tiết món / Ghi chú của khách:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyDetails(order.id, order.details || '')}
                          className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === order.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Sao chép đơn</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="text-neutral-200 text-xs font-sans whitespace-pre-wrap leading-relaxed">
                        {order.details}
                      </pre>
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
