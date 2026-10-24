'use client';

/**
 * @file frontend-nextjs/src/components/layout/Header.tsx
 * @description Thanh Header gọn gàng cho giao diện điện thoại khách vãng lai:
 * Hiển thị tên quán và nút Đăng nhập khách hàng.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, UserCheck, User } from 'lucide-react';

export function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra xem khách đã đăng nhập chưa
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        try {
          setCurrentUser(JSON.parse(userInfo));
        } catch {}
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800 bg-stone-900/95 backdrop-blur-md px-4 py-2.5">
      <div className="flex items-center justify-between">
        {/* Logo & Tên Quán */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md shadow-orange-950/50">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white leading-none">
              Lẩu Mắm Trăm Rưỡi
            </h1>
            <p className="text-[10px] text-amber-400 font-semibold mt-0.5">
              Đậm vị miền Tây
            </p>
          </div>
        </Link>

        {/* Nút Đăng nhập riêng cho Khách vãng lai */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-full border border-stone-700 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold text-stone-200 truncate max-w-[90px]">
              {currentUser.fullName}
            </span>
          </div>
        ) : (
          <Link
            href="/customer-login"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
}
