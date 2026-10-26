/**
 * @file frontend-nextjs/src/app/admin/logs/page.tsx
 * @description Màn hình dành cho Super Admin (Role 3) xem và xóa vĩnh viễn Lịch sử xóa đánh giá.
 * @author Thanh Vien A & B (Task A3.2 + Task B1.1)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, Trash2, Calendar, Store, User, X, RefreshCw, History } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IDeletionLog } from '@/lib/contracts';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

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
      console.warn('Lỗi tải lịch sử xóa:', err);
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

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row text-neutral-100">
      <AdminSidebar role="ADMIN" />

      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl">
        {/* Header Admin */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <History className="w-6 h-6 text-amber-500" />
              <span>Kiểm Soát Lịch Sử Xóa Đánh Giá</span>
            </h1>
          </div>
        </header>

        {/* Danh Sách Bản Ghi Lịch Sử Xóa */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Nhật ký xóa của toàn bộ chi nhánh ({logs.length})
            </h2>
          </div>

          {logs.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-sm">
              <Shield className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p>Hiện chưa có chi nhánh nào xóa bài đánh giá.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {logs.map((log) => {
                const snapshot = log.reviewSnapshot;
                return (
                  <div
                    key={log.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-850 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                          <Store className="w-3 h-3" />
                          {log.branch?.name || 'Chi nhánh'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
                          <User className="w-3 h-3 text-neutral-400" />
                          Quản lý xóa: <strong>{log.deletedByManager?.fullName}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300">
                        Lý do xóa: <span className="italic text-amber-200">"{snapshot?.deletionReason}"</span>
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400">
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
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(log.id)}
                        className="p-1.5 bg-red-950/50 hover:bg-red-900 border border-red-500/30 text-red-400 rounded-lg transition-all cursor-pointer"
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
      </main>

      {/* Modal Xem Lại Chi Tiết Bản Chụp Snapshot */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 rounded-2xl p-6 shadow-2xl border border-neutral-700 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                <span>Bản Chụp Snapshot Đánh Giá Gốc</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="p-1 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin khách hàng gốc */}
            <div className="p-3 bg-neutral-950 rounded-xl space-y-1 text-xs border border-neutral-800">
              <p><strong>Người đánh giá:</strong> {selectedLog.reviewSnapshot.authorName} ({selectedLog.reviewSnapshot.authorEmail})</p>
              <p><strong>Chi nhánh:</strong> {selectedLog.branch.name}</p>
              <p><strong>Điểm đã chấm:</strong> {selectedLog.reviewSnapshot.rating} / 5 ⭐</p>
              <p><strong>Ngày viết bài:</strong> {new Date(selectedLog.reviewSnapshot.originalCreatedAt).toLocaleString('vi-VN')}</p>
            </div>

            {/* Nội dung chữ gốc */}
            <div>
              <p className="text-xs font-semibold text-neutral-400 mb-1">Nội dung bài viết gốc:</p>
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-200 leading-relaxed italic">
                "{selectedLog.reviewSnapshot.content}"
              </div>
            </div>

            {/* Hình ảnh lúc bị xóa */}
            {selectedLog.reviewSnapshot.mediaUrls && selectedLog.reviewSnapshot.mediaUrls.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 mb-1.5">Hình ảnh đính kèm:</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedLog.reviewSnapshot.mediaUrls.map((m, i) => (
                    <img key={i} src={m.url} alt="Ảnh chụp" className="aspect-square rounded-xl object-cover border border-neutral-800" />
                  ))}
                </div>
              </div>
            )}

            {/* Lý do Quản lý xóa */}
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300">
              <strong>Lý do xóa bởi Quản lý ({selectedLog.deletedByManager.fullName}):</strong>
              <p className="mt-0.5">{selectedLog.reviewSnapshot.deletionReason}</p>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDelete(selectedLog.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
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
