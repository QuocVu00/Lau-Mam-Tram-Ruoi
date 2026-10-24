'use client';

/**
 * @author Thành viên B (Task B1.3)
 * @description Modal tạo mới / chỉnh sửa thông tin Chi nhánh dành cho Admin (Role 3).
 */

import React, { useState } from 'react';
import { X, Store, MapPin, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';

interface AdminBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminBranchModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminBranchModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiClient('/branches', {
        method: 'POST',
        body: JSON.stringify({ name, address, phone }),
      });

      setName('');
      setAddress('');
      setPhone('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra khi tạo chi nhánh');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Thêm Chi Nhánh Mới</h3>
              <p className="text-xs text-neutral-400">Mở rộng chuỗi Lẩu Mắm Trăm Rưỡi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-amber-500" />
              <span>Tên chi nhánh *</span>
            </label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Chi nhánh Quận 1 - Nguyễn Trãi"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <span>Địa chỉ quán *</span>
            </label>
            <Input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: 150 Nguyễn Trãi, Phường Bến Thành, Quận 1"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-amber-500" />
              <span>Số điện thoại Hotline *</span>
            </label>
            <Input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0909 150 150"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Đang tạo...
                </>
              ) : (
                'Tạo Chi Nhánh'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
