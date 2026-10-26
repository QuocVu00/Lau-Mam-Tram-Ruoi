/**
 * @file frontend-nextjs/src/components/auth/StaffLoginForm.tsx
 * @description Form đăng nhập nội bộ dành cho Quản lý chi nhánh (Role 2) và Tổng Quản lý (Role 3).
 * Tích hợp điều hướng chính xác theo vai trò:
 * - Tổng Quản Lý (ADMIN) -> /admin/branches
 * - Quản Lý Chi Nhánh (MANAGER) -> /manager/bookings
 * Hỗ trợ các nút đăng nhập 1 chạm (1-Click Demo) tiện lợi khi thuyết trình/chạy demo.
 * @author Thanh Vien A & B
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ShieldAlert, CheckCircle2, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Trạng thái của các ô nhập liệu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hàm thực hiện đăng nhập và chuyển hướng theo đúng vai trò
  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Gọi API POST /auth/login của Backend NestJS
      const result = await apiClient<{
        message: string;
        accessToken: string;
        user: { id: string; email: string; fullName: string; role: string; branchId: string | null };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      // Lưu Token và Thông tin người dùng vào LocalStorage
      localStorage.setItem('access_token', result.accessToken);
      localStorage.setItem('user_info', JSON.stringify(result.user));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_changed'));
      }

      const roleName = result.user.role === 'ADMIN' ? 'Tổng Quản Lý' : 'Quản Lý Chi Nhánh';
      setSuccessMessage(`Đăng nhập thành công với vai trò ${roleName}! Đang mở trang điều hành...`);

      // Tự động điều hướng chính xác theo vai trò
      setTimeout(() => {
        if (result.user.role === 'ADMIN') {
          router.push('/admin/branches'); // Vào trang Tổng Quản Lý
        } else {
          router.push('/manager/bookings'); // Vào trang Quản Lý Chi Nhánh
        }
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản và mật khẩu!');
    } finally {
      setIsLoading(false);
    }
  };

  // Hỗ trợ gợi ý email và mật khẩu nếu có tham số URL ?role=admin hoặc ?role=manager
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin') {
      setEmail('admin@laumam.vn');
      setPassword('admin123');
    } else if (roleParam === 'manager') {
      setEmail('manager.q1@laumam.vn');
      setPassword('manager123');
    }
  }, [searchParams]);

  // Xử lý khi submit form thủ công
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await executeLogin(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-stone-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-500/20 text-stone-100">
      {/* Tiêu đề & Cổng nội bộ */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider mb-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Cổng Quản Trị Hệ Thống</span>
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Lẩu Mắm Trăm Rưỡi
        </h1>
        <p className="text-stone-400 text-xs mt-1">
          Hệ thống điều hành chuỗi nhà hàng ẩm thực Nam Bộ
        </p>
      </div>



      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Thông báo thành công */}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form nhập liệu thủ công */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
            Tài khoản Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@laumam.vn hoặc manager@laumam.vn"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-xs placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white text-xs placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xác thực thông tin...</span>
            </>
          ) : (
            <>
              <span>Đăng nhập điều hành</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
