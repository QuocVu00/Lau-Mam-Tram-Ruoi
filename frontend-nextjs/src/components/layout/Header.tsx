'use client';

/**
 * @file frontend-nextjs/src/components/layout/Header.tsx
 * @description Thanh Header tinh gọn theo yêu cầu:
 * - Logo & Tên quán ở góc trái ban đầu kèm slogan đầy đủ
 * - Không có nút đăng nhập / quản trị theo mong muốn giao diện
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  currentBranchName?: string;
  onChangeBranch?: () => void;
}

export function Header({ currentBranchName, onChangeBranch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md transition-colors duration-200">
      {/* Khoảng đệm bảo vệ tai thỏ iPhone / camera nốt ruồi Android - Logo đặt góc trái ban đầu */}
      <div className="pt-safe px-3.5 py-2.5 flex items-center justify-between gap-2 max-w-lg lg:max-w-5xl mx-auto">
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
              Lẩu Mắm - Bò Nhúng Giấm - Thịt Cuốn Bánh Tráng
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
