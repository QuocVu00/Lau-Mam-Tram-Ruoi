/**
 * @file frontend-nextjs/src/app/customer-login/page.tsx
 * @description Trang đăng nhập riêng biệt dành cho Khách vãng lai:
 * Hỗ trợ Đăng nhập Google 1 chạm hoặc số điện thoại, không có form mật khẩu quản trị.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');

  // Đăng nhập nhanh cho khách vãng lai bằng Google
  const handleGoogleLogin = async () => {
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

      router.push('/'); // Quay lại trang chủ khách vãng lai
    } catch (err: any) {
      alert(err.message || 'Lỗi đăng nhập nhanh!');
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng nhập nhanh bằng tên và số điện thoại
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !fullName) return;

    setIsLoading(true);

    try {
      const credential = `demo_phone_${phone.trim()}_${encodeURIComponent(fullName.trim())}`;
      const res: any = await apiClient('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      });

      localStorage.setItem('access_token', res.accessToken);
      localStorage.setItem('user_info', JSON.stringify(res.user));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_changed'));
      }

      router.push('/');
    } catch (err: any) {
      alert(err.message || 'Lỗi đăng nhập qua số điện thoại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex justify-center bg-stone-950 text-stone-100">
      {/* Khung giao diện điện thoại mặc định */}
      <div className="w-full max-w-md min-h-screen flex flex-col justify-between p-6 bg-stone-900 border-x border-stone-800 shadow-2xl relative">
        
        {/* Nút quay lại */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ Lẩu Mắm</span>
          </Link>
        </div>

        {/* Nội dung đăng nhập của khách */}
        <div className="my-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-950/60 mb-1">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-white">Đăng Nhập Thực Khách</h1>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Đăng nhập để viết bài đánh giá món ăn, chấm điểm sao và lưu danh sách đơn hàng.
            </p>
          </div>

          {/* Cách 1: Nút đăng nhập Google One Tap 1 chạm */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-stone-100 active:scale-[0.99] text-stone-900 font-bold text-xs rounded-xl flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer"
            >
              {/* Google Icon SVG */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              <span>{isLoading ? 'Đang kết nối...' : 'Đăng nhập nhanh với Google'}</span>
            </button>

            <div className="flex items-center gap-2 py-1">
              <div className="h-px flex-1 bg-stone-800" />
              <span className="text-[10px] uppercase font-bold text-stone-500">Hoặc tiếp tục bằng tên</span>
              <div className="h-px flex-1 bg-stone-800" />
            </div>

            {/* Cách 2: Nhập số điện thoại & họ tên để viết đánh giá */}
            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Tên của bạn (VD: Anh Hùng, Chị Mai...)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-3 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Số điện thoại nhận bàn / món mang về"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-3 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Vào Viết Đánh Giá Ngay
              </button>
            </form>
          </div>
        </div>

        {/* Chân trang */}
        <div className="pt-4 text-center space-y-2 border-t border-stone-800/60 mt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 hover:text-amber-400 hover:underline transition-colors"
          >
            <span>Dành cho Quản lý quán & Tổng quản lý →</span>
          </Link>
          <p className="text-[10px] text-stone-600">
            Lẩu Mắm Trăm Rưỡi • Nồng nàn hương vị quê hương
          </p>
        </div>
      </div>
    </main>
  );
}
