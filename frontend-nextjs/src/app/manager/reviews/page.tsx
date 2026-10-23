/**
 * @file frontend-nextjs/src/app/manager/reviews/page.tsx
 * @description Màn hình dành cho Quản lý chi nhánh (Role 2) xem, phản hồi và XÓA bài đánh giá vi phạm.
 * @author Thanh Vien A (Task A3.2)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trash2, AlertTriangle, ShieldCheck, LogOut, RefreshCw, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IReview } from '@/lib/contracts';

export default function ManagerReviewsPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [branchInfo, setBranchInfo] = useState<{ id: string; name: string; avgRating: number; totalActiveReviews: number } | null>(null);
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string; branchId: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Trạng thái của Modal Xóa bài
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [deleteReason, setDeleteReason] = useState('Nội dung bình luận mang tính chất spam / phá hoại');
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Bước 1: Kiểm tra quyền đăng nhập khi vừa vào trang
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
        if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
          router.push('/login');
          return;
        }
        setCurrentUser(user);
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  // Bước 2: Tải danh sách đánh giá của chi nhánh này
  const loadBranchData = useCallback(async () => {
    const branchId = currentUser?.branchId || 'branch-q1-uuid-demo';
    setIsLoading(true);

    try {
      // 1. Lấy danh sách đánh giá
      const reviewsRes = await apiClient<{ data: IReview[]; pagination: { totalCount: number } }>('/reviews', {
        params: { branchId, limit: 50 },
      });
      setReviews(reviewsRes.data);

      // 2. Tính toán thống kê sơ bộ hiển thị trên thẻ tổng quan
      const count = reviewsRes.pagination.totalCount;
      const avg = count > 0 ? reviewsRes.data.reduce((sum, r) => sum + r.rating, 0) / count : 0;
      setBranchInfo({
        id: branchId,
        name: 'Lẩu Mắm Trăm Rưỡi - Chi nhánh Quận 1',
        avgRating: Math.round(avg * 10) / 10,
        totalActiveReviews: count,
      });
    } catch (err: any) {
      console.error('Lỗi tải dữ liệu chi nhánh:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadBranchData();
    }
  }, [currentUser, loadBranchData]);

  // Bước 3: Xác nhận XÓA bài đánh giá
  const handleConfirmDelete = async () => {
    if (!selectedReview) return;
    setIsDeleting(true);

    try {
      // Gọi API DELETE /reviews/:id sang NestJS Backend
      const res = await apiClient<{ message: string; newBranchStats: { avgRating: number; totalActiveReviews: number } }>(
        `/reviews/${selectedReview.id}`,
        {
          method: 'DELETE',
          body: JSON.stringify({ reason: deleteReason }),
        },
      );

      // 1. Ẩn bài viết vừa xóa khỏi danh sách ngay lập tức
      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));

      // 2. Cập nhật lại số sao trung bình trên đầu trang theo số liệu Backend vừa tính lại
      if (res.newBranchStats && branchInfo) {
        setBranchInfo({
          ...branchInfo,
          avgRating: res.newBranchStats.avgRating,
          totalActiveReviews: res.newBranchStats.totalActiveReviews,
        });
      }

      setNotification(`Đã xóa bài đánh giá và cập nhật lại điểm sao của quán!`);
      setSelectedReview(null);
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi xóa bài!');
    } finally {
      setIsDeleting(false);
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Thanh Header Quản Lý */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-md uppercase">
                Role 2: Quản Lý Chi Nhánh
              </span>
              <span className="text-xs text-stone-500">• {currentUser?.fullName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
              Quản Trị Đánh Giá Khách Hàng
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={loadBranchData}
              className="p-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl transition-all"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Thông báo nổi màu xanh khi vừa xóa bài thành công */}
        {notification && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center justify-between text-sm animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Thẻ Thống Kê Điểm Sao Chi Nhánh (Cập nhật thời gian thực) */}
        {branchInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-lg shadow-amber-500/20">
              <p className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Điểm sao trung bình</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold">{branchInfo.avgRating.toFixed(1)}</span>
                <span className="text-sm font-medium text-amber-100">/ 5.0 ⭐</span>
              </div>
              <p className="text-[11px] text-amber-100 mt-1">Tự động tính lại ngay khi xóa bài</p>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Tổng đánh giá hợp lệ</p>
              <p className="text-3xl font-extrabold text-stone-900 dark:text-white mt-2">
                {branchInfo.totalActiveReviews} <span className="text-sm font-normal text-stone-500">bài</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-1">Đang hiển thị trên ứng dụng khách</p>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Chi nhánh phụ trách</p>
              <p className="text-sm font-bold text-stone-900 dark:text-white mt-2 line-clamp-1">
                {branchInfo.name}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">● Đang hoạt động bình thường</p>
            </div>
          </div>
        )}

        {/* Bảng Danh Sách Bài Đánh Giá Của Quán */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-white">
              Danh sách đánh giá ({reviews.length})
            </h2>
            <span className="text-xs text-stone-400">Quản lý có quyền xóa bài vi phạm</span>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              Chi nhánh hiện chưa có bài đánh giá nào cần quản lý.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center uppercase">
                        {review.user?.fullName?.charAt(0) || 'K'}
                      </div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white">
                        {review.user?.fullName || 'Khách hàng'}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {new Date(review.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                      {review.content}
                    </p>

                    {review.mediaUrls && review.mediaUrls.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {review.mediaUrls.map((m, i) => (
                          <img key={i} src={m.url} alt="Ảnh" className="w-12 h-12 rounded-lg object-cover border" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nút bấm Xóa bài vi phạm */}
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 text-red-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all self-end sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa bài này</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Xác Nhận Xóa Bài Vi Phạm */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-stone-900 dark:text-white">
              Xác nhận xóa đánh giá?
            </h3>
            <p className="text-xs text-center text-stone-500 mt-1">
              Bài viết sẽ bị ẩn khỏi ứng dụng của khách và <strong className="text-amber-600">điểm sao của quán sẽ được tính lại ngay lập tức</strong>.
            </p>

            <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-xs text-stone-600 dark:text-stone-400">
              <p className="font-semibold text-stone-900 dark:text-white">Nội dung bài xóa:</p>
              <p className="italic mt-1 line-clamp-2">"{selectedReview.content}"</p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Lý do xóa (Lưu vào bằng chứng cho Admin):
              </label>
              <input
                type="text"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Ví dụ: Spam quảng cáo, xúc phạm nhân viên..."
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                disabled={isDeleting}
                className="py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Đang xóa...' : 'Đồng ý xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
