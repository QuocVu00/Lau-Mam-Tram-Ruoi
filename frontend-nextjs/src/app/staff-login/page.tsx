/**
 * @file frontend-nextjs/src/app/staff-login/page.tsx
 * @description Tuyến đường riêng biệt dành cho Ban Quản trị: Admin & Quản lý chi nhánh đăng nhập.
 * Khách vãng lai không sử dụng trang này.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import StaffLoginForm from '@/components/auth/StaffLoginForm';

export const metadata: Metadata = {
  title: 'Cổng Quản Trị Nội Bộ | Lẩu Mắm Trăm Rưỡi',
  description: 'Dành riêng cho Quản lý chi nhánh và Quản trị viên hệ thống.',
};

import { redirect } from 'next/navigation';

export default function StaffLoginPage() {
  redirect('/login');
}
