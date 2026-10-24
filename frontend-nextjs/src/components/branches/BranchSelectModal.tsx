'use client';

/**
 * @file frontend-nextjs/src/components/branches/BranchSelectModal.tsx
 * @description Modal Popup chọn Chi nhánh dành cho Khách hàng:
 * - Tự động hiển thị khi khách lần đầu truy cập hoặc khi khách muốn đổi chi nhánh
 * - Trình bày thẻ chi nhánh kèm hình ảnh chụp thực tế (/images/chinhanh1.jpg, /images/chinhanh3.jpg)
 * - Tông màu Nâu đất miền Tây sang trọng kết hợp chữ Vàng đồng
 */

import React from 'react';
import Image from 'next/image';
import { Store, MapPin, Phone, Star, Check, ArrowRight } from 'lucide-react';

export interface BranchData {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  totalActiveReviews: number;
  image: string;
  description: string;
}

interface BranchSelectModalProps {
  isOpen: boolean;
  branches: BranchData[];
  selectedBranchId: string;
  onSelect: (branchId: string) => void;
  onClose?: () => void;
}

export function BranchSelectModal({
  isOpen,
  branches,
  selectedBranchId,
  onSelect,
  onClose,
}: BranchSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-[#241209] text-amber-100 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-amber-900/80 max-h-[90vh] flex flex-col">
        {/* Tiêu đề Modal */}
        <div className="text-center pb-4 border-b border-amber-900/60">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-600 shadow-md shadow-black/60 mb-2 border border-yellow-500/40">
            <Store className="w-5 h-5 text-stone-950" />
          </div>
          <h2 className="text-base font-black text-yellow-400">
            Chọn Chi Nhánh Thưởng Thức
          </h2>
          <p className="text-xs text-amber-200/80 mt-1">
            Vui lòng chọn chi nhánh gần bạn nhất để xem menu, hình ảnh và đánh giá
          </p>
        </div>

        {/* Danh sách các chi nhánh */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {branches.map((b) => {
            const isSelected = b.id === selectedBranchId;

            return (
              <div
                key={b.id}
                onClick={() => onSelect(b.id)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-3 ${
                  isSelected
                    ? 'border-yellow-400 bg-[#351a0d] shadow-lg shadow-black/60 scale-[1.01]'
                    : 'border-amber-900/60 bg-[#1d0e07] hover:border-amber-600/60'
                }`}
              >
                {/* Ảnh chi nhánh */}
                <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-amber-900/60">
                  <Image
                    src={b.image}
                    alt={b.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 448px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Điểm đánh giá */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-yellow-500/30 flex items-center gap-1 text-[11px] font-bold text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{b.avgRating.toFixed(1)}</span>
                  </div>

                  {/* Nhãn Đang chọn */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-stone-950 px-2 py-0.5 rounded-lg font-black text-[10px] flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Đang chọn</span>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-[11px] text-amber-200 line-clamp-1 font-medium">
                      {b.description}
                    </p>
                  </div>
                </div>

                {/* Thông tin chi nhánh */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-yellow-400">
                      {b.name}
                    </h3>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-amber-200/80">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{b.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-amber-300/80">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-amber-500" />
                      <span>{b.phone}</span>
                    </div>
                    <span className="text-yellow-400 font-bold flex items-center gap-1">
                      <span>Vào xem chi nhánh</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
