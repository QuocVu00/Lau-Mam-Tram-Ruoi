'use client';

/**
 * @author Thành viên B (Task B1.1)
 * @description Thanh Header chuẩn Mobile-First cho Khách hàng (Role 1),
 * tích hợp hiển thị tên quán "Lẩu Mắm Trăm Rưỡi" và bộ chọn nhanh Chi nhánh.
 */

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Sparkles, Phone } from 'lucide-react';

interface BranchItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  totalActiveReviews: number;
}

interface HeaderProps {
  branches?: BranchItem[];
  currentBranchId?: string;
}

export function Header({ branches = [], currentBranchId }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeBranchId = currentBranchId || searchParams.get('branchId') || (branches[0]?.id ?? '');

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBranchId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('branchId', newBranchId);
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-orange-950/50">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white">
              Lẩu Mắm Trăm Rưỡi
            </h1>
            <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <span>Hương vị miền Tây chuẩn vị</span>
            </p>
          </div>
        </div>

        {/* Branch Quick Selector */}
        {branches.length > 0 ? (
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 max-w-[170px]">
            <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
            <select
              value={activeBranchId}
              onChange={handleBranchChange}
              className="bg-transparent text-xs text-neutral-200 font-medium focus:outline-none cursor-pointer truncate w-full"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-neutral-900 text-neutral-200">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-xs text-neutral-400 flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-amber-500" />
            <span>0909 150 150</span>
          </div>
        )}
      </div>
    </header>
  );
}
