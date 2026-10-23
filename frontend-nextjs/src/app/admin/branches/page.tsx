'use client';

/**
 * @file frontend-nextjs/src/app/admin/branches/page.tsx
 * @author Thành viên B (Task B1.3)
 * @description Trang Tổng quan Hệ thống (Admin Dashboard):
 * Hiển thị danh sách tất cả chi nhánh, điểm số sao của từng chi nhánh
 * và nút mở Modal "Tạo chi nhánh mới".
 */

import React, { useState, useEffect } from 'react';
import { Store, Plus, Star, MapPin, Phone, MessageSquare, RefreshCw } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminBranchModal } from '@/components/branches/AdminBranchModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BranchItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  totalActiveReviews: number;
  createdAt?: string;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: 'b1-default',
      name: 'Lẩu Mắm Trăm Rưỡi - Quận 1',
      address: '150 Nguyễn Trãi, P. Bến Thành, Quận 1, TP.HCM',
      phone: '0909 150 150',
      avgRating: 4.9,
      totalActiveReviews: 128,
    },
    {
      id: 'b2-default',
      name: 'Lẩu Mắm Trăm Rưỡi - Bình Thạnh',
      address: '280 Phan Xích Long nối dài, P. 2, Q. Phú Nhuận',
      phone: '0909 150 151',
      avgRating: 4.8,
      totalActiveReviews: 96,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/branches`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBranches(data);
        }
      }
    } catch (e) {
      console.warn('API backend chưa chạy, dùng dữ liệu mẫu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <AdminSidebar role="ADMIN" />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <Store className="h-6 w-6 text-amber-500" />
              <span>Tổng Quan & Quản Lý Chi Nhánh</span>
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Theo dõi điểm đánh giá thực tế và quản lý mạng lưới nhà hàng Lẩu Mắm Trăm Rưỡi
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchBranches}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Tạo Chi Nhánh Mới</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-neutral-900/60 border-neutral-800">
            <p className="text-xs text-neutral-400 font-medium">Tổng số chi nhánh</p>
            <p className="text-2xl font-black text-white mt-1">{branches.length}</p>
          </Card>
          <Card className="p-4 bg-neutral-900/60 border-neutral-800">
            <p className="text-xs text-neutral-400 font-medium">Điểm sao toàn hệ thống</p>
            <p className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-amber-400" />
              {(
                branches.reduce((acc, b) => acc + b.avgRating, 0) /
                (branches.length || 1)
              ).toFixed(1)}
            </p>
          </Card>
          <Card className="p-4 bg-neutral-900/60 border-neutral-800">
            <p className="text-xs text-neutral-400 font-medium">Tổng bài đánh giá hợp lệ</p>
            <p className="text-2xl font-black text-white mt-1">
              {branches.reduce((acc, b) => acc + b.totalActiveReviews, 0)}
            </p>
          </Card>
        </div>

        {/* Branches Table / Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
            Danh Sách Chi Nhánh
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map((b) => (
              <Card key={b.id} className="p-5 space-y-4 hover:border-neutral-700 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-white">{b.name}</h3>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                      <span>{b.address}</span>
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                      <span className="text-amber-400 font-semibold">{b.phone}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-amber-400">
                        {b.avgRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1">
                      {b.totalActiveReviews} đánh giá
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span className="text-[11px]">Mã ID: {b.id.slice(0, 10)}...</span>
                  <Badge variant="success" className="text-[10px]">Đang hoạt động</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Tạo Chi Nhánh */}
      <AdminBranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBranches}
      />
    </div>
  );
}
