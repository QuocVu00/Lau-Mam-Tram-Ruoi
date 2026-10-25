/**
 * @file frontend-nextjs/src/components/branches/BranchWorkInspectorModal.tsx
 * @description Modal dành cho Super Admin (Role 3) khi bấm vào một chi nhánh:
 * Cho phép kiểm tra toàn diện công việc của chi nhánh đó, bao gồm:
 * 1. Các đơn mang về & đặt bàn đã hoàn thành / đang xử lý.
 * 2. Các bài đánh giá, điểm sao và phản hồi từ thực khách về chi nhánh.
 * 3. Quản lý nhân sự phụ trách chi nhánh.
 * @author Thành viên B (Task B1.3 - Mở rộng kiểm tra công việc)
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Store,
  Star,
  MapPin,
  Phone,
  ShoppingBag,
  Utensils,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BranchItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  avgRating: number;
  totalActiveReviews: number;
}

interface BookingOrder {
  id: string;
  branchId: string;
  customerName: string;
  zaloPhone: string;
  guestCount: number;
  type: 'BOOK_TABLE' | 'TAKEAWAY';
  details?: string;
  status: 'NEW' | 'CONFIRMED' | 'DONE';
  createdAt: string;
}

interface ReviewItem {
  id: string;
  branchId: string;
  rating: number;
  content: string;
  mediaUrls?: { url: string; type: 'IMAGE' | 'VIDEO' }[];
  isEdited?: boolean;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
}

interface ManagerUser {
  id: string;
  fullName: string;
  email: string;
  branchId: string;
}

interface BranchWorkInspectorModalProps {
  branch: BranchItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BranchWorkInspectorModal({
  branch,
  isOpen,
  onClose,
}: BranchWorkInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'REVIEWS' | 'STAFF'>('ORDERS');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'DONE' | 'CONFIRMED' | 'NEW'>('ALL');
  const [orders, setOrders] = useState<BookingOrder[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [managers, setManagers] = useState<ManagerUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Tải dữ liệu công việc của chi nhánh khi mở modal
  const loadBranchData = async () => {
    if (!branch?.id) return;
    setIsLoading(true);

    try {
      // 1. Tải các đơn đặt bàn & mang về của chi nhánh
      const ordersPromise = apiClient<BookingOrder[]>(`/bookings/branch/${branch.id}`).catch(() => []);

      // 2. Tải các đánh giá của chi nhánh
      const reviewsPromise = apiClient<{ data: ReviewItem[] }>(`/reviews?branchId=${branch.id}`).catch(() => ({ data: [] }));

      // 3. Tải danh sách nhân sự để tìm quản lý phụ trách chi nhánh
      const staffPromise = apiClient<ManagerUser[]>(`/users/managers`).catch(() => []);

      const [ordersRes, reviewsRes, staffRes] = await Promise.all([
        ordersPromise,
        reviewsPromise,
        staffPromise,
      ]);

      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setReviews(reviewsRes?.data || []);
      setManagers(Array.isArray(staffRes) ? staffRes.filter((m) => m.branchId === branch.id) : []);
    } catch (e) {
      console.warn('Lỗi tải dữ liệu kiểm tra chi nhánh:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && branch) {
      loadBranchData();
    }
  }, [isOpen, branch]);

  // Thống kê nhanh đơn hàng
  const stats = useMemo(() => {
    const takeawayOrders = orders.filter((o) => o.type === 'TAKEAWAY');
    const tableOrders = orders.filter((o) => o.type === 'BOOK_TABLE');
    const completedOrders = orders.filter((o) => o.status === 'DONE');
    const completedTakeaways = takeawayOrders.filter((o) => o.status === 'DONE');

    return {
      totalOrders: orders.length,
      totalTakeaways: takeawayOrders.length,
      completedTakeaways: completedTakeaways.length,
      totalTables: tableOrders.length,
      completedOrdersCount: completedOrders.length,
      completionRate: orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 100,
    };
  }, [orders]);

  // Lọc danh sách đơn hàng
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        
        {/* ============================================================== */}
        {/* MODAL HEADER: Thông Tin Chi Nhánh & Nút Đóng                    */}
        {/* ============================================================== */}
        <div className="p-5 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Thanh Tra & Kiểm Tra Công Việc
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Đang hoạt động
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 mt-1">
              <Store className="w-6 h-6 text-amber-500 shrink-0" />
              <span>{branch.name}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 pt-0.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{branch.address}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-400 font-semibold">{branch.phone}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadBranchData}
              disabled={isLoading}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* KPI DASHBOARD: Thẻ Tóm Tắt Nhanh Năng Lực Chi Nhánh            */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 bg-neutral-950/70 border-b border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Điểm sao */}
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Điểm Đánh Giá
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400">
                {(branch.avgRating || 5.0).toFixed(1)}
              </span>
              <span className="text-[11px] text-neutral-400">/ 5.0 ⭐</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-0.5">
              {reviews.length} lượt đánh giá thực
            </span>
          </div>

          {/* Card 2: Đơn mang về */}
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
              Đơn Mang Về (Zalo)
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">
                {stats.completedTakeaways}
              </span>
              <span className="text-[11px] text-neutral-400">/ {stats.totalTakeaways} đơn</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              ✓ Đã hoàn thành đóng gói
            </span>
          </div>

          {/* Card 3: Đặt bàn ăn tại quán */}
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              Đơn Bàn Tại Quán
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">
                {stats.totalTables}
              </span>
              <span className="text-[11px] text-neutral-400">bàn</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-0.5">
              Tỷ lệ hoàn thành: <strong className="text-amber-400">{stats.completionRate}%</strong>
            </span>
          </div>

          {/* Card 4: Quản lý phụ trách */}
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-400" />
              Quản Lý Phụ Trách
            </span>
            <div className="mt-1">
              {managers.length > 0 ? (
                <div>
                  <p className="font-extrabold text-sm text-white truncate">
                    {managers[0].fullName}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {managers[0].email}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-xs text-neutral-400 italic">Chưa gán quản lý</p>
                  <p className="text-[10px] text-amber-400 mt-0.5">Phụ trách trực tiếp</p>
                </div>
              )}
            </div>
            <span className="text-[10px] text-sky-400 font-semibold mt-0.5">
              Role 2: Quản lý chi nhánh
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TABS CHUYỂN ĐỔI (Hỗ trợ cuộn ngang mượt mà trên Mobile)         */}
        {/* ============================================================== */}
        <div className="px-4 sm:px-5 pt-3 border-b border-neutral-800 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'ORDERS'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đơn Mang Về & Đặt Bàn ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('REVIEWS')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'REVIEWS'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Đánh Giá Thực Khách ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('STAFF')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'STAFF'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Nhân Sự Quản Lý ({managers.length})</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* NỘI DUNG TỪNG TAB                                              */}
        {/* ============================================================== */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* ------------------------------------------------------------ */}
          {/* TAB 1: ĐƠN MANG VỀ & ĐẶT BÀN                                  */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-4">
              {/* Bộ lọc trạng thái đơn */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                  <button
                    onClick={() => setOrderFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === 'ALL'
                        ? 'bg-amber-500 text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Tất cả ({orders.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('DONE')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === 'DONE'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Đã Hoàn Thành ({orders.filter((o) => o.status === 'DONE').length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('CONFIRMED')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === 'CONFIRMED'
                        ? 'bg-sky-600 text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Đã Xác Nhận ({orders.filter((o) => o.status === 'CONFIRMED').length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('NEW')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === 'NEW'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Mới ({orders.filter((o) => o.status === 'NEW').length})
                  </button>
                </div>

                <span className="text-xs text-neutral-400">
                  Hiển thị {filteredOrders.length} đơn của chi nhánh
                </span>
              </div>

              {/* Danh sách đơn hàng */}
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 space-y-2 rounded-2xl border border-dashed border-neutral-800">
                  <ShoppingBag className="w-10 h-10 text-neutral-700 mx-auto" />
                  <p className="text-sm font-semibold text-neutral-300">
                    Chưa có đơn hàng nào ở trạng thái này.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Khách đặt món qua trang chủ sẽ tự động cập nhật vào đây.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const isTakeaway = order.type === 'TAKEAWAY';
                    const isDone = order.status === 'DONE';

                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-800/80">
                          <div className="flex items-center gap-2">
                            {isTakeaway ? (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-orange-950/60 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>ĐẶT MANG VỀ (ZALO)</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                                <Utensils className="w-3.5 h-3.5" />
                                <span>ĐẶT BÀN TẠI QUÁN</span>
                              </span>
                            )}

                            {isDone ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>ĐÃ HOÀN THÀNH</span>
                              </span>
                            ) : order.status === 'CONFIRMED' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-950/60 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>ĐÃ XÁC NHẬN</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>ĐƠN MỚI</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                          </div>
                        </div>

                        {/* Chi tiết khách hàng và món ăn */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="text-[11px] text-neutral-400">Khách Hàng:</span>
                            <p className="font-bold text-white text-sm">{order.customerName}</p>
                            <p className="text-amber-400 font-semibold flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{order.zaloPhone}</span>
                            </p>
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <span className="text-[11px] text-neutral-400">
                              {isTakeaway ? 'Món ăn khách đã chọn:' : 'Yêu cầu đặt bàn:'}
                            </span>
                            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 text-neutral-200 text-xs leading-relaxed font-mono">
                              {order.details || 'Không có ghi chú thêm'}
                            </div>
                            <p className="text-[11px] text-neutral-400">
                              Số lượng: <strong className="text-white">{order.guestCount} suất/người</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 2: ĐÁNH GIÁ THỰC KHÁCH                                    */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-white">
                  Danh sách bài nhận xét từ thực khách ({reviews.length})
                </span>
                <span>Phản hồi chân thực của khách sau khi ăn</span>
              </div>

              {reviews.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 space-y-2 rounded-2xl border border-dashed border-neutral-800">
                  <Star className="w-10 h-10 text-neutral-700 mx-auto" />
                  <p className="text-sm font-semibold text-neutral-300">
                    Chi nhánh hiện chưa có bài đánh giá nào.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Thực khách sau khi trải nghiệm có thể gửi bài đánh giá kèm hình ảnh.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                            {rev.user?.fullName?.charAt(0) || 'K'}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">
                              {rev.user?.fullName || 'Thực khách'}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-neutral-400">•</span>
                              <span className="text-[10px] text-neutral-400">
                                {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {rev.isEdited && (
                          <span className="text-[10px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Đã sửa bài
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                        {rev.content}
                      </p>

                      {/* Hình ảnh đính kèm */}
                      {rev.mediaUrls && rev.mediaUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {rev.mediaUrls.map((m, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-black group"
                            >
                              <img
                                src={m.url}
                                alt="Ảnh món ăn"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 3: NHÂN SỰ PHỤ TRÁCH                                      */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'STAFF' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-white">
                  Danh sách Quản lý được giao quyền phụ trách chi nhánh này
                </span>
              </div>

              {managers.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 space-y-2 rounded-2xl border border-dashed border-neutral-800">
                  <User className="w-10 h-10 text-neutral-700 mx-auto" />
                  <p className="text-sm font-semibold text-neutral-300">
                    Chưa có nhân sự Quản lý nào được phân công cho chi nhánh này.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Bạn có thể sang trang "Quản lý nhân sự" để cấp tài khoản Quản lý cho chi nhánh.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {managers.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                          {m.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{m.fullName}</p>
                          <p className="text-xs text-neutral-400">{m.email}</p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-xl bg-sky-950/60 text-sky-400 border border-sky-500/30 text-xs font-bold">
                        Quản Lý Chi Nhánh (Role 2)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <span>Hệ thống kiểm soát nội bộ chuỗi Lẩu Mắm Trăm Rưỡi</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Đóng bảng kiểm tra
          </Button>
        </div>
      </div>
    </div>
  );
}
