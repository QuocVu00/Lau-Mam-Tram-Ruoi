import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lẩu Mắm Trăm Rưỡi - Đánh Giá & Đặt Bàn Đa Chi Nhánh',
  description: 'Hệ thống chuỗi nhà hàng Lẩu Mắm Trăm Rưỡi - Xem đánh giá thực tế và đặt bàn, mua mang về nhanh chóng.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-neutral-900 text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
