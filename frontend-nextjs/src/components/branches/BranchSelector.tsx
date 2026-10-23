'use client';

/**
 * @author Thành viên B (Task B1.3)
 * @description Component bộ chọn Chi nhánh trực quan trên giao diện Khách (Role 1).
 * Hiển thị điểm số sao trung bình (avgRating) và tổng số bài đánh giá (totalActiveReviews).
 * Khi khách bấm chọn, URL sẽ tự động cập nhật Query param `?branchId=...` (Điểm chạm số 1).
 */

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Store, MapPin, Phone, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  totalActiveReviews: number;
}

interface BranchSelectorProps {
  branches: Branch[];
}

export function BranchSelector({ branches }: BranchSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeBranchId = searchParams.get('branchId') || branches[0]?.id;

  const handleSelectBranch = (branchId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('branchId', branchId);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  if (!branches || branches.length === 0) {
    return (
      <Card className="p-4 text-center text-sm text-neutral-400">
        Đang tải thông tin chi nhánh...
      </Card>
    );
  }

  return (
    <div id="branches-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Store className="h-4 w-4 text-amber-500" />
          <span>Chọn Chi Nhánh Thưởng Thức</span>
        </h2>
        <span className="text-xs text-neutral-400">
          {branches.length} chi nhánh đang hoạt động
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {branches.map((branch) => {
          const isSelected = branch.id === activeBranchId;
          return (
            <div
              key={branch.id}
              onClick={() => handleSelectBranch(branch.id)}
              className={cn(
                'group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border',
                isSelected
                  ? 'bg-neutral-900 border-amber-500/80 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                      {branch.name}
                    </h3>
                    {isSelected && (
                      <Badge variant="warning" className="text-[10px] py-0">
                        Đang chọn
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                    <span>{branch.address}</span>
                  </p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                    <span className="text-amber-400 font-medium">{branch.phone}</span>
                  </p>
                </div>

                {/* Rating display */}
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-extrabold text-amber-400">
                      {branch.avgRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1">
                    {branch.totalActiveReviews} đánh giá
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
