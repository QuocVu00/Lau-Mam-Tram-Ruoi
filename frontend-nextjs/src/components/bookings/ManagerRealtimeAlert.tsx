'use client';

/**
 * @author Thành viên B (Task B3.2)
 * @description Component tiếp nhận thông báo Đặt bàn / Mua mang về Realtime ("Ting")
 * dành riêng cho Quản lý chi nhánh (Role 2).
 * Lắng nghe sự kiện `new_booking_alert` qua Socket.io và tự động phát âm thanh chuông "Ting".
 * Hiển thị đầy đủ danh sách món ăn nếu là đơn Mang về.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { BellRing, Check, Phone, X, ShoppingBag, CalendarDays, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface BookingAlertPayload {
  bookingId: string;
  customerName: string;
  zaloPhone: string;
  guestCount: number;
  type: 'BOOK_TABLE' | 'TAKEAWAY';
  details?: string;
  createdAt: string;
}

interface ManagerRealtimeAlertProps {
  branchId: string;
  onNewBooking?: (booking: BookingAlertPayload) => void;
}

export function ManagerRealtimeAlert({
  branchId,
  onNewBooking,
}: ManagerRealtimeAlertProps) {
  const [activeAlert, setActiveAlert] = useState<BookingAlertPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Phát âm thanh chuông "Ting" hai nốt thanh thoát bằng Web Audio API
   * (Hoạt động 100% trên mọi trình duyệt mà không cần tải file mp3 bên ngoài)
   */
  const playTingSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Nốt 1: 880Hz (A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.6);

      // Nốt 2: 1320Hz (E6) vang cao ngân vang ("Ting")
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Không thể phát âm thanh Ting:', e);
    }
  }, []);

  useEffect(() => {
    if (!branchId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const socket: Socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_branch_room', { branchId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Lắng nghe tín hiệu bắn đơn từ khách
    socket.on('new_booking_alert', (data: BookingAlertPayload) => {
      playTingSound();
      setActiveAlert(data);
      if (onNewBooking) {
        onNewBooking(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [branchId, playTingSound, onNewBooking]);

  return (
    <>
      {/* Realtime Status Indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'
          }`}
        />
        <span className="text-neutral-400">
          {isConnected ? 'Realtime Socket: Đang kết nối' : 'Đang thử kết nối Realtime...'}
        </span>
      </div>

      {/* Floating Alert Popup ("Ting" Notification Banner) */}
      {activeAlert && (
        <div className="fixed top-5 right-5 z-50 w-full max-w-md rounded-2xl border border-amber-500/60 bg-neutral-900/98 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-950/50 animate-bounce shrink-0 mt-0.5">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-white">🔔 ĐƠN MỚI "TING"!</h4>
                  <Badge
                    variant={activeAlert.type === 'TAKEAWAY' ? 'warning' : 'info'}
                    className="text-[10px]"
                  >
                    {activeAlert.type === 'TAKEAWAY' ? 'MANG VỀ CHỌN MÓN' : 'ĂN TẠI QUÁN'}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Khách: <span className="font-bold text-white">{activeAlert.customerName}</span>
                  {activeAlert.type === 'BOOK_TABLE'
                    ? ` (${activeAlert.guestCount} người)`
                    : ` (${activeAlert.guestCount} phần món)`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveAlert(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chi tiết món nếu có */}
          {activeAlert.details && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 max-h-32 overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {activeAlert.details}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
            <div className="text-xs text-neutral-400 flex items-center gap-1">
              <Phone className="h-3 w-3 text-amber-500" />
              <span className="font-medium text-amber-400">{activeAlert.zaloPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://zalo.me/${activeAlert.zaloPhone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <span>Mở Zalo</span>
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveAlert(null)}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Đã xem
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
