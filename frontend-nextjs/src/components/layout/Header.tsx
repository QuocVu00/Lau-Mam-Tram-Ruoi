'use client';

/**
 * @file frontend-nextjs/src/components/layout/Header.tsx
 * @description Thanh Header thích ứng màu theo máy (Light/Dark Mode) & chuẩn điện thoại:
 * - Tương thích notch tai thỏ với lớp pt-safe
 * - Nền mờ kính (Backdrop blur) thích ứng theo biến màu hệ thống
 * - Logo, Đổi nhanh chi nhánh, Trạng thái tài khoản
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, UserCheck, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentBranchName?: string;
  onChangeBranch?: () => void;
}

export function Header({ currentBranchName, onChangeBranch }: HeaderProps) {
  // Trạng thái lưu thông tin người dùng đã đăng nhập trong localStorage
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Bước 1: Đọc thông tin phiên đăng nhập từ localStorage khi chạy trên trình duyệt
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        try {
          setCurrentUser(JSON.parse(userInfo));
        } catch {
          // Bỏ qua lỗi cú pháp JSON nếu chuỗi lưu trữ không đúng định dạng
        }
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md transition-colors duration-200">
      {/* Khoảng đệm bảo vệ tai thỏ iPhone / camera nốt ruồi Android */}
      <div className="pt-safe px-3.5 py-2.5 flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Logo & Tên Quán */}
        <Link href="/" className="flex items-center gap-2 shrink-0 active:scale-95 transition-transform">
          {/* Khung chứa ảnh Logo có viền bo góc tròn mềm mại */}
          <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-[var(--border-color)] shadow-sm bg-[var(--bg-muted)]">
            <Image
              src="/images/logo.jpg"
              alt="Logo Lẩu Mắm Trăm Rưỡi"
              fill
              className="object-cover"
              sizes="36px"
              priority
            />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-[var(--primary)] leading-none uppercase">
              Lẩu Mắm Trăm Rưỡi
            </h1>
            <p className="text-[10px] text-[var(--text-sub)] font-medium mt-0.5">
              Đậm Vị Nam Bộ
            </p>
          </div>
        </Link>

        {/* Nút Đổi Chi Nhánh & Trạng Thái Đăng Nhập */}
        <div className="flex items-center gap-1.5">
          {/* Nút bấm chuyển đổi nhanh chi nhánh */}
          {onChangeBranch && (
            <button
              type="button"
              onClick={onChangeBranch}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--bg-muted)] hover:opacity-90 border border-[var(--border-color)] text-[var(--text-main)] text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer max-w-[120px]"
              title="Đổi chi nhánh phục vụ"
            >
              <Store className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
              <span className="truncate">{currentBranchName || 'Đổi CN'}</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-sub)] shrink-0" />
            </button>
          )}

          {/* Trạng thái khách đăng nhập */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-color)] text-xs">
              {currentUser.avatarUrl ? (
                <div className="relative w-4 h-4 rounded-full overflow-hidden border border-[var(--border-color)]">
                  <Image
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
              )}
              <span className="text-[11px] font-bold text-[var(--text-main)] truncate max-w-[65px]">
                {currentUser.fullName}
              </span>
            </div>
          ) : (
            <Link
              href="/customer-login"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 text-xs font-black shadow-sm transition-all active:scale-95 border border-yellow-400/50"
            >
              <User className="w-3.5 h-3.5 text-stone-950" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
