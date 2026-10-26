'use client';

/**
 * @file frontend-nextjs/src/app/admin/reviews/page.tsx
 * @description Trang Quản Lý & Xem Toàn Bộ Đánh Giá Hợp Lệ Của Hệ Thống (Admin Review Explorer):
 * - Hiển thị tất cả bài đánh giá ACTIVE của khách hàng từ tất cả các chi nhánh
 * - Bộ lọc đa chiều: Theo chi nhánh, theo số sao (5★ -> 1★), tìm kiếm nội dung / tên khách
 * - Xem hình ảnh / video món ăn đính kèm
 * - Tích hợp xem chi tiết qua ReviewDetailModal
 */

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Star,
  Store,
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Calendar,
  User,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { IReview } from '@/lib/contracts';

interface BranchItem {
  id: string;
  name: string;
  address: string;
}

function AdminReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBranchId = searchParams.get('branchId') || 'ALL';

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId);
  const [selectedStar, setSelectedStar] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Kiểm tra quyền ADMIN khi truy cập
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

  // 2. Tải toàn bộ dữ liệu từ Backend
  const loadReviewsData = async () => {
    setIsLoading(true);
    try {
      const [branchesRes, reviewsRes] = await Promise.all([
        apiClient<BranchItem[]>('/branches').catch(() => []),
        apiClient<{ data: IReview[] }>('/reviews', { params: { page: 1, limit: 100 } }).catch(() => ({ data: [] })),
      ]);

      if (Array.isArray(branchesRes)) setBranches(branchesRes);
      if (reviewsRes && Array.isArray(reviewsRes.data)) setReviews(reviewsRes.data);
    } catch (err) {
      console.warn('Lỗi khi tải bài đánh giá:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, []);

  // 3. Lọc bài viết theo Chi nhánh, Số sao và Từ khóa tìm kiếm
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Lọc chi nhánh
      if (selectedBranchId !== 'ALL' && r.branchId !== selectedBranchId) {
        return false;
      }
      // Lọc số sao
      if (selectedStar !== 'ALL' && Math.round(r.rating || 5) !== selectedStar) {
        return false;
      }
      // Lọc từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const authorMatch = r.user?.fullName?.toLowerCase().includes(q);
        const contentMatch = r.content?.toLowerCase().includes(q);
        const branchMatch = r.branch?.name?.toLowerCase().includes(q);
        if (!authorMatch && !contentMatch && !branchMatch) {
          return false;
        }
      }
      return true;
    });
  }, [reviews, selectedBranchId, selectedStar, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row text-stone-100">
      {/* Sidebar Admin */}
      <AdminSidebar role="ADMIN" />

      {/* Nội dung chính */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <MessageSquare className="h-6 w-6 text-amber-500" />
              <span>Toàn Bộ Bài Đánh Giá Hợp Lệ</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/admin/ratings">
              <Button variant="secondary" size="sm" className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
                <BarChart3 className="h-4 w-4 mr-1.5" />
                <span>Xem Tóm Tắt Số Sao</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Thanh công cụ tìm kiếm & Bộ lọc */}
        <Card className="p-4 bg-neutral-900/80 border-neutral-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên khách, nội dung đánh giá..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Chọn chi nhánh */}
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-neutral-400 shrink-0 hidden sm:inline" />
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">Tất cả chi nhánh ({reviews.length})</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lọc theo số sao */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1">
              Số sao:
            </span>
            <button
              type="button"
              onClick={() => setSelectedStar('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedStar === 'ALL'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              Tất cả ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((s) => {
              const count = reviews.filter((r) => Math.round(r.rating || 5) === s).length;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStar(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedStar === s
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>{s}</span>
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Nút xóa bộ lọc tìm kiếm khi có filter */}
        {searchQuery && (
          <div className="flex justify-end text-xs text-neutral-400 px-1">
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:underline"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          </div>
        )}

        {/* Danh sách các bài đánh giá */}
        {filteredReviews.length === 0 ? (
          <Card className="p-12 text-center bg-neutral-900/50 border-neutral-800 rounded-2xl">
            <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Không tìm thấy bài đánh giá nào</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Không có bài đánh giá nào phù hợp với bộ lọc hiện tại. Hãy thử chọn lại số sao hoặc chi nhánh khác.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((review) => {
              const branchName =
                review.branch?.name ||
                (branches.find((b) => b.id === review.branchId)?.name || 'Chi nhánh Lẩu Mắm');

              return (
                <Card
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  className="p-5 bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 rounded-2xl transition-all space-y-3.5 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Header bài viết: Tên tác giả + Tên chi nhánh + Số sao */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-amber-500/30">
                          {review.user?.avatarUrl ? (
                            <Image
                              src={review.user.avatarUrl}
                              alt={review.user?.fullName || 'Khách hàng'}
                              width={36}
                              height={36}
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            review.user?.fullName?.[0] || 'K'
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {review.user?.fullName || 'Thực khách'}
                          </h4>
                          <span className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Số sao đánh giá */}
                      <div className="flex items-center gap-0.5 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-400 font-bold text-xs shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{review.rating}</span>
                      </div>
                    </div>

                    {/* Huy hiệu chi nhánh */}
                    <div>
                      <Badge variant="warning" className="text-[10px] bg-neutral-950 border-neutral-800 text-amber-400/90 font-medium flex items-center gap-1 w-fit">
                        <Store className="w-3 h-3 text-amber-500" />
                        <span>{branchName}</span>
                      </Badge>
                    </div>

                    {/* Nội dung nhận xét */}
                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {review.content}
                    </p>

                    {/* Ảnh đính kèm (nếu có) */}
                    {review.mediaUrls && review.mediaUrls.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                        {review.mediaUrls.map((media: any, idx: number) => {
                          const url = typeof media === 'string' ? media : media.url;
                          return (
                            <div
                              key={idx}
                              onClick={() => setSelectedReview(review)}
                              className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              <Image
                                src={url}
                                alt="Ảnh món ăn"
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>


                </Card>
              );
            })}
          </div>
        )}

        {/* Modal xem chi tiết bài đánh giá */}
        {selectedReview && (
          <ReviewDetailModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
          />
        )}
      </main>
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 p-8 text-neutral-400 text-xs">Đang tải danh sách đánh giá...</div>}>
      <AdminReviewsContent />
    </Suspense>
  );
}
