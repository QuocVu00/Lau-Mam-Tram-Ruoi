'use client';

/**
 * @file frontend-nextjs/src/app/manager/reviews/page.tsx
 * @author Thành viên A (Task A3.2)
 * @description Màn hình Quản lý đánh giá & Xóa đánh giá chi nhánh dành cho Role 2.
 * (Placeholder sẵn sàng để Thành viên A tích hợp logic xóa và tính lại avgRating)
 */

import React from 'react';
import { MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/card';

export default function ManagerReviewsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row">
      <AdminSidebar role="MANAGER" branchName="Lẩu Mắm Trăm Rưỡi - Quận 1" />

      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-5xl">
        <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <MessageSquareWarning className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              Quản Lý Đánh Giá Chi Nhánh
            </h1>
            <p className="text-xs text-neutral-400">
              Phản hồi khách hàng và xử lý đánh giá vi phạm (Khu vực của Thành viên A - Task A3.2)
            </p>
          </div>
        </div>

        <Card className="p-8 text-center text-xs text-neutral-400">
          Màn hình này do Thành viên A phụ trách triển khai tính năng Quản lý xóa bài và trả lời đánh giá.
        </Card>
      </main>
    </div>
  );
}
