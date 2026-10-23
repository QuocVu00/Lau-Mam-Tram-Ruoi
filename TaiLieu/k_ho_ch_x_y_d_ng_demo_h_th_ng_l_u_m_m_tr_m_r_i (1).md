# KẾ HOẠCH XÂY DỰNG & TRIỂN KHAI DEMO WEBSITE "LẨU MẮM TRĂM RƯỠI"

Tài liệu đặc tả kỹ thuật, phân quyền nghiệp vụ và kịch bản triển khai bản **Demo (MVP)** cho hệ thống đánh giá đa chi nhánh và đặt bàn/mua mang về **"Lẩu Mắm Trăm Rưỡi"**, tối ưu hóa chuyên biệt cho trải nghiệm thiết bị di động (Mobile-First).

---

## 1. Mục Tiêu Dự Án & Yêu Cầu Cốt Lõi

* **Tên hệ thống:** Lẩu Mắm Trăm Rưỡi (Hệ thống chuỗi nhiều chi nhánh).
* **Mục đích chính:**
  * Thu thập đánh giá thực tế từ khách hàng (Hình ảnh, Video, Văn bản, Chấm điểm bằng biểu tượng đặc trưng).
  * Tiếp nhận yêu cầu Đặt bàn & Mua mang về nhanh chóng qua số điện thoại Zalo.
  * Quản trị đánh giá minh bạch: Khách không thể xóa bài đã đăng; Quản lý chi nhánh có thể xóa bài vi phạm (bài bị xóa sẽ không còn được tính vào điểm đánh giá của chi nhánh đó); Admin nắm toàn quyền tạo chi nhánh mới và kiểm soát lịch sử xóa của toàn hệ thống.
* **Tiêu chí kỹ thuật bắt buộc:** Thiết kế chuẩn **Mobile-First**, giao diện lướt mượt như ứng dụng di động, không bị trễ (loading lâu) khi tải nhiều ảnh và video.

---

## 2. Phân Quyền Và Chức Năng Hệ Thống (3 Roles)

| Phân quyền (Role) | Cơ chế Đăng nhập | Chức năng chính | Quy tắc nghiệp vụ đặc biệt |
| :--- | :--- | :--- | :--- |
| **Role 1: Khách vãng lai** (Customer) | **Google One Tap:** Hiển thị popup hỏi xác nhận tài khoản Google sẵn có trên máy, chạm 1 lần để vào thẳng trang chính, không cần nhập tài khoản/mật khẩu. | • Chọn chi nhánh để xem tổng quan & luồng đánh giá.<br>• Viết đánh giá: Chấm điểm (biểu tượng), viết text, tải lên ảnh & video.<br>• Chỉnh sửa bài đánh giá của chính mình.<br>• Trả lời (reply) bình luận khác, thả biểu tượng cảm xúc (reactions).<br>• Đăng ký Đặt bàn hoặc Mua mang về. | • **Cấm xóa:** Khách chỉ được phép chỉnh sửa bài của mình, tuyệt đối không có nút xóa.<br>• **Đặt bàn / Mang về:** Chỉ cần nhập **Tên** **Số người** và **Số điện thoại dùng Zalo**. |
| **Role 2: Quản lý chi nhánh** (Branch Manager) | Tài khoản & Mật khẩu do Admin cấp (được phân công cố định cho 1 chi nhánh). | • Xem danh sách đánh giá của chi nhánh mình phụ trách.<br>• Phản hồi (reply) đánh giá của khách dưới tên Chi nhánh.<br>• Xóa đánh giá vi phạm/spam của chi nhánh mình.<br>• Nhận thông báo & xử lý yêu cầu Đặt bàn / Mua mang về từ khách. | • **Cơ chế Xóa đánh giá:** Khi Quản lý bấm "Xóa", đánh giá đó biến mất khỏi chi nhánh và **không còn được tính vào tổng điểm sao hay số lượng đánh giá của cửa hàng nữa**.<br>• Hệ thống tự động chuyển bài bị xóa vào **Lịch sử xóa** để Admin biết chi nhánh nào vừa xóa bài nào (Admin có thể bấm vào xem lại toàn bộ chi tiết bài đã xóa). |
| **Role 3: Quản trị viên** (Super Admin) | Tài khoản & Mật khẩu cấp cao nhất. | • **Trang tổng quan:** Xem danh sách toàn bộ chi nhánh và tổng số sao đánh giá trung bình của từng chi nhánh.<br>• **Quản lý chi nhánh:** Tạo chi nhánh mới, cập nhật thông tin chi nhánh.<br>• Xem toàn bộ đánh giá của tất cả các chi nhánh.<br>• **Quản lý nhân sự:** Tạo mới, phân công hoặc xóa tài khoản của Role 2 (Quản lý chi nhánh).<br>• **Quản lý Lịch sử xóa:** Xem toàn bộ lịch sử các bài đã bị Role 2 xóa ở mọi chi nhánh. | • **Đặc quyền Lịch sử xóa:** Chỉ Admin mới xem được danh sách lịch sử xóa, bấm vào từng mục để xem chi tiết nội dung/ảnh/video của đánh giá đã bị xóa và có quyền **Xóa lịch sử xóa** (xóa vĩnh viễn khỏi hệ thống). |

---

## 3. Kiến Trúc Công Nghệ Đã Chốt (Tech Stack)

### 3.1. Giao diện người dùng (Frontend)
* **Framework:** **Next.js (React)** — Hỗ trợ tải trang siêu tốc trên điện thoại, tối ưu SEO và trải nghiệm lướt mượt.
* **UI/Styling:** **Tailwind CSS** kết hợp thư viện **Shadcn UI** hoặc **Radix UI**.
* **Xác thực Google:** Sử dụng thư viện **Google Identity Services (GIS)** tích hợp chế độ **Google One Tap**.

### 3.2. Hệ thống xử lý ngầm (Backend & Thời gian thực)
* **Ngôn ngữ / Nền tảng:** **Node.js (NestJS - TypeScript)**.
  * Tự chủ toàn bộ code logic, cấu trúc phân quyền (**Guards**) cho 3 Role cực kỳ rõ ràng, bảo mật cao.
* **Tính năng nhận đơn Đặt bàn / Mua mang về cho Role 2:** Dùng **WebSockets (Socket.io)** hoặc **Server-Sent Events (SSE)** để khi khách vừa bấm đặt bàn, màn hình điện thoại/máy tính của Quản lý chi nhánh đó lập tức kêu *"Ting"* và hiện đơn ngay mà không cần tải lại trang.

### 3.3. Cơ sở dữ liệu (Database) & Lưu trữ Ảnh/Video (Quan trọng nhất)
* **Database chính (Lưu thông tin text, tài khoản, số sao, đơn đặt bàn):** **PostgreSQL**.
  * *Lý do:* Quản lý dữ liệu có cấu trúc (Chi nhánh -> Đánh giá -> Bình luận con -> Lịch sử xóa) cực kỳ chặt chẽ, truy vấn thống kê điểm trung bình trên trang Dashboard Admin rất nhanh. Database chỉ lưu đường dẫn (URL) của ảnh và video, tuyệt đối không lưu file nặng vào đây.
* **Lưu trữ & Tối ưu Ảnh/Video:** **Cloudinary** hoặc **Cloudflare R2 + Cloudflare Stream** (hoặc **AWS S3 + CloudFront**).
  * *Cơ chế giúp web không bị lag:*
    1. Khi khách chọn video quay nồi lẩu nặng 100MB từ điện thoại, web sẽ tải trực tiếp lên Cloudinary/Cloudflare (**Presigned URL**) chứ không đi vòng qua server của bạn.
    2. Dịch vụ này tự động nén ảnh sang định dạng siêu nhẹ (**WebP/AVIF**) và cắt nhỏ video thành chuẩn **HLS (Adaptive Bitrate)** — giống cách TikTok/YouTube hoạt động (mạng yếu xem nét vừa, mạng khỏe xem HD, bấm vào là chạy ngay không cần tải xong cả file).

---

## 4. Thiết Kế Cơ Sở Dữ Liệu (Database Schema Phục Vụ Demo)

Để đảm bảo việc tính lại điểm sao ngay khi Quản lý xóa bài và lưu trữ lịch sử cho Admin xem lại, PostgreSQL sẽ gồm 6 bảng cốt lõi:

1. **`branches` (Chi nhánh):**
   * `id`, `name`, `address`, `phone`, `avg_rating` (Điểm trung bình chỉ tính trên các đánh giá đang hiển thị), `total_active_reviews` (Tổng số đánh giá hợp lệ hiện tại), `created_at`.
2. **`users` (Tài khoản 3 Role):**
   * `id`, `email`, `full_name`, `avatar_url`, `role` (`CUSTOMER`, `MANAGER`, `ADMIN`), `branch_id` (Gán chi nhánh cho `MANAGER`).
3. **`reviews` (Bài đánh giá):**
   * `id`, `branch_id`, `user_id`, `rating` (Số biểu tượng từ 1-5), `content`, `media_urls` (JSON chứa link ảnh WebP và video HLS), `is_edited` (Boolean), `status` (`ACTIVE` hoặc `DELETED_BY_MANAGER`), `created_at`, `updated_at`.
4. **`review_deletion_logs` (Lịch sử xóa dành riêng cho Admin):**
   * `id`, `review_id`, `branch_id`, `deleted_by_manager_id`, `review_snapshot` (Lưu toàn bộ nội dung chữ, số sao, ảnh/video, tên khách đánh giá tại thời điểm bị xóa để Admin bấm vào xem chi tiết), `deleted_at`.
5. **`review_interactions` (Bình luận & Thả cảm xúc):**
   * `id`, `review_id`, `user_id`, `type` (`REPLY`, `REACTION`), `reaction_type`, `reply_content`, `created_at`.
6. **`bookings_orders` (Đặt bàn & Mua mang về):**
   * `id`, `branch_id`, `user_id`, `customer_name`, `zalo_phone`, `type` (`BOOK_TABLE`, `TAKEAWAY`), `details`, `status` (`NEW`, `CONFIRMED`, `DONE`), `created_at`.

---

## 5. Kịch Bản Xây Dựng & Chạy Thử Bản Demo (MVP)

Để quá trình Demo diễn ra trực quan và thuyết phục nhất trên điện thoại, lộ trình chuẩn bị bản Demo được chia thành 4 bước sắp xếp theo luồng trải nghiệm:

### Bước 1: Dựng Giao Diện Mobile-First & Luồng Khách Vãng Lai (Role 1)
* **Màn hình vào web:** Hiển thị danh sách chi nhánh và popup **Google One Tap** ở góc dưới màn hình. Khách ấn "Tiếp tục dưới tên..." là đăng nhập xong.
* **Luồng Đánh giá:** Khách chọn 1 chi nhánh -> Bấm viết đánh giá -> Chọn số lượng biểu tượng (tương ứng 1-5 sao), tải lên 1 ảnh + 1 video ngắn -> Đăng bài.
* **Kiểm chứng nghiệp vụ:** Sau khi đăng, khách bấm vào bài của mình chỉ thấy nút **"Chỉnh sửa"**, hoàn toàn không có nút "Xóa". Khách thử thả cảm xúc và bình luận vào bài của người khác.
* **Luồng Đặt bàn / Mang về:** Khách bấm nút "Đặt bàn / Mua mang về" trên thanh công cụ dưới đáy màn hình -> Điền **Tên** + **Số điện thoại Zalo** -> Bấm Gửi.

### Bước 2: Demo Luồng Quản Lý Chi Nhánh (Role 2)
* Mở một màn hình thứ 2 (đăng nhập sẵn tài khoản Quản lý Chi nhánh A).
* **Kiểm chứng Realtime:** Ngay khi Khách ở Bước 1 bấm gửi đơn Đặt bàn, màn hình Quản lý phát âm thanh *"Ting"* và nổi thông báo đơn mới kèm SĐT Zalo của khách.
* **Phản hồi & Xóa đánh giá:**
  * Quản lý bấm trả lời bài đánh giá của khách.
  * Quản lý thử bấm **"Xóa"** một bài đánh giá 1 sao. Ngay lập tức, bài đánh giá đó biến mất khỏi trang chi nhánh, và **điểm trung bình sao của chi nhánh tự động được tính lại** (không còn tính bài vừa xóa nữa).

### Bước 3: Demo Luồng Quản Trị Viên Tối Cao (Role 3 - Admin)
* Đăng nhập vào Dashboard của Admin.
* **Trang Tổng quan & Quản lý Chi nhánh:**
  * Xem bảng tổng hợp tất cả chi nhánh cùng tổng số sao cập nhật theo thời gian thực.
  * Thử bấm **"Tạo chi nhánh mới"** (Ví dụ: *Lẩu Mắm Trăm Rưỡi - Chi nhánh mới*) -> Chi nhánh lập tức xuất hiện trên hệ thống.
* **Quản lý Tài khoản Role 2:** Tạo mới một tài khoản Quản lý và gán vào chi nhánh vừa tạo; thử xóa/khóa một tài khoản Quản lý cũ.
* **Kiểm tra Lịch sử xóa (Điểm nhấn quan trọng):**
  * Admin mở tab **"Lịch sử xóa đánh giá"**.
  * Hệ thống hiển thị rõ: *Chi nhánh A đã xóa 1 đánh giá vào lúc [Giờ/Ngày] bởi [Tên Quản lý]*.
  * Admin **bấm vào dòng lịch sử đó** -> Mở ra cửa sổ xem lại đầy đủ nội dung chữ, số sao, hình ảnh và video của bài đánh giá đã bị xóa.
  * Admin bấm **"Xóa lịch sử này"** -> Bản ghi biến mất hoàn toàn khỏi hệ thống.

### Bước 4: Tối Ưu Hóa Trải Nghiệm Mượt Trên Điện Thoại Trước Khi Demo
* Áp dụng **Skeleton Loading** (khung xương mờ) thay cho biểu tượng xoay tròn để tạo cảm giác trang web phản hồi tức thì.
* Nén ảnh nhanh ngay trên trình duyệt điện thoại của khách trước khi đẩy lên Cloudinary/Cloudflare để thao tác đăng bài trong lúc Demo chỉ mất dưới 2 giây.