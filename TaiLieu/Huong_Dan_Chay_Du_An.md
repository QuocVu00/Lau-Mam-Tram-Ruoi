Mở **2 tab Terminal** tại thư mục gốc `Lau-Mam-Tram-Ruoi`:

### 🔹 Tab 1: Khởi động Backend (NestJS)
```bash
npm run backend
```

### 🔹 Tab 2: Khởi động Frontend (Next.js)
```bash
npm run frontend
```
* **Chức năng:** Khởi chạy giao diện người dùng Next.js tại `http://localhost:3000`.


> *(Tùy chọn: Nếu sau này bạn muốn chạy offline không cần Internet thì mở thêm Tab: `npm run docker` để chạy PostgreSQL qua Docker).*

---

## 🌐 3. Các Đường Dẫn Truy Cập & Tài Khoản Mẫu

| Giao diện | Địa chỉ truy cập (URL) | Mô tả tính năng |
| :--- | :--- | :--- |
| **Trang chủ Khách Hàng** | [http://localhost:3000](http://localhost:3000) | Giới thiệu quán, chọn chi nhánh (Quận 1, Bình Thạnh), Đặt bàn / Mang về qua Zalo |
| **Bảng tin Đánh Giá** | [http://localhost:3000/reviews](http://localhost:3000/reviews) | Xem đánh giá thực khách, lọc theo từng chi nhánh, viết đánh giá kèm ảnh/video |
| **Trang Đăng Nhập Quản Trị** | [http://localhost:3000/login](http://localhost:3000/login) | Cổng đăng nhập dành riêng cho Admin và Quản lý chi nhánh |
| **Backend API Docs/Check** | [http://localhost:3001/branches](http://localhost:3001/branches) | Kiểm tra trực tiếp API lấy danh sách chi nhánh |

---

### 🔐 Danh Sách Tài Khoản Dùng Chung Trên Neon Cloud

Dữ liệu tài khoản này đã được đồng bộ sẵn trên Neon Cloud, dùng được cho tất cả thành viên:

1. **Tài khoản Tổng Quản Lý (ADMIN):**
   - **Email:** `admin@gmail.com`
   - **Mật khẩu:** `123456`
   - **Quyền hạn:** Quản lý toàn bộ chi nhánh, xem thống kê đánh giá, duyệt xóa đánh giá toàn hệ thống.

2. **Tài khoản Quản Lý Chi Nhánh Quận 1 (MANAGER):**
   - **Email:** `quanly1@gmail.com`
   - **Mật khẩu:** `123456`
   - **Quyền hạn:** Nhận thông báo đặt bàn / đặt mang về theo thời gian thực (Realtime), phản hồi bài đánh giá của chi nhánh Quận 1.
