/**
 * @file frontend-nextjs/src/app/admin/logs/page.tsx
 * @description Màn hình dành cho Super Admin (Role 3) xem và xóa vĩnh viễn Lịch sử xóa đánh giá.
 * @author Thanh Vien A (Task A3.2)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, Trash2, Calendar, Store, User, X, LogOut, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IDeletionLog } from '@/lib/contracts';

export default function AdminLogsPage() {
  const router = useRouter();

  const [logs, setLogs] = useState<IDeletionLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<IDeletionLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string } | null>(null);

  // Bước 1: Kiểm tra quyền Super Admin khi vào trang
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
          alert('Chỉ Super Admin mới có quyền truy cập trang này!');
          router.push('/login');
          return;
        }
        setCurrentUser(user);
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  // Bước 2: Tải danh sách lịch sử xóa từ Backend
  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<{ data: IDeletionLog[] }>('/deletion-logs', {
        params: { page: 1, limit: 50 },
      });
      setLogs(res.data);
    } catch (err: any) {
      console.error('Lỗi tải lịch sử xóa:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadLogs();
    }
  }, [currentUser, loadLogs]);

  // Bước 3: Admin thực hiện đặc quyền "Xóa vĩnh viễn"
  const handlePermanentDelete = async (logId: string) => {
    if (!confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN bản ghi lịch sử này khỏi hệ thống không?')) {
      return;
    }

    try {
      await apiClient(`/deletion-logs/${logId}`, {
        method: 'DELETE',
      });

      // Loại bỏ khỏi danh sách trên giao diện
      setLogs((prev) => prev.filter((l) => l.id !== logId));
      if (selectedLog?.id === logId) {
        setSelectedLog(null);
      }
      alert('Đã xóa vĩnh viễn bản ghi khỏi hệ thống!');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bản ghi!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Admin */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold rounded-md uppercase">
                Role 3: Super Admin
              </span>
              <span className="text-xs text-stone-500">• {currentUser?.fullName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1">
              Kiểm Soát Lịch Sử Xóa Đánh Giá
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={loadLogs}
              className="p-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl transition-all"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Danh Sách Bản Ghi Lịch Sử Xóa */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-white">
              Nhật ký xóa của toàn bộ chi nhánh ({logs.length})
            </h2>
            <span className="text-xs text-stone-400">Bấm vào từng dòng để xem lại chứng cứ gốc</span>
          </div>

          {logs.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-sm">
              <Shield className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
              <p>Hiện chưa có chi nhánh nào xóa bài đánh giá.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {logs.map((log) => {
                const snapshot = log.reviewSnapshot;
                return (
                  <div
                    key={log.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-800/60 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-200/50">
                          <Store className="w-3 h-3" />
                          {log.branch?.name || 'Chi nhánh'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400">
                          <User className="w-3 h-3" />
                          Quản lý xóa: <strong>{log.deletedByManager?.fullName}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-stone-500">
                        Lý do xóa: <span className="italic text-stone-700 dark:text-stone-300">"{snapshot?.deletionReason}"</span>
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(log.deletedAt).toLocaleString('vi-VN')}
                        </span>
                        <span>• Đánh giá lúc xóa: {snapshot?.rating} ⭐</span>
                      </div>
                    </div>

                    {/* Nút tác vụ của Admin */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(log.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Xem Lại Chi Tiết Bản Chụp Snapshot */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span>Bản Chụp Snapshot Đánh Giá Gốc</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin khách hàng gốc */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl space-y-1 text-xs">
              <p><strong>Người đánh giá:</strong> {selectedLog.reviewSnapshot.authorName} ({selectedLog.reviewSnapshot.authorEmail})</p>
              <p><strong>Chi nhánh:</strong> {selectedLog.branch.name}</p>
              <p><strong>Điểm đã chấm:</strong> {selectedLog.reviewSnapshot.rating} / 5 ⭐</p>
              <p><strong>Ngày viết bài:</strong> {new Date(selectedLog.reviewSnapshot.originalCreatedAt).toLocaleString('vi-VN')}</p>
            </div>

            {/* Nội dung chữ gốc */}
            <div>
              <p className="text-xs font-semibold text-stone-500 mb-1">Nội dung bài viết gốc:</p>
              <div className="p-3.5 bg-amber-50/50 dark:bg-stone-800 border border-amber-200/40 rounded-xl text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed italic">
                "{selectedLog.reviewSnapshot.content}"
              </div>
            </div>

            {/* Hình ảnh lúc bị xóa */}
            {selectedLog.reviewSnapshot.mediaUrls && selectedLog.reviewSnapshot.mediaUrls.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-stone-500 mb-1.5">Hình ảnh đính kèm:</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedLog.reviewSnapshot.mediaUrls.map((m, i) => (
                    <img key={i} src={m.url} alt="Ảnh chụp" className="aspect-square rounded-xl object-cover border" />
                  ))}
                </div>
              </div>
            )}

            {/* Lý do Quản lý xóa */}
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200/50 rounded-xl text-xs text-red-700 dark:text-red-400">
              <strong>Lý do xóa bởi Quản lý ({selectedLog.deletedByManager.fullName}):</strong>
              <p className="mt-0.5">{selectedLog.reviewSnapshot.deletionReason}</p>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDelete(selectedLog.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa vĩnh viễn lịch sử này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
