# BẢNG PHÂN CHIA NHIỆM VỤ CHI TIẾT (FULLSTACK THEO TÍNH NĂNG) - DỰ ÁN "LẨU MẮM TRĂM RƯỠI"

Tài liệu phân công công việc cho **Thành viên A** và **Thành viên B** theo mô hình **Fullstack (Backend NestJS + Frontend Next.js)** chia theo các cụm tính năng (Modules) để triển khai bản **Demo (MVP)** hệ thống **"Lẩu Mắm Trăm Rưỡi"**.

---

## 1. Nguyên Tắc Phân Công Fullstack Theo Tính Năng

Thay vì chia cắt Backend và Frontend, mỗi thành viên sẽ chịu trách nhiệm **trọn gói từ Database -> API (NestJS) -> Giao diện (Next.js)** cho các cụm tính năng riêng biệt:

* **Thành viên A (Phụ trách Core Auth, Hệ thống Đánh giá Đa phương tiện & Nghiệp vụ Xóa/Lịch sử xóa):**
  * Nắm toàn bộ luồng **Bài đánh giá (Reviews)**: Từ lúc khách đăng nhập Google One Tap, tải ảnh/video lên Cloud, viết/sửa đánh giá, tương tác bình luận/cảm xúc, cho đến khi Quản lý xóa bài (tính lại điểm sao) và Admin vào xem/xóa **Lịch sử xóa đánh giá**.
* **Thành viên B (Phụ trách Hệ thống Chi nhánh, Quản trị Nhân sự Role 2 & Luồng Đặt bàn/Mang về Realtime):**
  * Nắm toàn bộ luồng **Chi nhánh & Vận hành (Branches, Users & Bookings)**: Từ khung giao diện Mobile chung, quản lý danh sách/tạo mới chi nhánh, quản lý tài khoản Role 2, cho đến toàn bộ luồng Khách đặt bàn qua Zalo và thông báo **Realtime ("Ting")** cho Quản lý chi nhánh.

---

## 2. Giai Đoạn Khởi Tạo Chung (Cả A & B Cùng Chốt Trong Ngày Đầu)

Trước khi tách nhánh code các tính năng độc lập, A và B cùng thống nhất cấu trúc cơ sở dữ liệu để không bị xung đột (Conflict):
* **Khởi tạo Monorepo hoặc 2 Repo (Next.js + NestJS):** Cài đặt sẵn Tailwind CSS, Shadcn UI, Prisma/TypeORM kết nối PostgreSQL.
* **Chốt Schema 6 bảng trong PostgreSQL:**
  * Thành viên A chủ trì thiết kế bảng: `reviews`, `review_deletion_logs`, `review_interactions`.
  * Thành viên B chủ trì thiết kế bảng: `branches`, `users`, `bookings_orders`.

---

## 3. Danh Sách Nhiệm Vụ Chi Tiết Của Thành Viên A (Fullstack: Auth & Luồng Đánh Giá / Lịch Sử Xóa)

### Module A1: Xác thực Người dùng (Google One Tap & Phân quyền 3 Role)
* **[Task A1.1 - Backend (NestJS)]:**
  * Xây dựng API xác thực Google One Tap cho Khách vãng lai (Role 1) -> Tự động tạo tài khoản `CUSTOMER` và trả về JWT.
  * Xây dựng API Đăng nhập bằng Email/Password cho Quản lý (Role 2) và Admin (Role 3) kèm **Guards** phân quyền.
* **[Task A1.2 - Frontend (Next.js)]:**
  * Tích hợp thư viện **Google Identity Services (GIS)** hiển thị popup đăng nhập 1 chạm ở góc dưới màn hình điện thoại cho khách.
  * Xây dựng trang Đăng nhập (Login Form) dùng chung cho Quản lý chi nhánh và Admin.

### Module A2: Luồng Đánh giá Đa phương tiện (Ảnh/Video) & Tương tác (Role 1)
* **[Task A2.1 - Backend (NestJS) & Cloud Media]:**
  * Tích hợp **Cloudinary / Cloudflare** tạo API cấp Presigned URL để đẩy trực tiếp ảnh (WebP) và video (HLS) lên Cloud.
  * Viết API Tạo đánh giá mới, API Chỉnh sửa đánh giá của chính mình (bật cờ `is_edited = true`, **không có API xóa cho khách**) và API Lấy danh sách đánh giá theo chi nhánh (Infinite Scroll).
  * Viết hàm tự động tính toán và cập nhật lại `avg_rating` và `total_active_reviews` vào bảng `branches` mỗi khi có đánh giá mới.
* **[Task A2.2 - Frontend (Next.js Mobile UI)]:**
  * Xây dựng luồng hiển thị bài đánh giá (Feed) với hiệu ứng **Skeleton Loading**, lưới xem ảnh và trình phát video **HLS** mượt trên di động.
  * Xây dựng Form Viết & Chỉnh sửa đánh giá: Chọn số lượng biểu tượng (1-5), tích hợp nén ảnh trên trình duyệt (`browser-image-compression`) trước khi upload. Đảm bảo bài của khách chỉ hiện nút **"Chỉnh sửa"**, không có nút xóa.
* **[Task A2.3 - Fullstack (Backend + Frontend)]:**
  * Xây dựng tính năng Trả lời bình luận (Reply) và Thả biểu tượng cảm xúc (Reaction) cho cả Khách và Quản lý (áp dụng **Optimistic UI** trên Frontend để bấm là sáng ngay).

### Module A3: Nghiệp vụ Quản lý Xóa Đánh giá & Admin Kiểm soát Lịch sử xóa (Role 2 & Role 3)
* **[Task A3.1 - Backend (NestJS)]:**
  * Viết API cho Quản lý (Role 2) bấm **"Xóa đánh giá"** tại chi nhánh của mình (Dùng Transaction):
    1. Đổi trạng thái bài viết sang `DELETED_BY_MANAGER`.
    2. **Tính lại ngay lập tức** điểm trung bình sao (`avg_rating`) và tổng số đánh giá của chi nhánh đó (loại bỏ hoàn toàn điểm của bài vừa xóa).
    3. Lưu bản chụp toàn bộ nội dung gốc, ảnh/video, người đăng vào bảng `review_deletion_logs`.
  * Viết API cho Admin (Role 3) lấy danh sách lịch sử xóa, xem chi tiết bài đã xóa và **Xóa vĩnh viễn** lịch sử xóa.
* **[Task A3.2 - Frontend (Next.js)]:**
  * Tích hợp nút **"Xóa đánh giá"** trên màn hình của Quản lý chi nhánh: Khi bấm xóa, ẩn bài viết khỏi danh sách và cập nhật lại ngay số sao trung bình trên giao diện.
  * Xây dựng trang **"Lịch sử xóa đánh giá"** trong Dashboard của Admin: Hiển thị danh sách các bài bị Role 2 xóa, bấm vào từng dòng mở **Modal xem lại chi tiết bài viết gốc (chữ, sao, ảnh, video)** và nút **"Xóa lịch sử này"**.

---

## 4. Danh Sách Nhiệm Vụ Chi Tiết Của Thành Viên B (Fullstack: Chi Nhánh, Nhân Sự & Đặt Bàn Realtime)

### Module B1: Khung Giao diện Mobile-First & Quản lý Chi nhánh (Role 1 & Role 3)
* **[Task B1.1 - Frontend Base (Next.js)]:**
  * Dựng khung Layout chính chuẩn Mobile-First cho toàn bộ web: Thanh Header chọn chi nhánh và thanh điều hướng cố định dưới đáy (**Bottom Navigation Bar**) cho khách hàng; Layout Sidebar/Topbar cho trang Quản lý và Admin.
* **[Task B1.2 - Backend (NestJS)]:**
  * Xây dựng cụm API Chi nhánh (`branches`): Lấy danh sách toàn bộ chi nhánh kèm tổng số sao và số lượng đánh giá; xem chi tiết 1 chi nhánh.
  * Xây dựng API cho Admin (Role 3): **Tạo chi nhánh mới** và cập nhật thông tin chi nhánh.
* **[Task B1.3 - Frontend (Next.js)]:**
  * Xây dựng bộ chọn Chi nhánh ở trang chủ của Khách (hiển thị tên quán, địa chỉ, điểm trung bình biểu tượng).
  * Xây dựng **Trang Tổng quan Hệ thống (Admin Dashboard)**: Hiển thị danh sách tất cả chi nhánh, điểm số sao của từng chi nhánh và Modal/Form **"Tạo chi nhánh mới"**.

### Module B2: Quản lý Tài khoản Quản lý Chi nhánh (Role 3 quản lý Role 2)
* **[Task B2.1 - Backend (NestJS)]:**
  * Xây dựng cụm API cho Admin quản lý nhân sự Role 2: Lấy danh sách tài khoản Quản lý, tạo tài khoản Quản lý mới và gán cố định vào 1 `branch_id`, khóa hoặc xóa tài khoản Quản lý.
* **[Task B2.2 - Frontend (Next.js)]:**
  * Xây dựng giao diện **Quản lý Nhân sự (Role 2)** trên trang Admin: Bảng danh sách tài khoản Quản lý, Form tạo mới (có ô chọn phân công vào chi nhánh vừa tạo ở Module B1) và nút xóa tài khoản.

### Module B3: Luồng Đặt Bàn / Mua Mang Về Qua Zalo & Thông báo Realtime (Role 1 & Role 2)
* **[Task B3.1 - Backend (NestJS & WebSockets/SSE)]:**
  * Xây dựng API cho Khách (Role 1) gửi đơn **Đặt bàn** hoặc **Mua mang về** (Lưu thông tin:Chi nhánh, Tên khách, Số người, SĐT Zalo, Loại đơn).
  * Tích hợp **Socket.io (hoặc Server-Sent Events)** chia theo phòng (`branch_id`): Ngay khi khách gửi đơn thành công, bắn tín hiệu Realtime xuống đúng Quản lý của chi nhánh đó.
  * Xây dựng API cho Quản lý chi nhánh (Role 2) xem danh sách đơn và cập nhật trạng thái xử lý (`NEW` -> `CONFIRMED` -> `DONE`).
* **[Task B3.2 - Frontend (Next.js)]:**
  * Xây dựng Drawer/Modal trượt từ dưới lên trên màn hình điện thoại cho Khách bấm **"Đặt bàn / Mua mang về"** (Form gọn nhẹ chỉ gồm Tên, Số người, SĐT Zalo).
  * Xây dựng **Màn hình Tiếp nhận đơn Realtime cho Quản lý (Role 2)**: Lắng nghe sự kiện Socket, tự động phát âm thanh *"Ting"* và bật thông báo nổi ngay khi khách bấm đặt bàn mà không cần tải lại trang, kèm nút bấm mở nhanh Zalo của khách.

---

## 5. Bảng Đối Chiếu & Ghép Nối Giữa 2 Thành Viên (Integration Matrix)

Vì làm Fullstack theo tính năng nên 2 thành viên gần như độc lập, chỉ cần ghép nối với nhau tại **4 điểm chạm** sau:

| Điểm chạm tích hợp | Thành viên A thực hiện | Thành viên B thực hiện | Cách thức phối hợp |
| :--- | :--- | :--- | :--- |
| **1. Khung trang & Chọn chi nhánh** | Hiển thị danh sách Đánh giá (`Reviews Feed`) theo `branch_id` đang chọn. | Cung cấp Layout chung và thanh chọn Chi nhánh (`branch_id` state/URL). | Khi khách đổi chi nhánh trên thanh của B, component Đánh giá của A tự động tải lại bài viết của chi nhánh đó. |
| **2. Cập nhật điểm sao Chi nhánh** | Khi khách đăng bài mới hoặc Quản lý xóa bài, hàm Backend của A tính lại `avg_rating` trong bảng `branches`. | Giao diện Chi nhánh (Khách) và Trang tổng quan (Admin) của B đọc cột `avg_rating` từ bảng `branches` ra hiển thị. | Dùng chung bảng `branches`, A cập nhật dữ liệu, B hiển thị dữ liệu. |
| **3. Phân quyền Quản lý (Role 2)** | Dùng thông tin `user.branch_id` trong JWT Token để kiểm tra quyền khi Quản lý xóa hoặc trả lời đánh giá. | Tạo tài khoản Quản lý và gán `branch_id` vào bảng `users`. | Thống nhất cấu trúc payload của JWT Token: `{ userId, role, branchId }`. |
| **4. Dashboard Admin & Quản lý** | Gắn tab **"Quản lý Đánh giá"** và **"Lịch sử xóa"** vào khung Dashboard. | Dựng khung Sidebar/Menu cho Quản lý & Admin, gắn tab **"Chi nhánh"**, **"Tài khoản Role 2"** và **"Đơn Đặt bàn"**. | Mỗi người phụ trách các trang (routes) riêng trên cùng một thanh Menu quản trị. |
