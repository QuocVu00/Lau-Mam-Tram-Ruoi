/**
 * @file frontend-nextjs/src/app/staff-login/page.tsx
 * @description Tuyến đường riêng biệt dành cho Ban Quản trị: Admin & Quản lý chi nhánh đăng nhập.
 * Khách vãng lai không sử dụng trang này.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import StaffLoginForm from '@/components/auth/StaffLoginForm';

export const metadata: Metadata = {
  title: 'Cổng Quản Trị Nội Bộ | Lẩu Mắm Trăm Rưỡi',
  description: 'Dành riêng cho Quản lý chi nhánh và Quản trị viên hệ thống.',
};

export default function StaffLoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-stone-950 text-stone-100 relative">
      {/* Nền hiệu ứng nhận diện cổng bảo mật nội bộ */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-4">
        {/* Nút quay lại trang trải nghiệm khách hàng */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang khách hàng</span>
          </Link>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Cổng Quản Trị</span>
          </span>
        </div>

        {/* Form nhập Email & Mật khẩu */}
        <StaffLoginForm />
      </div>
    </main>
  );
}
