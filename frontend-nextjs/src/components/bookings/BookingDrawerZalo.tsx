'use client';

/**
 * @author Thành viên B (Task B3.2)
 * @description Drawer trượt từ dưới lên (Bottom Sheet) chuẩn Mobile-First cho Khách hàng
 * hỗ trợ 2 chế độ:
 * 1. Ăn Tại Quán (BOOK_TABLE): Chọn số khách, ngày giờ, bàn.
 * 2. Mua Mang Về (TAKEAWAY): Xem 2 ảnh Menu đặc sản sắc nét (có phóng to Lightbox),
 *    chọn trực tiếp món ăn & số lượng từ Menu, tự tính tổng tiền và gửi chi tiết món
 *    đến Quản lý chi nhánh qua API & Socket.io Realtime.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  CalendarDays,
  Utensils,
  Users,
  Phone,
  User,
  FileText,
  CheckCircle2,
  Loader2,
  ZoomIn,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: 'HOTPOT' | 'SIDE' | 'DRINK';
  description?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // Set Lẩu Đặc Sản
  {
    id: 'm1',
    name: 'Set Lẩu 1 Người',
    price: 150000,
    unit: 'nồi',
    category: 'HOTPOT',
    description: 'Nước lẩu mắm, bún tươi, rau sống 12 vị, 1 ly trà đá',
  },
  {
    id: 'm2',
    name: 'Set Đặc Biệt (2-3 người)',
    price: 299000,
    unit: 'set',
    category: 'HOTPOT',
    description: 'Lẩu mắm lớn, tôm càng, cá bông lau, mực, ba rọi heo, mẹt rau bún',
  },
  {
    id: 'm3',
    name: 'Set Đại Tiệc (3-4 người)',
    price: 499000,
    unit: 'set',
    category: 'HOTPOT',
    description: 'Lẩu mắm siêu to, hải sản tươi sống, ba rọi dày dặn, rau đồng ngập tràn',
  },

  // Món Nhúng Thêm
  {
    id: 'm4',
    name: 'Đĩa Hải Sản Thêm (Tôm, Mực, Cá)',
    price: 89000,
    unit: 'đĩa',
    category: 'SIDE',
    description: 'Tôm tươi, mực ống giòn, cá bông lau béo ngậy',
  },
  {
    id: 'm5',
    name: 'Đĩa Ba Rọi Heo (200g)',
    price: 45000,
    unit: 'đĩa',
    category: 'SIDE',
    description: 'Thịt ba rọi thái lát mỏng vừa ăn',
  },
  {
    id: 'm6',
    name: 'Mẹt Rau Đồng Thêm (12 loại rau)',
    price: 35000,
    unit: 'mẹt',
    category: 'SIDE',
    description: 'Bông điên điển, bông súng, rau đắng, rau nhút, bắp chuối...',
  },
  {
    id: 'm7',
    name: 'Đĩa Bún Tươi (Sợi nhỏ)',
    price: 15000,
    unit: 'đĩa',
    category: 'SIDE',
    description: 'Bún tươi sợi nhỏ tráng mịn',
  },

  // Nước Giải Khát
  {
    id: 'm8',
    name: 'Trà Tắc Hạt Chia',
    price: 20000,
    unit: 'ly',
    category: 'DRINK',
    description: 'Chua thanh mát lạnh, giải ngấy lẩu cực đã',
  },
  {
    id: 'm9',
    name: 'Nước Sâm Mía Lau Rong Biển',
    price: 18000,
    unit: 'ly',
    category: 'DRINK',
    description: 'Nấu thảo mộc tự nhiên, thanh nhiệt cơ thể',
  },
  {
    id: 'm10',
    name: 'Nước Dừa Tươi Bến Tre',
    price: 25000,
    unit: 'trái',
    category: 'DRINK',
    description: 'Dừa xiêm ngọt thanh mát lành',
  },
];

interface BookingDrawerZaloProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  branchName: string;
  initialType?: 'BOOK_TABLE' | 'TAKEAWAY';
}

export function BookingDrawerZalo({
  isOpen,
  onClose,
  branchId,
  branchName,
  initialType = 'TAKEAWAY',
}: BookingDrawerZaloProps) {
  const [type, setType] = useState<'BOOK_TABLE' | 'TAKEAWAY'>(initialType);
  const [customerName, setCustomerName] = useState('');
  const [zaloPhone, setZaloPhone] = useState('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [userNote, setUserNote] = useState('');

  // Quản lý giỏ món chọn mang về: { [itemId]: quantity }
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({
    m2: 1, // Mặc định gợi ý Set Đặc Biệt 299k
  });

  // Modal Lightbox phóng to xem ảnh Menu chi tiết
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedDetails, setSubmittedDetails] = useState('');

  if (!isOpen) return null;

  // Tính tổng số lượng món và tổng tiền
  const totalItemCount = Object.values(selectedItems).reduce((sum, q) => sum + q, 0);
  const totalPrice = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Thao tác tăng giảm số lượng món
  const handleItemQuantityChange = (id: string, delta: number) => {
    setSelectedItems((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const updated = { ...prev };
      if (newQty === 0) {
        delete updated[id];
      } else {
        updated[id] = newQty;
      }
      return updated;
    });
  };

  // Đóng gói danh sách món thành chuỗi chi tiết gửi đi
  const formatOrderDetails = () => {
    if (type === 'BOOK_TABLE') {
      return userNote.trim() || 'Khách đặt bàn ăn tại quán';
    }

    const itemLines = Object.entries(selectedItems)
      .map(([id, qty]) => {
        const item = MENU_ITEMS.find((m) => m.id === id);
        if (!item) return null;
        return `• ${qty}x ${item.name} (${(item.price * qty).toLocaleString('vi-VN')}đ)`;
      })
      .filter(Boolean)
      .join('\n');

    let fullDetails = `[ĐƠN MANG VỀ ĐÃ CHỌN MÓN]\n${itemLines || '• (Chưa chọn món cụ thể, liên hệ Zalo)'}\n=> TỔNG TẠM TÍNH: ${totalPrice.toLocaleString('vi-VN')}đ`;

    if (userNote.trim()) {
      fullDetails += `\n* Ghi chú khách: ${userNote.trim()}`;
    }

    return fullDetails;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formattedDetails = formatOrderDetails();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          customerName,
          zaloPhone,
          guestCount: type === 'BOOK_TABLE' ? Number(guestCount) : totalItemCount || 1,
          type,
          details: formattedDetails,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể gửi yêu cầu đặt món');
      }

      setSubmittedDetails(formattedDetails);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCustomerName('');
    setZaloPhone('');
    setUserNote('');
    setSelectedItems({ m2: 1 });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-lg rounded-t-3xl border-t border-neutral-800 bg-neutral-900 p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[94vh] overflow-y-auto">
          {/* Drawer Handle */}
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-3" />

          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                {type === 'TAKEAWAY' ? (
                  <ShoppingBag className="h-5 w-5 text-amber-500" />
                ) : (
                  <CalendarDays className="h-5 w-5 text-amber-500" />
                )}
                <span>{type === 'TAKEAWAY' ? 'Đặt Mang Về Chọn Món' : 'Đặt Bàn Ăn Tại Quán'}</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Chi nhánh: <span className="text-amber-400 font-medium">{branchName}</span>
              </p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isSuccess ? (
            /* =================== MÀN HÌNH THÀNH CÔNG =================== */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Đã Gửi Đơn Thành Công Đến Quản Lý!
                </h4>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto mt-1 leading-relaxed">
                  Màn hình Quản lý chi nhánh <span className="text-amber-400">{branchName}</span> vừa nhận được tín hiệu chuông <span className="font-bold text-amber-400">"Ting"</span> và đang chuẩn bị đơn cho bạn.
                </p>
              </div>

              {/* Tóm tắt đơn mang về */}
              {type === 'TAKEAWAY' && (
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-400 border-b border-neutral-800 pb-1.5">
                    <span>Món đã chọn ({totalItemCount} phần):</span>
                    <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <pre className="text-neutral-300 text-[11px] font-sans whitespace-pre-wrap leading-relaxed">
                    {submittedDetails}
                  </pre>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://zalo.me/${zaloPhone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40"
                >
                  <Phone className="h-4 w-4" />
                  <span>Mở Zalo Xác Nhận Ngay ({zaloPhone})</span>
                </a>
                <Button variant="ghost" onClick={handleResetAndClose}>
                  Đóng cửa sổ
                </Button>
              </div>
            </div>
          ) : (
            /* =================== FORM ĐẶT MÓN & CHỌN MENU =================== */
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-300">
                  {error}
                </div>
              )}

              {/* Chuyển đổi tab: Ăn tại quán vs Mang về */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-2xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setType('TAKEAWAY')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer',
                    type === 'TAKEAWAY'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200',
                  )}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Mua Mang Về</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('BOOK_TABLE')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer',
                    type === 'BOOK_TABLE'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200',
                  )}
                >
                  <Utensils className="h-4 w-4" />
                  <span>Ăn Tại Quán</span>
                </button>
              </div>

              {/* =======================================================
                  KHU VỰC 2 ẢNH MENU ĐỂ KHÁCH CHỌN MÓN (CHẾ ĐỘ MANG VỀ)
                  ======================================================= */}
              {type === 'TAKEAWAY' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>Xem Menu & Chọn Món Nhanh (Chạm để phóng to)</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">2 Bảng Menu</span>
                  </div>

                  {/* Lưới 2 ảnh Menu */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Ảnh Menu 1: Set Lẩu & Hải Sản */}
                    <div
                      onClick={() => setPreviewImage('/images/menu1.jpg')}
                      className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer hover:border-amber-500/80 transition-all shadow-md"
                    >
                      <div className="relative aspect-[3/4] w-full">
                        <Image
                          src="/images/menu1.jpg"
                          alt="Menu Set Lẩu Mắm Trăm Rưỡi"
                          fill
                          sizes="(max-width: 768px) 50vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-90 group-hover:opacity-75 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                          <span className="text-[11px] font-extrabold truncate">
                            Menu 1: Set Lẩu & Hải Sản
                          </span>
                          <ZoomIn className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        </div>
                      </div>
                    </div>

                    {/* Ảnh Menu 2: Rau Rừng & Đồ Uống */}
                    <div
                      onClick={() => setPreviewImage('/images/menu2.jpg')}
                      className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer hover:border-amber-500/80 transition-all shadow-md"
                    >
                      <div className="relative aspect-[3/4] w-full">
                        <Image
                          src="/images/menu2.jpg"
                          alt="Menu Rau Đồng & Nước Giải Khát"
                          fill
                          sizes="(max-width: 768px) 50vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-90 group-hover:opacity-75 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                          <span className="text-[11px] font-extrabold truncate">
                            Menu 2: Rau Rừng & Đồ Uống
                          </span>
                          <ZoomIn className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách chọn món trực tiếp từ Menu (Interactive Item Selector) */}
                  <div className="space-y-2 mt-2">
                    <p className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1">
                      <Utensils className="h-3.5 w-3.5 text-amber-500" />
                      <span>Chọn số lượng từng món mang về:</span>
                    </p>

                    <div className="divide-y divide-neutral-800/80 rounded-2xl border border-neutral-800 bg-neutral-950/60 max-h-56 overflow-y-auto px-3">
                      {MENU_ITEMS.map((item) => {
                        const qty = selectedItems[item.id] || 0;
                        return (
                          <div
                            key={item.id}
                            className="py-2.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white truncate">
                                  {item.name}
                                </span>
                                {item.category === 'HOTPOT' && (
                                  <Badge variant="warning" className="text-[9px] py-0 px-1">
                                    Set Lẩu
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[10px] text-amber-400 font-medium">
                                {item.price.toLocaleString('vi-VN')}đ / {item.unit}
                              </p>
                              {item.description && (
                                <p className="text-[10px] text-neutral-400 truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Bộ nút tăng / giảm số lượng */}
                            <div className="flex items-center gap-2 shrink-0 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => handleItemQuantityChange(item.id, -1)}
                                disabled={qty === 0}
                                className="h-6 w-6 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center font-extrabold text-xs text-white">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleItemQuantityChange(item.id, 1)}
                                className="h-6 w-6 rounded-lg bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center cursor-pointer shadow-sm"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Hộp tổng kết tạm tính */}
                    <div className="p-3 rounded-xl bg-neutral-950 border border-amber-500/40 flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">
                        Đã chọn: <span className="font-bold text-white">{totalItemCount} món</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">Tạm tính:</span>
                        <span className="font-extrabold text-sm text-amber-400">
                          {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thông tin khách hàng */}
              <div className="space-y-3 pt-1">
                {/* Họ tên */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-amber-500" />
                    <span>Họ và Tên người đặt *</span>
                  </label>
                  <Input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Anh Quốc Tuấn"
                  />
                </div>

                {/* SĐT Zalo */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-amber-500" />
                    <span>Số điện thoại dùng Zalo (để nhận xác nhận) *</span>
                  </label>
                  <Input
                    required
                    type="tel"
                    value={zaloPhone}
                    onChange={(e) => setZaloPhone(e.target.value)}
                    placeholder="VD: 0912 345 678"
                  />
                </div>

                {/* Số khách nếu là BOOK_TABLE */}
                {type === 'BOOK_TABLE' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-amber-500" />
                      <span>Số lượng khách dự kiến *</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[2, 4, 6, 8, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestCount(num)}
                          className={cn(
                            'flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer',
                            guestCount === num
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:border-neutral-600',
                          )}
                        >
                          {num} người
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ghi chú thêm */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-amber-500" />
                    <span>Ghi chú thêm về khẩu vị / giờ lấy</span>
                  </label>
                  <Input
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder={
                      type === 'TAKEAWAY'
                        ? 'VD: Lấy lúc 18h30, không ăn cay, lấy thêm nước chấm...'
                        : 'VD: Cần bàn gần cửa sổ, ăn cay ít...'
                    }
                  />
                </div>
              </div>

              {/* Nút gửi đơn hàng */}
              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-sm font-bold mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang gửi món đến Quản lý...
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>
                      {type === 'TAKEAWAY'
                        ? `Gửi Đơn Mang Về Cho Quán (${totalPrice > 0 ? totalPrice.toLocaleString('vi-VN') + 'đ' : 'Chọn món'})`
                        : 'Xác Nhận Đặt Bàn Tại Quán'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* =======================================================
          MODAL LIGHTBOX PHÓNG TO ẢNH MENU ĐỂ KHÁCH ĐỌC RÕ CHỮ
          ======================================================= */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-11 right-0 p-2 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl">
              <Image
                src={previewImage}
                alt="Phóng to Menu Lẩu Mắm Trăm Rưỡi"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <p className="text-xs text-neutral-400 mt-2 text-center flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-amber-500" />
              <span>Chạm bất kỳ đâu để đóng lại và chọn món</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
