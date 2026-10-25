'use client';

/**
 * @file frontend-nextjs/src/app/admin/staff/page.tsx
 * @author Thành viên B (Task B2.2)
 * @description Trang Quản trị Nhân sự (Role 2):
 * Cho phép Super Admin (Role 3) xem danh sách tài khoản Quản lý,
 * cấp tài khoản mới và gán cố định vào một Chi nhánh, hoặc xóa tài khoản.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Trash2, Mail, Store, ShieldAlert, CheckCircle, X, Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';

interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  branchId: string;
  branch?: { name: string };
  createdAt: string;
}

interface BranchItem {
  id: string;
  name: string;
}

export default function AdminStaffPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<StaffUser[]>([
    {
      id: 'usr-m1',
      fullName: 'Trần Văn Quản Lý (Q1)',
      email: 'quanly.q1@laumam.vn',
      role: 'MANAGER',
      branchId: 'b1-default',
      branch: { name: 'Lẩu Mắm Trăm Rưỡi - Quận 1' },
      createdAt: '2026-10-20',
    },
    {
      id: 'usr-m2',
      fullName: 'Lê Thị Thuỷ (Bình Thạnh)',
      email: 'quanly.bt@laumam.vn',
      role: 'MANAGER',
      branchId: 'b2-default',
      branch: { name: 'Lẩu Mắm Trăm Rưỡi - Bình Thạnh' },
      createdAt: '2026-10-21',
    },
  ]);

  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBranches = async () => {
    try {
      const data = await apiClient<BranchItem[]>('/branches');
      if (Array.isArray(data) && data.length > 0) {
        setBranches(data);
        setSelectedBranchId(data[0].id);
      }
    } catch (e) {
      console.warn('Lỗi lấy danh sách chi nhánh:', e);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await apiClient<StaffUser[]>('/users/managers');
      if (Array.isArray(data)) {
        setStaffList(data);
      }
    } catch (e: any) {
      console.warn('Lỗi lấy danh sách quản lý:', e);
    }
  };

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
    fetchBranches();
    fetchStaff();
  }, [router]);

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newManager = await apiClient<StaffUser>('/users/managers', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email,
          password,
          branchId: selectedBranchId,
        }),
      });

      setStaffList((prev) => [newManager, ...prev]);
      alert(`Đã cấp thành công tài khoản Quản lý cho: ${email}`);
      setFullName('');
      setEmail('');
      setPassword('');
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo tài khoản quản lý! Hãy chắc chắn bạn đã đăng nhập tài khoản Admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản Quản lý này?')) return;
    try {
      await apiClient(`/users/managers/${id}`, { method: 'DELETE' });
      setStaffList((prev) => prev.filter((item) => item.id !== id));
      alert('Đã xóa tài khoản Quản lý khỏi hệ thống.');
    } catch (e: any) {
      alert(e.message || 'Lỗi khi xóa tài khoản!');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row">
      <AdminSidebar role="ADMIN" />

      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <Users className="h-6 w-6 text-amber-500" />
              <span>Quản Lý Tài Khoản Quản Lý (Role 2)</span>
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Phân công tài khoản Quản lý phụ trách từng chi nhánh cụ thể
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Cấp Tài Khoản Quản Lý Mới</span>
          </Button>
        </div>

        {/* Staff Table */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 font-semibold border-b border-neutral-800">
                <tr>
                  <th className="p-4">Họ và tên</th>
                  <th className="p-4">Email đăng nhập</th>
                  <th className="p-4">Chi nhánh phân công</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
                        {staff.fullName.charAt(0)}
                      </div>
                      <span>{staff.fullName}</span>
                    </td>
                    <td className="p-4 text-neutral-300">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-neutral-500" />
                        {staff.email}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-200">
                      <span className="flex items-center gap-1.5 font-medium text-amber-400">
                        <Store className="h-3.5 w-3.5 text-amber-500" />
                        {staff.branch?.name || staff.branchId}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="warning">MANAGER</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Cấp Tài Khoản */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                <span>Cấp Tài Khoản Quản Lý Mới</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManager} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Họ và tên *</label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Bình"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Email đăng nhập *</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager.q1@laumam.vn"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Mật khẩu khởi tạo *</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Phân công vào Chi nhánh *
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
