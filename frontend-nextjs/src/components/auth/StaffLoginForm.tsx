/**
 * @file frontend-nextjs/src/components/auth/StaffLoginForm.tsx
 * @description Form đăng nhập nội bộ dành cho Quản lý chi nhánh (Role 2) và Admin (Role 3).
 * @author Thanh Vien A (Task A1.2)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function StaffLoginForm() {
  const router = useRouter();

  // Trạng thái của các ô nhập liệu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hàm xử lý khi bấm nút "Đăng nhập"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Bước 1: Gửi email và mật khẩu sang Backend API NestJS
      const result = await apiClient<{
        message: string;
        accessToken: string;
        user: { id: string; email: string; fullName: string; role: string; branchId: string | null };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Bước 2: Lưu mã Token và thông tin User vào bộ nhớ trình duyệt
      localStorage.setItem('access_token', result.accessToken);
      localStorage.setItem('user_info', JSON.stringify(result.user));

      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');

      // Bước 3: Tự động điều hướng theo đúng vai trò (Role-based Routing)
      setTimeout(() => {
        if (result.user.role === 'ADMIN') {
          router.push('/admin/branches'); // Admin vào thẳng trang Quản lý Chi nhánh
        } else {
          router.push('/manager/bookings'); // Quản lý vào trang Quản lý đơn đặt bàn
        }
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Nút bấm tiện ích: Điền nhanh tài khoản Demo khi thuyết trình
  const handleQuickFill = (role: 'ADMIN' | 'MANAGER') => {
    if (role === 'ADMIN') {
      setEmail('admin@laumam.vn');
      setPassword('123456');
    } else {
      setEmail('vuga@gmail.com');
      setPassword('123456');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-500/20">
      {/* Tiêu đề & Logo */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
          Cổng Quản Trị Nội Bộ
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          Lẩu Mắm Trăm Rưỡi
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          Đăng nhập dành cho Quản lý chi nhánh & Admin
        </p>
      </div>

      {/* Thông báo lỗi (nếu có) */}
      {errorMessage && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Thông báo thành công */}
      {successMessage && (
        <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Tài khoản Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@laumam.vn"
              required
              className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Đăng nhập hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Tiện ích 1-Click Fill Demo */}
      <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
        <p className="text-xs text-center font-medium text-stone-500 mb-3">
          Tài khoản Demo có sẵn (Bấm để điền nhanh):
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickFill('MANAGER')}
            className="px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg transition-all"
          >
            Quản Lý (Role 2)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('ADMIN')}
            className="px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 border border-amber-200 dark:border-amber-800/40 rounded-lg transition-all"
          >
            Admin (Role 3)
          </button>
        </div>
      </div>
    </div>
  );
}
