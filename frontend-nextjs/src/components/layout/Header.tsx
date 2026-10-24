'use client';

/**
 * @file frontend-nextjs/src/components/layout/Header.tsx
 * @description Thanh Header phong cách Miền Tây:
 * - Logo quán Lẩu Mắm Trăm Rưỡi (/images/logo.jpg)
 * - Tự động nhận diện tài khoản Google của khách hoặc nút Đăng nhập
 * - Nút đổi nhanh chi nhánh kèm icon Store
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
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Đọc thông tin khách đã đăng nhập (Google hoặc tự động)
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
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/60 bg-[#241209]/95 backdrop-blur-md px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Logo & Tên Quán */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative h-10 w-10 rounded-2xl overflow-hidden border border-yellow-500/40 shadow-md shadow-black/60 bg-amber-950">
            <Image
              src="/images/logo.jpg"
              alt="Logo Lẩu Mắm Trăm Rưỡi"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-yellow-400 leading-none">
              Lẩu Mắm Trăm Rưỡi
            </h1>
            <p className="text-[10px] text-amber-200/90 font-medium mt-1">
              Đậm Vị Miền Tây
            </p>
          </div>
        </Link>

        {/* Nút Đổi Chi Nhánh & Trạng Thái Đăng Nhập */}
        <div className="flex items-center gap-2">
          {/* Nút bấm mở popup chọn chi nhánh */}
          {onChangeBranch && (
            <button
              type="button"
              onClick={onChangeBranch}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#361a0d] hover:bg-[#482312] border border-amber-600/40 text-yellow-400 text-[11px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer max-w-[125px]"
              title="Đổi chi nhánh xem"
            >
              <Store className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="truncate">{currentBranchName || 'Đổi CN'}</span>
              <ChevronDown className="w-3 h-3 text-amber-400 shrink-0" />
            </button>
          )}

          {/* Trạng thái khách đăng nhập Google */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-600/40 text-xs">
              {currentUser.avatarUrl ? (
                <div className="relative w-4 h-4 rounded-full overflow-hidden">
                  <Image
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-yellow-400" />
              )}
              <span className="text-[11px] font-bold text-amber-200 truncate max-w-[70px]">
                {currentUser.fullName}
              </span>
            </div>
          ) : (
            <Link
              href="/customer-login"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-yellow-600 text-stone-950 text-xs font-black shadow-sm transition-all active:scale-95 border border-yellow-400/40"
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
