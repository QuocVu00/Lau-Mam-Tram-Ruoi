'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển hướng an toàn về trang đăng nhập
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-400 text-xs">
      Đang chuyển hướng đến cổng quản trị...
    </div>
  );
}
