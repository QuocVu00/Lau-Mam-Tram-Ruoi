# 📖 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN LẨU MẮM TRĂM RƯỠI

Tài liệu này hướng dẫn chi tiết từng bước (Step-by-Step) cho người mới bắt đầu để thiết lập và khởi chạy toàn bộ hệ thống từ mã nguồn.

---

## 🏗️ 1. Cấu Trúc Tổng Quan Dự Án

Dự án gồm 2 phần chính và 1 dịch vụ cơ sở dữ liệu:
* **Database**: `PostgreSQL 16` (chạy trên cổng `5432` qua Docker Compose).
* **Backend**: `backend-nestjs` (Framework NestJS + Prisma ORM, chạy trên cổng `3001`).
* **Frontend**: `frontend-nextjs` (Framework Next.js 16 + React 19 + Tailwind CSS, chạy trên cổng `3000`).

---

## ⚙️ 2. Yêu Cầu Môi Trường Cài Đặt (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt các công cụ sau:
1. **Node.js**: Phiên bản LTS khuyến nghị `v18.x` hoặc `v20.x` trở lên ([Tải tại đây](https://nodejs.org/)).
2. **Git**: Dùng để quản lý mã nguồn ([Tải tại đây](https://git-scm.com/)).
3. **Docker Desktop**: Dùng để chạy cơ sở dữ liệu PostgreSQL nhanh chóng mà không cần cài đặt phức tạp ([Tải tại đây](https://www.docker.com/products/docker-desktop/)).

---

## 🚀 3. Các Bước Chạy Dự Án Chi Tiết

### 🔹 Bước 1: Khởi động Cơ Sở Dữ Liệu PostgreSQL (Docker)

Mở một cửa sổ Terminal (PowerShell hoặc Command Prompt) tại thư mục gốc của dự án (`Lau-Mam-Tram-Ruoi`):

```powershell
# Khởi chạy container PostgreSQL chạy ngầm
docker-compose up -d
```

> **Giải thích lệnh:**
> * `docker-compose up`: Đọc file `docker-compose.yml` và khởi tạo container database theo cấu hình có sẵn.
> * `-d` (Detached mode): Chạy container dưới nền (background) để không khóa màn hình terminal.
> * Database sẽ lắng nghe tại `localhost:5432` với tài khoản `postgres`, mật khẩu `password`, database tên `lau_mam_tram_ruoi`.

---

### 🔹 Bước 2: Cài Đặt và Khởi Động Backend (NestJS)

Mở Terminal thứ 2 để chạy Backend:

```powershell
# 1. Di chuyển vào thư mục backend-nestjs
cd backend-nestjs

# 2. Cài đặt các thư viện phụ thuộc (Dependencies)
npm install

# 3. Tạo cấu trúc bảng và đồng bộ schema vào cơ sở dữ liệu PostgreSQL
npm run prisma:push

# 4. Sinh bộ client Prisma mã nguồn TypeScript
npm run prisma:generate

# 5. Khởi chạy server Backend ở chế độ phát triển (Development / Watch)
npm run start:dev
```

> **Giải thích lệnh:**
> * `npm install`: Tải toàn bộ các package cần thiết như NestJS, Prisma Client, JWT, Socket.io...
> * `npm run prisma:push`: Đọc schema trong `prisma/schema.prisma` và tự động tạo các bảng (Users, Reviews, Bookings, Branches...) trên PostgreSQL.
> * `npm run prisma:generate`: Cập nhật mã nguồn Prisma Client để NestJS truy vấn dữ liệu có type-safety.
> * `npm run start:dev`: Khởi động backend trên cổng **3001** (`http://localhost:3001`), tự động tải lại (hot-reload) khi bạn sửa code.

---

### 🔹 Bước 3: Cài Đặt và Khởi Động Frontend (Next.js)

Mở Terminal thứ 3 để chạy Frontend:

```powershell
# 1. Di chuyển vào thư mục frontend-nextjs
cd frontend-nextjs

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển Next.js
npm run dev
```

> **Giải thích lệnh:**
> * `npm install`: Cài đặt các thư viện React, Lucide-React icon, Tailwind CSS, Socket.io Client...
> * `npm run dev`: Chạy server giao diện web tại địa chỉ **`http://localhost:3000`**.

---

## 🌐 4. Truy Cập Hệ Thống

Sau khi cả 2 server đều đang chạy:

| Thành phần | Địa chỉ truy cập (URL) | Ghi chú |
| :--- | :--- | :--- |
| **Giao diện Khách Hàng (Customer)** | `http://localhost:3000` | Trang giới thiệu món ăn, chọn chi nhánh, đặt bàn/mang về qua Zalo |
| **Trang Đánh Giá Khách Hàng** | `http://localhost:3000/reviews` | Bảng tin đánh giá, lọc theo chi nhánh, xem chi tiết và phản hồi |
| **Giao diện Quản Trị (Admin/Staff)** | `http://localhost:3000/admin` | Quản lý đánh giá và đơn đặt bàn |
| **Backend API Server** | `http://localhost:3001` | Cổng API NestJS cung cấp dữ liệu |
| **Prisma Studio (Xem dữ liệu trực quan)** | `npm run prisma:studio` (chạy trong thư mục `backend-nestjs`) | Mở trang `http://localhost:5555` để duyệt dữ liệu các bảng |

---

## 🛠️ 5. Một Số Lỗi Thường Gặp & Cách Khắc Phục

1. **Lỗi không kết nối được Database (`Can't reach database server at localhost:5432`)**:
   * *Nguyên nhân*: Docker chưa mở hoặc container chưa chạy.
   * *Khắc phục*: Mở Docker Desktop, sau đó gõ lệnh `docker-compose up -d` ở thư mục gốc.

2. **Lỗi xung đột cổng (`Port 3000 is already in use` hoặc `Port 3001 is already in use`)**:
   * *Nguyên nhân*: Có tiến trình khác hoặc phiên chạy cũ đang chiếm cổng.
   * *Khắc phục*: Tắt các tiến trình node cũ qua Task Manager hoặc kiểm tra cổng bằng PowerShell:
     ```powershell
     # Tìm tiến trình đang chiếm cổng (ví dụ cổng 3001)
     netstat -ano | findstr :3001
     # Dừng tiến trình theo PID tìm được
     taskkill /PID <PID_NUMBER> /F
     ```

3. **Lỗi hình ảnh từ domain ngoài trong Next.js**:
   * Đã được cấu hình sẵn trong `next.config.ts` hỗ trợ tải ảnh từ `images.unsplash.com`. Nếu thêm domain ảnh mới, hãy thêm vào mảng `images.remotePatterns`.
