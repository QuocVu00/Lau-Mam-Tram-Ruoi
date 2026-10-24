'use client';

/**
 * @file frontend-nextjs/src/components/layout/MobileFrame.tsx
 * @author Thành viên B (Task B1.1)
 * @description Khung mô phỏng điện thoại thông minh (Smartphone Device Mockup)
 * - Trên điện thoại thật (< 768px): Hiển thị toàn màn hình chuẩn Native Mobile App 100%.
 * - Trên máy tính / Desktop: Bao bọc ứng dụng trong khung iPhone sang trọng (Bezel, Dynamic Island, Status Bar pin/wifi, Home Bar),
 *   kèm công cụ chuyển đổi nhanh và địa chỉ IP để quét mở trên điện thoại thật.
 */

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor, QrCode, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('9:41');
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

  // Cập nhật đồng hồ trên thanh trạng thái điện thoại
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Background ambient glow effect on desktop */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Toolbar on Desktop (Điều khiển khung điện thoại & QR / IP) */}
      <header className="hidden md:flex items-center justify-between w-full max-w-4xl px-4 py-3 z-30 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-950/40">
            <Smartphone className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Giao Diện Di Động "Lẩu Mắm Trăm Rưỡi"</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Mobile-First
              </span>
            </h2>
            <p className="text-[11px] text-neutral-400">
              Mô phỏng trải nghiệm lướt mượt trên thiết bị di động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút xem IP mở điện thoại thật */}
          <button
            type="button"
            onClick={() => setShowNetworkInfo(!showNetworkInfo)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5 text-amber-400" />
            <span>Mở trên ĐT thật</span>
          </button>

          {/* Nút bật/tắt khung điện thoại trên Desktop */}
          <button
            type="button"
            onClick={() => setIsFrameEnabled(!isFrameEnabled)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isFrameEnabled ? (
              <>
                <Monitor className="h-3.5 w-3.5 text-sky-400" />
                <span>Xem Full Chiều Rộng</span>
              </>
            ) : (
              <>
                <Smartphone className="h-3.5 w-3.5 text-amber-400" />
                <span>Bật Khung Điện Thoại</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Hộp thông tin mở trên điện thoại thật nếu bấm nút */}
      {showNetworkInfo && (
        <div className="hidden md:flex flex-col items-center p-3 mb-3 rounded-2xl bg-neutral-900 border border-amber-500/40 shadow-xl max-w-md text-xs text-center z-30 animate-in fade-in zoom-in-95 duration-150">
          <p className="font-bold text-amber-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Để mở trực tiếp trên Smartphone của bạn:</span>
          </p>
          <p className="text-neutral-300 mt-1">
            Hãy kết nối điện thoại vào cùng mạng Wi-Fi và mở trình duyệt gõ:
          </p>
          <code className="mt-1 px-3 py-1 rounded-lg bg-neutral-950 text-amber-300 font-mono text-sm border border-neutral-800 select-all">
            http://192.168.1.234:3000
          </code>
        </div>
      )}

      {/* ==============================================================
          MAIN CONTAINER: PHONE MOCKUP HOẶC NATIVE FULLSCREEN
          ============================================================== */}
      <div
        className={cn(
          'w-full transition-all duration-300',
          isFrameEnabled
            ? 'md:max-w-[420px] md:h-[880px] md:max-h-[92vh] md:rounded-[50px] md:p-3 md:bg-neutral-900 md:border-[6px] md:border-neutral-800 md:shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] md:flex md:flex-col md:relative'
            : 'max-w-lg min-h-screen flex flex-col',
        )}
      >
        {/* Khung màn hình trong điện thoại */}
        <div
          className={cn(
            'w-full flex-1 flex flex-col bg-neutral-950 relative overflow-hidden',
            isFrameEnabled ? 'md:rounded-[42px] md:border md:border-neutral-800/80' : '',
          )}
        >
          {/* Thanh trạng thái điện thoại (Status Bar: Time, Dynamic Island, Wifi, Battery) */}
          <div
            className={cn(
              'w-full z-50 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-white select-none shrink-0 bg-neutral-950',
              !isFrameEnabled ? 'hidden' : 'flex',
            )}
          >
            {/* Giờ hiện tại */}
            <span className="font-bold tracking-tight text-[13px]">{currentTime}</span>

            {/* Dynamic Island Pill */}
            <div className="h-5 w-24 bg-black rounded-full flex items-center justify-center border border-neutral-800/80 shadow-inner">
              <div className="h-2 w-2 rounded-full bg-neutral-900 mr-2" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/40" />
            </div>

            {/* Icons: Sóng, Wifi, Pin */}
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Signal className="h-3.5 w-3.5" />
              <Wifi className="h-3.5 w-3.5" />
              <BatteryMedium className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          {/* Vùng nội dung cuộn mượt (Screen Scrollable Area) */}
          <div className="flex-1 w-full overflow-y-auto overscroll-y-contain flex flex-col relative">
            {children}
          </div>

          {/* Thanh vuốt điều hướng đáy màn hình điện thoại (Home Indicator Bar) */}
          <div
            className={cn(
              'w-full py-1.5 bg-neutral-950/90 backdrop-blur-md flex justify-center items-center shrink-0 z-40',
              !isFrameEnabled ? 'hidden' : 'block md:block',
            )}
          >
            <div className="w-32 h-1 bg-neutral-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
