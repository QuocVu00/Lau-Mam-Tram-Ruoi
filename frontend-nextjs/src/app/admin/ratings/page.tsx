'use client';

/**
 * @file frontend-nextjs/src/app/admin/ratings/page.tsx
 * @description Trang Tóm tắt Số sao Toàn Hệ Thống (Rating Summary & Breakdown):
 * - Widget "Tóm tắt bài đánh giá" chuẩn Google Maps / Play Store với thanh phân bố số sao (5★ - 1★)
 * - Điểm số trung bình lớn, 5 ngôi sao trực quan và liên kết tới danh sách bài viết
 * - Bộ lọc theo từng chi nhánh hoặc xem toàn hệ thống
 * - Bảng so sánh chi tiết số sao giữa các chi nhánh
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Store,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { IReview } from '@/lib/contracts';

interface BranchItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  totalActiveReviews: number;
}

export default function AdminRatingsSummaryPage() {
  const router = useRouter();

  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Kiểm tra quyền ADMIN khi truy cập trang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user_info');
      const token = localStorage.getItem('access_token');
      if (!token || !userStr) {
        router.push('/login');
        return;
      }
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') {
          router.push('/manager/bookings');
          return;
        }
      } catch {
        router.push('/login');
        return;
      }
    }
  }, [router]);

  // 2. Tải danh sách chi nhánh và tất cả bài đánh giá hợp lệ
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [branchesRes, reviewsRes] = await Promise.all([
        apiClient<BranchItem[]>('/branches').catch(() => []),
        apiClient<{ data: IReview[] }>('/reviews', { params: { page: 1, limit: 100 } }).catch(() => ({ data: [] })),
      ]);

      if (Array.isArray(branchesRes)) {
        setBranches(branchesRes);
      }
      if (reviewsRes && Array.isArray(reviewsRes.data)) {
        setReviews(reviewsRes.data);
      }
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu tóm tắt đánh giá:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Lọc danh sách bài đánh giá theo chi nhánh đã chọn
  const filteredReviews = useMemo(() => {
    if (selectedBranchId === 'ALL') {
      return reviews;
    }
    return reviews.filter((r) => r.branchId === selectedBranchId);
  }, [reviews, selectedBranchId]);

  // 4. Tính toán phân bổ số sao (5 sao -> 1 sao)
  const stats = useMemo(() => {
    const total = filteredReviews.length;
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    filteredReviews.forEach((r) => {
      const roundedRating = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[roundedRating] = (counts[roundedRating] || 0) + 1;
    });

    const sumRating = filteredReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    const avgRating = total > 0 ? (sumRating / total) : 0;

    const percentages: Record<number, number> = {
      5: total > 0 ? (counts[5] / total) * 100 : 0,
      4: total > 0 ? (counts[4] / total) * 100 : 0,
      3: total > 0 ? (counts[3] / total) * 100 : 0,
      2: total > 0 ? (counts[2] / total) * 100 : 0,
      1: total > 0 ? (counts[1] / total) * 100 : 0,
    };

    return {
      total,
      counts,
      percentages,
      avgRating: avgRating.toFixed(1),
      avgRatingFormatted: avgRating.toFixed(1).replace('.', ','),
    };
  }, [filteredReviews]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row text-stone-100">
      {/* Sidebar Admin */}
      <AdminSidebar role="ADMIN" />

      {/* Nội dung chính */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-5xl">
        {/* Thanh tiêu đề & nút điều hướng */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <BarChart3 className="h-6 w-6 text-amber-500" />
              <span>Phân Bố & Tóm Tắt Số Sao Hệ Thống</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/admin/reviews">
              <Button variant="primary" size="sm">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                <span>Xem Tất Cả Bài Đánh Giá</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ============================================================= */}
        {/* KHỐI TRỌNG TÂM: WIDGET "TÓM TẮT BÀI ĐÁNH GIÁ"                 */}
        {/* Bấm vào khối tóm tắt chuyển thẳng sang trang danh sách bài viết */}
        {/* ============================================================= */}
        <Card
          onClick={() => {
            const targetUrl =
              selectedBranchId === 'ALL'
                ? '/admin/reviews'
                : `/admin/reviews?branchId=${selectedBranchId}`;
            router.push(targetUrl);
          }}
          className="p-6 bg-neutral-900/90 border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900/95 shadow-xl rounded-2xl relative overflow-hidden cursor-pointer transition-all duration-200 group"
          title="Bấm vào để xem danh sách bài đánh giá"
        >
          {/* Header Card */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>Tóm tắt bài đánh giá</span>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </h2>
              <div
                title="Tỉ lệ phân bố điểm đánh giá tính từ toàn bộ nhận xét hợp lệ của thực khách"
                className="text-neutral-400 hover:text-neutral-200 cursor-help"
                onClick={(e) => e.stopPropagation()}
              >
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>

            {selectedBranchId !== 'ALL' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBranchId('ALL');
                }}
                className="text-[11px] font-semibold text-neutral-400 hover:text-white px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700"
                title="Bấm để xem thống kê toàn bộ chuỗi"
              >
                ✕ Xem toàn chuỗi
              </button>
            )}
          </div>

          {/* Nội dung widget 2 cột */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Cột trái: Thanh phân bố 5 sao -> 1 sao */}
            <div className="md:col-span-7 space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.counts[star] || 0;
                const percent = stats.percentages[star] || 0;

                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    {/* Số sao bên trái */}
                    <span className="w-3 text-right font-bold text-neutral-300">
                      {star}
                    </span>

                    {/* Thanh tiến trình màu vàng */}
                    <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 ease-out min-w-[3px]"
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>

                    {/* Số lượng bài và phần trăm */}
                    <div className="w-16 text-right flex items-center justify-end gap-1.5 font-mono text-[11px] text-neutral-400">
                      <span className="font-semibold text-neutral-200">{count}</span>
                      <span className="text-[10px] text-neutral-500">({percent.toFixed(0)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vách ngăn mờ trên màn hình lớn */}
            <div className="hidden md:block md:col-span-1 h-32 w-px bg-neutral-800 mx-auto" />

            {/* Cột phải: Điểm số trung bình to bản, 5 sao & liên kết bài viết */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-2">
              {/* Điểm số lớn (VD: 4,7 hoặc 4,9) */}
              <div className="text-6xl font-black text-white tracking-tight leading-none mb-2">
                {stats.avgRatingFormatted}
              </div>

              {/* Dải 5 ngôi sao trực quan */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => {
                  const ratingNum = parseFloat(stats.avgRating);
                  const isFull = ratingNum >= s;
                  const isHalf = !isFull && ratingNum >= s - 0.5;

                  return (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${
                        isFull
                          ? 'fill-amber-400 text-amber-400'
                          : isHalf
                          ? 'fill-amber-400/60 text-amber-400'
                          : 'fill-neutral-800 text-neutral-700'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Số lượng bài viết */}
              <div className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 inline-flex items-center gap-1 transition-colors">
                <span>{stats.total} bài viết</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Card>

        {/* Bảng so sánh điểm số sao chi tiết giữa các Chi Nhánh */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Bảng Thống Kê Điểm Số Từng Chi Nhánh</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((b) => {
              const branchReviews = reviews.filter((r) => r.branchId === b.id);
              const branchAvg = b.avgRating || 0;
              const count5 = branchReviews.filter((r) => Math.round(r.rating || 5) === 5).length;
              const count4 = branchReviews.filter((r) => Math.round(r.rating || 5) === 4).length;

              return (
                <Card
                  key={b.id}
                  onClick={() => setSelectedBranchId(selectedBranchId === b.id ? 'ALL' : b.id)}
                  className={`p-4 transition-all cursor-pointer border ${
                    selectedBranchId === b.id
                      ? 'bg-neutral-900 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-white truncate">{b.name}</h4>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-lg shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{branchAvg.toFixed(1)}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mb-3">{b.address}</p>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Tổng đánh giá:</span>
                    <span className="font-bold text-white font-mono">{b.totalActiveReviews || branchReviews.length} bài</span>
                  </div>

                  <div className="mt-2 text-[10px] text-neutral-500 flex justify-between">
                    <span>5★: <strong className="text-amber-400 font-mono">{count5}</strong></span>
                    <span>4★: <strong className="text-neutral-300 font-mono">{count4}</strong></span>
                    <span>Khác: <strong className="text-neutral-400 font-mono">{branchReviews.length - count5 - count4}</strong></span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
