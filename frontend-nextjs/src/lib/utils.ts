/**
 * @file frontend-nextjs/src/lib/utils.ts
 * @description Hàm tiện ích gộp các class Tailwind CSS linh hoạt.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Thời hạn phiên đăng nhập khách: 20 ngày tính bằng mili-giây
const TWENTY_DAYS_MS = 20 * 24 * 60 * 60 * 1000;

/**
 * Tự động tạo danh tính khách hàng dạng: "Khách Hàng xxxx" (Ví dụ: Khách Hàng 8933).
 * Lưu phiên trên thiết bị tối đa 20 ngày. Sau 20 ngày tự động hủy phiên và cấp tên mới,
 * trong khi toàn bộ đánh giá cũ vẫn được lưu giữ vĩnh viễn trên cơ sở dữ liệu.
 */
export function getOrSetAutoCustomerIdentity(): { fullName: string; email: string } {
  if (typeof window === 'undefined') {
    return { fullName: 'Khách Hàng 1001', email: 'khach.1001@laumam.vn' };
  }

  const savedUserStr = localStorage.getItem('user_info');
  const sessionCreatedAtStr = localStorage.getItem('customer_session_created_at');

  const now = Date.now();

  // Kiểm tra phiên đăng nhập cũ còn trong thời hạn 20 ngày hay không
  if (savedUserStr && sessionCreatedAtStr) {
    const sessionCreatedAt = Number(sessionCreatedAtStr);
    const isExpired = now - sessionCreatedAt > TWENTY_DAYS_MS;

    if (!isExpired) {
      try {
        const parsed = JSON.parse(savedUserStr);
        // Nếu tên cũ đã có dạng chuẩn Khách Hàng xxxx thì giữ nguyên
        if (parsed.fullName && parsed.fullName.startsWith('Khách Hàng ') && parsed.email) {
          return { fullName: parsed.fullName, email: parsed.email };
        }
      } catch {}
    } else {
      // Đã quá 20 ngày -> Xóa phiên đăng nhập cũ trên máy để cấp phiên mới
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('customer_session_created_at');
    }
  }

  // Sinh 4 chữ số ngẫu nhiên độc nhất (Ví dụ: 8933, 4125...)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  // Định dạng chuẩn: Khách Hàng xxxx
  const finalName = `Khách Hàng ${randomSuffix}`;
  const finalEmail = `khach.${randomSuffix}@laumam.vn`;

  // Lưu phiên mới và đánh dấu thời điểm tạo để tính hạn 20 ngày
  const newCustomer = {
    id: `auto-${randomSuffix}`,
    fullName: finalName,
    email: finalEmail,
    role: 'CUSTOMER',
  };

  localStorage.setItem('user_info', JSON.stringify(newCustomer));
  localStorage.setItem('customer_session_created_at', String(now));

  return { fullName: finalName, email: finalEmail };
}

