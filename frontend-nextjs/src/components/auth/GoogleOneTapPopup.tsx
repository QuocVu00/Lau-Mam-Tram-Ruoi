'use client';

/**
 * @file frontend-nextjs/src/components/auth/GoogleOneTapPopup.tsx
 * @author Thành viên A (Task A1.2)
 * @description Popup Google One Tap đăng nhập 1 chạm ở góc dưới màn hình.
 * (Placeholder sẵn sàng để Thành viên A tích hợp Google Identity Services - GIS)
 */

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

export function GoogleOneTapPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      // Hiển thị nếu chưa có token hoặc token là chuỗi mock cũ
      if (!token || token.startsWith('demo_customer_token_') || token.startsWith('demo_phone_token_')) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleContinueAsCustomer = async () => {
    setIsLoading(true);
    try {
      const res: any = await apiClient('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: 'demo_google_one_tap' }),
      });
      localStorage.setItem('access_token', res.accessToken);
      localStorage.setItem('user_info', JSON.stringify(res.user));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_changed'));
      }
      setIsOpen(false);
    } catch (err) {
      console.error('Lỗi đăng nhập nhanh:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30 max-w-xs w-full bg-neutral-900 border border-neutral-700 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
            {/* Google Icon SVG */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">Đăng nhập nhanh Google</h5>
            <p className="text-[11px] text-neutral-400">Để viết đánh giá & nhận ưu đãi</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-neutral-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2.5">
        <button
          type="button"
          onClick={handleContinueAsCustomer}
          disabled={isLoading}
          className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang kết nối...</span>
            </>
          ) : (
            <span>Tiếp tục dưới tên Khách Hàng</span>
          )}
        </button>
      </div>
    </div>
  );
}
