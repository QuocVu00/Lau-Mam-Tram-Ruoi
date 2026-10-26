# 📖 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN LẨU MẮM TRĂM RƯỠI

Tài liệu này hướng dẫn chi tiết quy trình khởi chạy dự án cực kỳ tinh gọn: **Chỉ cần đúng 3 lệnh từ thư mục gốc của dự án** (`Lau-Mam-Tram-Ruoi`).

---

## 🏗️ 1. Cấu Trúc Tổng Quan Dự Án

Dự án gồm 2 phần chính và 1 dịch vụ cơ sở dữ liệu:
* **Database**: `PostgreSQL 16` (chạy trên cổng `5432` qua Docker Compose).
* **Backend**: `backend-nestjs` (Framework NestJS + Prisma ORM, chạy trên cổng `3001`).
* **Frontend**: `frontend-nextjs` (Framework Next.js 16 + React 19 + Tailwind CSS, chạy trên cổng `3000`).

---

## ⚙️ 2. Yêu Cầu Môi Trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt:
1. **Node.js**: Phiên bản LTS khuyến nghị `v18.x`, `v20.x` trở lên ([Tải tại đây](https://nodejs.org/)).
2. **Git**: Dùng để quản lý mã nguồn ([Tải tại đây](https://git-scm.com/)).
3. **Docker Desktop**: Dùng để chạy cơ sở dữ liệu PostgreSQL tự động ([Tải tại đây](https://www.docker.com/products/docker-desktop/)).

---

## 🚀 3. Khởi Chạy Dự Án Cực Nhanh (3 Lệnh Duy Nhất)

> 💡 **Lưu ý:** Bạn chỉ cần mở terminal đứng **ngay tại thư mục gốc của dự án** (`Lau-Mam-Tram-Ruoi`), không cần phải gõ lệnh chuyển thư mục `cd` thủ công!

Mở **3 tab Terminal riêng biệt** trong VS Code hoặc PowerShell:

### 🔹 Tab 1: Khởi động Cơ sở dữ liệu Docker
```bash
npm run docker
```
* **Chức năng:** Tự động kích hoạt container PostgreSQL `lau_mam_postgres` chạy ngầm trên cổng `5432`.

---

### 🔹 Tab 2: Khởi động Backend (NestJS)
```bash
npm run backend
```
* **Chức năng:** 
  - Tự động đồng bộ cấu trúc bảng vào PostgreSQL (`prisma db push`).
  - Tự động gieo mầm dữ liệu mẫu ban đầu (`seed`): tạo sẵn 2 chi nhánh mẫu, tài khoản Quản trị Admin, Quản lý chi nhánh, và bài đánh giá ban đầu.
  - Bật máy chủ NestJS Backend tại cổng `http://localhost:3001` (chế độ tự động reload khi sửa code).

---

### 🔹 Tab 3: Khởi động Frontend (Next.js)
```bash
npm run frontend
```
* **Chức năng:** Khởi chạy máy chủ giao diện Next.js tại cổng `http://localhost:3000`.

---

## 🌐 4. Các Đường Dẫn Truy Cập & Tài Khoản Mẫu

Sau khi chạy xong 3 lệnh trên, bạn mở trình duyệt và trải nghiệm:

| Giao diện | Địa chỉ truy cập (URL) | Mô tả tính năng |
| :--- | :--- | :--- |
| **Trang chủ Khách Hàng** | [http://localhost:3000](http://localhost:3000) | Giới thiệu quán, chọn chi nhánh (Quận 1, Bình Thạnh), Đặt bàn / Mang về qua Zalo |
| **Bảng tin Đánh Giá** | [http://localhost:3000/reviews](http://localhost:3000/reviews) | Xem đánh giá thực khách, lọc theo từng chi nhánh, viết đánh giá kèm ảnh/video |
| **Trang Đăng Nhập Quản Trị** | [http://localhost:3000/login](http://localhost:3000/login) | Cổng đăng nhập dành riêng cho Admin và Quản lý chi nhánh |
| **Backend API Docs/Check** | [http://localhost:3001/branches](http://localhost:3001/branches) | Kiểm tra trực tiếp API lấy danh sách chi nhánh |

---

### 🔐 Danh Sách Tài Khoản Đăng Nhập Mẫu

Hệ thống đã nạp sẵn các tài khoản sau vào cơ sở dữ liệu:

1. **Tài khoản Tổng Quản Lý (ADMIN):**
   - **Email:** `admin@laumam.vn`
   - **Mật khẩu:** `admin123`
   - **Quyền hạn:** Quản lý toàn bộ chi nhánh, xem thống kê đánh giá, duyệt xóa đánh giá toàn hệ thống.

2. **Tài khoản Quản Lý Chi Nhánh Quận 1 (MANAGER):**
   - **Email:** `manager.q1@laumam.vn`
   - **Mật khẩu:** `manager123`
   - **Quyền hạn:** Nhận thông báo đặt bàn / đặt mang về theo thời gian thực (Realtime), phản hồi bài đánh giá của chi nhánh Quận 1.