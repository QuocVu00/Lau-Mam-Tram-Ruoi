/**
 * @file shared/contracts.ts
 * @description Tệp hợp đồng dữ liệu dùng chung giữa Thành viên A và Thành viên B,
 * cũng như dùng chung giữa Backend (NestJS) và Frontend (Next.js).
 */

// ============================================================================
// 1. CHUẨN DỮ LIỆU BÊN TRONG TOKEN ĐĂNG NHẬP (JWT PAYLOAD)
// ============================================================================
// Lý do: Khi Thành viên A làm tính năng Đăng nhập thành công, A sẽ mã hóa
// thông tin này vào mã JWT Token. Thành viên B khi viết API đặt bàn hoặc
// quản lý chi nhánh sẽ đọc mã này để biết ai đang gọi API và thuộc chi nhánh nào.
export interface IJwtPayload {
  // Mã định danh duy nhất của người dùng trong cơ sở dữ liệu (UUID)
  userId: string;

  // Email của người dùng (từ Google hoặc do Admin cấp)
  email: string;

  // Vai trò của người dùng trong hệ thống (chỉ 1 trong 3 quyền)
  role: 'CUSTOMER' | 'MANAGER' | 'ADMIN';

  // Chi nhánh mà người này quản lý (nếu là MANAGER thì BẮT BUỘC có id chi nhánh,
  // nếu là CUSTOMER hoặc ADMIN thì trường này mang giá trị null)
  branchId: string | null;
}

// ============================================================================
// 2. CHUẨN DỮ LIỆU ĐA PHƯƠNG TIỆN CỦA BÀI ĐÁNH GIÁ (REVIEW MEDIA)
// ============================================================================
// Lý do: Khách có thể tải lên cả ảnh và video ngắn. Thay vì lưu phức tạp nhiều bảng,
// ta lưu một mảng JSON các file media vào cột `media_urls` của bảng reviews.
export interface IReviewMedia {
  // Loại media: 'IMAGE' (ảnh) hoặc 'VIDEO' (video ngắn quay nồi lẩu)
  type: 'IMAGE' | 'VIDEO';

  // Đường link trực tiếp tới file (link ảnh .webp hoặc link luồng phát video .m3u8)
  url: string;

  // Ảnh bìa đại diện (thumbnail) dành riêng cho video để load nhanh trên điện thoại
  thumbnailUrl?: string;
}

// ============================================================================
// 3. CHUẨN DỮ LIỆU BẢN CHỤP BÀI VIẾT ĐÃ BỊ XÓA (REVIEW SNAPSHOT)
// ============================================================================
// Lý do: Khi Quản lý (Role 2) bấm xóa một đánh giá tiêu cực hoặc spam, bài viết
// sẽ biến mất khỏi trang khách. Nhưng trước khi ẩn đi, Thành viên A phải chụp lại
// toàn bộ nội dung gốc lưu vào bảng `review_deletion_logs` để Admin có thể xem lại.
export interface IReviewSnapshot {
  // Mã ID của bài đánh giá lúc chưa xóa
  originalReviewId: string;

  // Tên người đã viết đánh giá đó
  authorName: string;

  // Email của người viết đánh giá
  authorEmail: string;

  // Link ảnh đại diện của người viết (nếu có)
  authorAvatar?: string;

  // Số sao người đó đã chấm (từ 1 đến 5)
  rating: number;

  // Nội dung chữ của bài đánh giá
  content: string;

  // Danh sách hình ảnh / video đính kèm bài viết lúc đó
  mediaUrls: IReviewMedia[];

  // Thời điểm bài viết gốc được tạo ra (chuỗi ISO datetime)
  originalCreatedAt: string;

  // Lý do Quản lý xóa bài này (tùy chọn, ví dụ: "Spam thô tục", "Cạnh tranh không lành mạnh")
  deletionReason?: string;
}
