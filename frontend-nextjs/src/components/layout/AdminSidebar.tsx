'use client';

/**
 * @author Thành viên B (Task B1.1)
 * @description Thanh điều hướng Sidebar / Topbar dùng chung cho bảng điều khiển
 * Quản lý chi nhánh (Role 2) và Quản trị viên tối cao (Role 3).
 */

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Store,
  Users,
  ClipboardList,
  Bell,
  MessageSquareWarning,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  role?: 'MANAGER' | 'ADMIN';
  branchName?: string;
}

export function AdminSidebar({ role = 'ADMIN', branchName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.dispatchEvent(new Event('auth_changed'));
    }
    router.push('/login');
  };

  const adminNav = [
    {
      title: 'Quản lý Chi nhánh',
      href: '/admin/branches',
      icon: Store,
    },
    {
      title: 'Tóm tắt Số sao',
      href: '/admin/ratings',
      icon: BarChart3,
    },
    {
      title: 'Toàn bộ Đánh giá',
      href: '/admin/reviews',
      icon: MessageSquare,
    },
    {
      title: 'Quản lý Nhân sự (Role 2)',
      href: '/admin/staff',
      icon: Users,
    },
    {
      title: 'Lịch sử xóa đánh giá',
      href: '/admin/logs',
      icon: MessageSquareWarning,
      badge: 'Admin Only',
    },
  ];

  const managerNav = [
    {
      title: 'Đơn Đặt bàn Realtime',
      href: '/manager/bookings',
      icon: Bell,
      badge: 'Ting',
    },
    {
      title: 'Quản lý Đánh giá & Xóa bài',
      href: '/manager/reviews',
      icon: ClipboardList,
    },
  ];

  const navItems = role === 'ADMIN' ? adminNav : managerNav;

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Brand & Role Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
              <span className="font-extrabold text-sm text-white uppercase tracking-wider">
                {role === 'ADMIN' ? 'Hệ Thống Admin' : 'Quản Lý Quán'}
              </span>
            </div>
            {branchName && (
              <p className="text-xs text-neutral-400 mt-1 truncate max-w-[200px]">
                Chi nhánh: <span className="text-amber-400 font-medium">{branchName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Navigation Links: Tự động xếp ngang trên mobile có vuốt mượt, xếp dọc trên máy tính */}
        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap',
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden md:inline">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation: Xếp ngang trên mobile, xếp dọc trên máy tính */}
      <div className="pt-3 md:pt-4 border-t border-neutral-800 flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-2 mt-3 md:mt-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 text-xs text-neutral-400 hover:text-neutral-200 transition-colors rounded-lg hover:bg-neutral-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Về trang chủ</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 text-xs text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-950/20 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
