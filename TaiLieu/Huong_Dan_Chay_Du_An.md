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