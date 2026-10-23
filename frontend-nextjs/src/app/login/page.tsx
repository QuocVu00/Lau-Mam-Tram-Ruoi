'use client';

/**
 * @file frontend-nextjs/src/app/login/page.tsx
 * @author Thành viên A (Task A1.2)
 * @description Trang đăng nhập dùng chung cho Quản lý chi nhánh (Role 2) và Super Admin (Role 3).
 * (Placeholder sẵn sàng để Thành viên A tích hợp JWT Auth Guard)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Shield, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'MANAGER' | 'ADMIN'>('ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock direct navigation for demo testing
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'ADMIN') {
        router.push('/admin/branches');
      } else {
        router.push('/manager/bookings');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>

        {/* Card Header */}
        <Card className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-950/50">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Đăng Nhập Quản Trị</h2>
            <p className="text-xs text-neutral-400">
              Dành riêng cho Quản lý Chi nhánh & Quản trị viên
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role switch */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setRole('MANAGER')}
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  role === 'MANAGER'
                    ? 'bg-amber-500 text-white shadow'
                    : 'text-neutral-400'
                }`}
              >
                Quản Lý Quán (Role 2)
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  role === 'ADMIN'
                    ? 'bg-amber-500 text-white shadow'
                    : 'text-neutral-400'
                }`}
              >
                Super Admin (Role 3)
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-amber-500" />
                <span>Email tài khoản</span>
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@laumam.vn"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-500" />
                <span>Mật khẩu</span>
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 text-xs font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang xác thực...
                </>
              ) : (
                'Vào Bảng Điều Khiển'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
