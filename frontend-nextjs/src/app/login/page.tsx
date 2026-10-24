/**
 * @file frontend-nextjs/src/app/login/page.tsx
 * @description Trang đăng nhập nội bộ cho Quản lý chi nhánh (Role 2) và Admin (Role 3).
 * @author Thanh Vien A & B
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StaffLoginForm from '@/components/auth/StaffLoginForm';

export const metadata: Metadata = {
  title: 'Đăng Nhập Quản Trị | Lẩu Mắm Trăm Rưỡi',
  description: 'Cổng đăng nhập dành riêng cho Quản lý chi nhánh và Quản trị viên hệ thống.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950 relative">
      {/* Hiệu ứng đốm sáng nền mờ tạo cảm giác ấm cúng */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang chủ Lẩu Mắm</span>
        </Link>
        <StaffLoginForm />
      </div>
    </main>
  );
}
