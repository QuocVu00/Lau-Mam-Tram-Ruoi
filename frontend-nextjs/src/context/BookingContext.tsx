'use client';

import React, { createContext, useContext, useState } from 'react';

// Định nghĩa kiểu dữ liệu chi nhánh rút gọn cho việc đặt bàn
export interface SelectedBranch {
  id: string;
  name: string;
}

// Chi nhánh mặc định ban đầu nếu chưa kịp tải từ Backend
const DEFAULT_BRANCH: SelectedBranch = {
  id: 'branch-q1-uuid-demo',
  name: 'Lẩu Mắm Trăm Rưỡi - Chi nhánh Quận 1',
};

// Khai báo cấu trúc các giá trị mà BookingContext cung cấp cho toàn bộ ứng dụng
interface BookingContextType {
  // Hàm mở modal đặt món/bàn, có thể nhận loại (Ăn tại quán / Mang về) và chi nhánh cụ thể
  openBooking: (type?: 'BOOK_TABLE' | 'TAKEAWAY', branch?: SelectedBranch) => void;
  // Hàm đóng modal
  closeBooking: () => void;
  // Trạng thái modal đang mở hay đóng
  isOpen: boolean;
  // Loại đặt: ăn tại quán hay mang về
  bookingType: 'BOOK_TABLE' | 'TAKEAWAY';
  // Chi nhánh khách hàng đang chọn
  selectedBranch: SelectedBranch;
  // Hàm cập nhật chi nhánh đang chọn từ bất kỳ trang nào
  setSelectedBranch: (branch: SelectedBranch) => void;
}

// Tạo context với giá trị khởi tạo là undefined
const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  // Quản lý trạng thái đóng/mở Drawer đặt bàn
  const [isOpen, setIsOpen] = useState(false);
  // Quản lý hình thức: 'BOOK_TABLE' (Ăn tại quán) hoặc 'TAKEAWAY' (Mang về)
  const [bookingType, setBookingType] = useState<'BOOK_TABLE' | 'TAKEAWAY'>('TAKEAWAY');
  // Quản lý thông tin chi nhánh được chọn (mặc định lấy chi nhánh Q1)
  const [selectedBranch, setSelectedBranch] = useState<SelectedBranch>(DEFAULT_BRANCH);

  // Mở modal: nếu có truyền chi nhánh vào thì đồng thời cập nhật chi nhánh đó
  const openBooking = (type: 'BOOK_TABLE' | 'TAKEAWAY' = 'TAKEAWAY', branch?: SelectedBranch) => {
    setBookingType(type);
    if (branch) {
      setSelectedBranch(branch);
    }
    setIsOpen(true);
  };

  // Đóng modal
  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider
      value={{
        openBooking,
        closeBooking,
        isOpen,
        bookingType,
        selectedBranch,
        setSelectedBranch,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// Hook tiện ích để các component con sử dụng lại dữ liệu Context dễ dàng
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking phải được sử dụng bên trong BookingProvider');
  }
  return context;
}

