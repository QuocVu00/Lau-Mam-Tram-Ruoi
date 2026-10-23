'use client';

/**
 * @author Thành viên B (Task B3.2)
 * @description Drawer trượt từ dưới lên (Bottom Sheet) chuẩn Mobile-First cho Khách hàng
 * gửi yêu cầu Đặt bàn tại quán (BOOK_TABLE) hoặc Mua mang về (TAKEAWAY) qua SĐT Zalo.
 */

import React, { useState } from 'react';
import { X, CalendarDays, Utensils, Users, Phone, User, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BookingDrawerZaloProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  branchName: string;
}

export function BookingDrawerZalo({
  isOpen,
  onClose,
  branchId,
  branchName,
}: BookingDrawerZaloProps) {
  const [type, setType] = useState<'BOOK_TABLE' | 'TAKEAWAY'>('BOOK_TABLE');
  const [customerName, setCustomerName] = useState('');
  const [zaloPhone, setZaloPhone] = useState('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          customerName,
          zaloPhone,
          guestCount: Number(guestCount),
          type,
          details,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể gửi yêu cầu đặt bàn');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCustomerName('');
    setZaloPhone('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-t-3xl border-t border-neutral-800 bg-neutral-900 p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto">
        {/* Drawer Handle */}
        <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-amber-500" />
              <span>Đặt Bàn / Mang Về Nhanh</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Tại: <span className="text-amber-400 font-medium">{branchName}</span>
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Gửi Yêu Cầu Thành Công!</h4>
              <p className="text-xs text-neutral-300 max-w-xs mx-auto mt-1 leading-relaxed">
                Quản lý chi nhánh <span className="text-amber-400">{branchName}</span> đã nhận được thông báo ("Ting") và sẽ liên hệ Zalo xác nhận ngay cho bạn!
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://zalo.me/${zaloPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40"
              >
                <span>Mở Zalo Xác Nhận Nhanh</span>
              </a>
              <Button variant="ghost" onClick={handleResetAndClose}>
                Đóng cửa sổ
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Switch Type: Đặt bàn ăn tại quán VS Mang về */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-2xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setType('BOOK_TABLE')}
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer',
                  type === 'BOOK_TABLE'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-neutral-200',
                )}
              >
                <Utensils className="h-4 w-4" />
                <span>Ăn Tại Quán</span>
              </button>
              <button
                type="button"
                onClick={() => setType('TAKEAWAY')}
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer',
                  type === 'TAKEAWAY'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-neutral-200',
                )}
              >
                <CalendarDays className="h-4 w-4" />
                <span>Mua Mang Về</span>
              </button>
            </div>

            {/* Input Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-500" />
                <span>Họ và Tên người đặt *</span>
              </label>
              <Input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="VD: Anh Tuấn / Chị Lan"
              />
            </div>

            {/* Input Zalo Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>Số điện thoại dùng Zalo *</span>
              </label>
              <Input
                required
                type="tel"
                value={zaloPhone}
                onChange={(e) => setZaloPhone(e.target.value)}
                placeholder="VD: 0912345678 (để quản lý nhắn Zalo xác nhận)"
              />
            </div>

            {/* Guest Count (if BOOK_TABLE) */}
            {type === 'BOOK_TABLE' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-amber-500" />
                  <span>Số lượng khách dự kiến *</span>
                </label>
                <div className="flex items-center gap-2">
                  {[2, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer',
                        guestCount === num
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:border-neutral-600',
                      )}
                    >
                      {num} người
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Details / Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                <span>Ghi chú thêm (tùy chọn)</span>
              </label>
              <Input
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="VD: Cần phòng riêng, ăn cay ít, có trẻ nhỏ..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-sm font-bold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang gửi đơn...
                </>
              ) : (
                `Xác Nhận ${type === 'BOOK_TABLE' ? 'Đặt Bàn' : 'Đặt Mang Về'}`
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
