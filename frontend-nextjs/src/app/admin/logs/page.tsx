'use client';

/**
 * @file frontend-nextjs/src/app/admin/logs/page.tsx
 * @author Thành viên A (Task A3.2)
 * @description Màn hình Lịch sử xóa đánh giá dành riêng cho Admin (Role 3).
 * (Placeholder sẵn sàng để Thành viên A tích hợp Modal snapshot bài đã xóa và xóa vĩnh viễn)
 */

import React from 'react';
import { History, ShieldAlert } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/card';

export default function AdminLogsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row">
      <AdminSidebar role="ADMIN" />

      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-5xl">
        <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              Lịch Sử Xóa Đánh Giá (Admin Only)
            </h1>
            <p className="text-xs text-neutral-400">
              Kiểm soát các bài viết bị Role 2 xóa và xóa vĩnh viễn (Khu vực của Thành viên A - Task A3.2)
            </p>
          </div>
        </div>

        <Card className="p-8 text-center text-xs text-neutral-400">
          Màn hình này do Thành viên A phụ trách triển khai kiểm tra snapshot bài viết đã xóa.
        </Card>
      </main>
    </div>
  );
}
