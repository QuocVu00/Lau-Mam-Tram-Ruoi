# TÀI LIỆU QUY CHUẨN KỸ THUẬT & CHỐNG XUNG ĐỘT CODE (CODING CONVENTIONS)
**Dự án:** Hệ thống Đánh giá & Đặt bàn Đa chi nhánh "Lẩu Mắm Trăm Rưỡi" (MVP)  
**Mô hình làm việc:** 2 Thành viên Fullstack theo cụm tính năng (Feature-driven Fullstack)  
**Mục tiêu:** Đảm bảo Thành viên A và Thành viên B code độc lập 100%, ghép nối trơn tru tại 4 điểm chạm và **KHÔNG XẢY RA CONFLICT** khi gộp code (Merge/Push).

---

## 1. NGUYÊN TẮC "PHÂN VÙNG LÃNH THỔ" TRONG SOURCE CODE (CHỐNG CONFLICT TUYỆT ĐỐI)

Để tránh việc 2 người sửa chung 1 file gây xung đột khi `git push`, cấu trúc thư mục của cả Backend (NestJS) và Frontend (Next.js) được chia theo ranh giới sở hữu rõ ràng:

### 1.1. Cấu trúc thư mục Backend (`backend-nestjs/src/`)
```text
src/
├── common/                  # [DÙNG CHUNG - CHỐT NGÀY 1] Các Decorator, Guards, Interfaces chuẩn
│   ├── decorators/          # @CurrentUser(), @Roles()
│   ├── guards/              # JwtAuthGuard, RolesGuard (Thành viên A tạo Ngày 1, B chỉ import dùng)
│   └── interfaces/          # jwt-payload.interface.ts (Khóa cứng cấu trúc)
├── prisma/                  # [DÙNG CHUNG - KHÓA CỨNG NGÀY 1]
│   ├── schema.prisma        # Chốt 6 bảng ngay Ngày 1. Muốn sửa phải thông báo cho người kia!
│   └── prisma.service.ts
│
├── modules/
│   ├── auth/                # 🔴 [CHỈ THÀNH VIÊN A CODE] Google One Tap, Login Role 2 & 3
│   ├── reviews/             # 🔴 [CHỈ THÀNH VIÊN A CODE] CRUD đánh giá, tính lại sao, tương tác
│   ├── deletion-logs/       # 🔴 [CHỈ THÀNH VIÊN A CODE] Lịch sử xóa đánh giá cho Admin
│   ├── media/               # 🔴 [CHỈ THÀNH VIÊN A CODE] Presigned URL Cloudinary/Cloudflare
│   │
│   ├── branches/            # 🔵 [CHỈ THÀNH VIÊN B CODE] Quản lý chi nhánh, đọc điểm sao
│   ├── users/               # 🔵 [CHỈ THÀNH VIÊN B CODE] Admin quản lý tài khoản Role 2 (Manager)
│   └── bookings/            # 🔵 [CHỈ THÀNH VIÊN B CODE] Đặt bàn/Mang về Zalo + Socket.io ("Ting")
└── app.module.ts            # ⚠️ File nhạy cảm: Chỉ thêm Module của mình theo đúng dòng được chia
```

### 1.2. Cấu trúc thư mục Frontend (`frontend-nextjs/src/`)
```text
src/
├── components/
│   ├── ui/                  # [DÙNG CHUNG] Các component gốc của Shadcn UI (Button, Dialog, Drawer...)
│   ├── layout/              # 🔵 [THÀNH VIÊN B SỞ HỮU] Header chọn chi nhánh, BottomNav, AdminSidebar
│   ├── reviews/             # 🔴 [THÀNH VIÊN A SỞ HỮU] ReviewFeed, ReviewForm, MediaUploader, ReactionBar
│   ├── auth/                # 🔴 [THÀNH VIÊN A SỞ HỮU] GoogleOneTapPopup, StaffLoginForm
│   ├── branches/            # 🔵 [THÀNH VIÊN B SỞ HỮU] BranchSelector, AdminBranchModal
│   └── bookings/            # 🔵 [THÀNH VIÊN B SỞ HỮU] BookingDrawerZalo, ManagerRealtimeAlert
│
├── app/                     # App Router của Next.js (Chia tách các trang rõ ràng)
│   ├── (customer)/          # Layout Mobile-First của Khách (Do B dựng khung)
│   │   ├── layout.tsx       # 🔵 B dựng khung Header + BottomNav, nhúng <GoogleOneTapPopup /> của A
│   │   └── page.tsx         # B hiển thị thông tin chi nhánh ở trên, nhúng <ReviewFeed /> của A ở dưới
│   ├── login/page.tsx       # 🔴 [CHỈ THÀNH VIÊN A CODE] Trang đăng nhập cho Role 2 & Role 3
│   ├── manager/             # Trang dành cho Quản lý chi nhánh (Role 2)
│   │   ├── bookings/page.tsx# 🔵 [CHỈ THÀNH VIÊN B CODE] Màn hình nhận đơn Realtime ("Ting")
│   │   └── reviews/page.tsx # 🔴 [CHỈ THÀNH VIÊN A CODE] Quản lý trả lời & Xóa đánh giá chi nhánh
│   └── admin/               # Trang dành cho Super Admin (Role 3)
│       ├── branches/page.tsx# 🔵 [CHỈ THÀNH VIÊN B CODE] Tổng quan sao & Tạo chi nhánh mới
│       ├── staff/page.tsx   # 🔵 [CHỈ THÀNH VIÊN B CODE] Tạo & gán tài khoản Quản lý (Role 2)
│       └── logs/page.tsx    # 🔴 [CHỈ THÀNH VIÊN A CODE] Xem & Xóa vĩnh viễn Lịch sử xóa đánh giá
```

---

## 2. KHÓA CỨNG SCHEMA DATABASE (`schema.prisma`) - CHỐT NGÀY 1

Cả A và B **bắt buộc dùng chung** file `schema.prisma` dưới đây ngay từ Ngày 1 để tên bảng và tên cột khớp 100%. Tuyệt đối không tự ý đổi tên trường nếu chưa thống nhất.

```prisma
// File: backend-nestjs/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// ENUMS DÙNG CHUNG TOÀN HỆ THỐNG
// ==========================================
enum Role {
  CUSTOMER // Role 1: Khách vãng lai (Google One Tap)
  MANAGER  // Role 2: Quản lý chi nhánh
  ADMIN    // Role 3: Quản trị viên tối cao
}

enum ReviewStatus {
  ACTIVE             // Đang hiển thị và được tính vào điểm trung bình
  DELETED_BY_MANAGER // Đã bị Quản lý xóa (Không tính điểm sao nữa)
}

enum InteractionType {
  REPLY    // Trả lời bình luận
  REACTION // Thả cảm xúc
}

enum BookingType {
  BOOK_TABLE // Đặt bàn tại quán
  TAKEAWAY   // Mua mang về
}

enum BookingStatus {
  NEW       // Đơn mới (vừa kêu "Ting")
  CONFIRMED // Quản lý đã liên hệ Zalo xác nhận
  DONE      // Hoàn tất
}

// ==========================================
// PHẦN CỦA THÀNH VIÊN B CHỦ TRÌ (3 BẢNG)
// ==========================================

/// Bảng 1: Chi nhánh (B quản lý CRUD, A cập nhật avgRating & totalActiveReviews)
model Branch {
  id                 String   @id @default(uuid())
  name               String
  address            String
  phone              String
  avgRating          Float    @default(0) @map("avg_rating")
  totalActiveReviews Int      @default(0) @map("total_active_reviews")
  createdAt          DateTime @default(now()) @map("created_at")

  users        User[]
  reviews      Review[]
  deletionLogs ReviewDeletionLog[]
  bookings     BookingOrder[]

  @@map("branches")
}

/// Bảng 2: Người dùng 3 Role (A xử lý Auth, B quản lý tài khoản Role 2)
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String?  @map("password_hash") // Null nếu là CUSTOMER đăng nhập Google
  fullName     String   @map("full_name")
  avatarUrl    String?  @map("avatar_url")
  role         Role     @default(CUSTOMER)
  branchId     String?  @map("branch_id") // Bắt buộc có nếu role == MANAGER
  createdAt    DateTime @default(now()) @map("created_at")

  branch       Branch?             @relation(fields: [branchId], references: [id])
  reviews      Review[]
  interactions ReviewInteraction[]
  deletedLogs  ReviewDeletionLog[] @relation("ManagerDeletedLogs")
  bookings     BookingOrder[]

  @@map("users")
}

/// Bảng 6: Đơn Đặt bàn & Mua mang về qua Zalo (B phụ trách toàn bộ)
model BookingOrder {
  id           String        @id @default(uuid())
  branchId     String        @map("branch_id")
  userId       String?       @map("user_id") // Có thể null nếu khách đặt nhanh chưa login
  customerName String        @map("customer_name")
  zaloPhone    String        @map("zalo_phone")
  guestCount   Int           @default(1) @map("guest_count")
  type         BookingType
  details      String?       // Ghi chú thêm (nếu có)
  status       BookingStatus @default(NEW)
  createdAt    DateTime      @default(now()) @map("created_at")

  branch Branch @relation(fields: [branchId], references: [id])
  user   User?  @relation(fields: [userId], references: [id])

  @@map("bookings_orders")
}

// ==========================================
// PHẦN CỦA THÀNH VIÊN A CHỦ TRÌ (3 BẢNG)
// ==========================================

/// Bảng 3: Bài đánh giá của khách (A phụ trách toàn bộ)
model Review {
  id        String       @id @default(uuid())
  branchId  String       @map("branch_id")
  userId    String       @map("user_id")
  rating    Int          // Từ 1 đến 5 biểu tượng
  content   String
  mediaUrls Json         @default("[]") @map("media_urls") // Chuẩn cấu trúc IReviewMedia[]
  isEdited  Boolean      @default(false) @map("is_edited")
  status    ReviewStatus @default(ACTIVE)
  createdAt DateTime     @default(now()) @map("created_at")
  updatedAt DateTime     @updatedAt @map("updated_at")

  branch       Branch              @relation(fields: [branchId], references: [id])
  user         User                @relation(fields: [userId], references: [id])
  interactions ReviewInteraction[]
  deletionLog  ReviewDeletionLog?

  @@map("reviews")
}

/// Bảng 4: Lịch sử xóa đánh giá dành riêng cho Admin (A phụ trách toàn bộ)
model ReviewDeletionLog {
  id                 String   @id @default(uuid())
  reviewId           String   @unique @map("review_id")
  branchId           String   @map("branch_id")
  deletedByManagerId String   @map("deleted_by_manager_id")
  reviewSnapshot     Json     @map("review_snapshot") // Chuẩn cấu trúc IReviewSnapshot
  deletedAt          DateTime @default(now()) @map("deleted_at")

  review           Review @relation(fields: [reviewId], references: [id])
  branch           Branch @relation(fields: [branchId], references: [id])
  deletedByManager User   @relation("ManagerDeletedLogs", fields: [deletedByManagerId], references: [id])

  @@map("review_deletion_logs")
}

/// Bảng 5: Tương tác Bình luận & Thả cảm xúc (A phụ trách toàn bộ)
model ReviewInteraction {
  id           String          @id @default(uuid())
  reviewId     String          @map("review_id")
  userId       String          @map("user_id")
  type         InteractionType
  reactionType String?         @map("reaction_type") // VD: "LIKE", "LOVE", "YUMMY"
  replyContent String?         @map("reply_content")
  createdAt    DateTime        @default(now()) @map("created_at")

  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id])

  @@map("review_interactions")
}
```

---

## 3. HỢP ĐỒNG GIAO TIẾP (DATA CONTRACTS) TẠI 4 ĐIỂM CHẠM

Để code của A và B ráp vào nhau chạy ngay lập tức mà không cần sửa đi sửa lại, cả 2 bắt buộc tuân thủ các Interface dưới đây:

```typescript
// File: shared-contracts.ts (Dùng chung cho cả Backend và Frontend)

/**
 * 1. CHUẨN PAYLOAD CỦA JWT TOKEN (Điểm chạm số 3)
 * Thành viên A đóng gói khi Login -> Thành viên B đọc để phân quyền Chi nhánh & Đặt bàn.
 */
export interface IJwtPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'MANAGER' | 'ADMIN';
  branchId: string | null; // Bắt buộc có giá trị nếu role === 'MANAGER'
}

/**
 * 2. CHUẨN JSON CỘT `media_urls` TRONG BẢNG `reviews`
 * Thành viên A lưu khi upload lên Cloudinary/Cloudflare.
 */
export interface IReviewMedia {
  type: 'IMAGE' | 'VIDEO';
  url: string;          // Link ảnh .webp hoặc link luồng video .m3u8 (HLS)
  thumbnailUrl?: string; // Ảnh bìa cho video để load nhanh trên di động
}

/**
 * 3. CHUẨN JSON CỘT `review_snapshot` TRONG BẢNG `review_deletion_logs`
 * Thành viên A chụp lại khi Quản lý bấm xóa -> Hiển thị trong Modal của Admin.
 */
export interface IReviewSnapshot {
  originalReviewId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  rating: number;
  content: string;
  mediaUrls: IReviewMedia[];
  originalCreatedAt: string;
  deletionReason?: string;
}

/**
 * 4. CHUẨN ĐỒNG BỘ CHI NHÁNH TRÊN URL FRONTEND (Điểm chạm số 1)
 * Thành viên B khi làm thanh chọn Chi nhánh sẽ đẩy `branchId` lên URL Query Params:
 * Ví dụ: `https://laumamtramruoi.vn/?branchId=uuid-chi-nhanh-1`
 * Component <ReviewFeed /> của Thành viên A chỉ cần dùng `useSearchParams().get('branchId')`
 * để tự động gọi API tải lại danh sách đánh giá mà không cần đụng vào state của B.
 */

/**
 * 5. CHUẨN SỰ KIỆN SOCKET.IO CHO ĐẶT BÀN REALTIME (Thành viên B)
 * - Tên Room theo chi nhánh: `branch_room_${branchId}`
 * - Tên sự kiện phát xuống Quản lý: `new_booking_alert`
 */
```

---

## 4. QUY ĐỊNH BẮT BUỘC VỀ CHÚ THÍCH CODE (COMMENTING STANDARD)

**Quy tắc sắt:** Mọi hàm xử lý nghiệp vụ (Service), API Endpoint (Controller) và Component giao diện chính **BẮT BUỘC** phải có khối chú thích JSDoc tiếng Việt rõ ràng ở ngay phía trên, ghi rõ:
1. `@author`: Thành viên A hoặc Thành viên B (kèm mã Task).
2. `@description`: Giải thích hàm này làm gì và quy tắc nghiệp vụ bên trong.
3. Chú thích từng bước (`// Bước 1:`, `// Bước 2:`) đối với các logic phức tạp.

### Mẫu Code Chuẩn Bắt Buộc Tuân Thủ (Dành cho Thành viên A - Nghiệp vụ Xóa & Tính lại sao):

```typescript
// File: backend-nestjs/src/modules/reviews/reviews.service.ts

/**
 * @author Thành viên A (Task A3.1)
 * @description Nghiệp vụ Quản lý chi nhánh (Role 2) xóa bài đánh giá vi phạm/spam.
 * @business_rule
 *  1. Quản lý chỉ được xóa bài thuộc đúng chi nhánh của mình (`manager.branchId`).
 *  2. Chuyển trạng thái bài đánh giá sang `DELETED_BY_MANAGER` (không xóa vật lý để giữ khóa ngoại).
 *  3. Lưu bản chụp (Snapshot) toàn bộ nội dung gốc, ảnh/video vào bảng `review_deletion_logs` cho Admin kiểm tra.
 *  4. TÍNH LẠI NGAY LẬP TỨC điểm sao trung bình (`avgRating`) và tổng số bài (`totalActiveReviews`) của chi nhánh.
 * @param reviewId ID của bài đánh giá cần xóa
 * @param manager Thông tin Quản lý đang đăng nhập lấy từ JWT
 */
async deleteReviewByManager(reviewId: string, manager: IJwtPayload) {
  // Bước 1: Kiểm tra bài đánh giá có tồn tại và thuộc chi nhánh của Quản lý này không
  const review = await this.prisma.review.findUnique({
    where: { id: reviewId },
    include: { user: true },
  });

  if (!review || review.branchId !== manager.branchId) {
    throw new ForbiddenException('Bạn chỉ có quyền xóa đánh giá tại chi nhánh mình quản lý!');
  }

  // Bước 2: Thực thi Database Transaction để đảm bảo tính toàn vẹn dữ liệu 100%
  return await this.prisma.$transaction(async (tx) => {
    // 2.1. Đánh dấu bài viết đã bị xóa bởi Quản lý
    await tx.review.update({
      where: { id: reviewId },
      data: { status: 'DELETED_BY_MANAGER' },
    });

    // 2.2. Lưu bản chụp (Snapshot) vào bảng Lịch sử xóa cho Admin (Role 3) xem lại
    const snapshotData: IReviewSnapshot = {
      originalReviewId: review.id,
      authorName: review.user.fullName,
      authorEmail: review.user.email,
      authorAvatar: review.user.avatarUrl,
      rating: review.rating,
      content: review.content,
      mediaUrls: review.mediaUrls as unknown as IReviewMedia[],
      originalCreatedAt: review.createdAt.toISOString(),
    };

    await tx.reviewDeletionLog.create({
      data: {
        reviewId: review.id,
        branchId: review.branchId,
        deletedByManagerId: manager.userId,
        reviewSnapshot: snapshotData as any,
      },
    });

    // 2.3. Tính toán lại điểm trung bình sao CHỈ TRÊN CÁC ĐÁNH GIÁ CÒN ACTIVE (Điểm chạm số 2 với Thành viên B)
    const aggregateResult = await tx.review.aggregate({
      where: {
        branchId: review.branchId,
        status: 'ACTIVE',
      },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newAvgRating = aggregateResult._avg.rating
      ? Number(aggregateResult._avg.rating.toFixed(1))
      : 0;
    const newTotalActive = aggregateResult._count.id;

    // 2.4. Cập nhật điểm sao mới vào bảng `branches` để giao diện của Thành viên B hiển thị đúng
    const updatedBranch = await tx.branch.update({
      where: { id: review.branchId },
      data: {
        avgRating: newAvgRating,
        totalActiveReviews: newTotalActive,
      },
    });

    return {
      message: 'Đã xóa đánh giá và cập nhật lại điểm sao chi nhánh thành công.',
      newAvgRating: updatedBranch.avgRating,
      newTotalActiveReviews: updatedBranch.totalActiveReviews,
    };
  });
}
```

### Mẫu Code Chuẩn Bắt Buộc Tuân Thủ (Dành cho Thành viên B - Nghiệp vụ Đặt bàn Realtime):

```typescript
// File: backend-nestjs/src/modules/bookings/bookings.service.ts

/**
 * @author Thành viên B (Task B3.1)
 * @description Nghiệp vụ Khách (Role 1) gửi yêu cầu Đặt bàn / Mua mang về qua SĐT Zalo.
 * @business_rule
 *  1. Lưu đơn vào bảng `bookings_orders` với trạng thái `NEW`.
 *  2. Bắn sự kiện WebSockets (Socket.io) vào đúng phòng của chi nhánh (`branch_room_${branchId}`)
 *     để màn hình của Quản lý chi nhánh đó lập tức kêu "Ting" và hiện thông tin đơn.
 * @param dto Dữ liệu form đặt bàn (branchId, customerName, zaloPhone, guestCount, type)
 */
async createBookingAndNotifyManager(dto: CreateBookingDto) {
  // Bước 1: Lưu đơn đặt bàn/mua mang về vào PostgreSQL
  const newBooking = await this.prisma.bookingOrder.create({
    data: {
      branchId: dto.branchId,
      customerName: dto.customerName,
      zaloPhone: dto.zaloPhone,
      guestCount: dto.guestCount,
      type: dto.type,
      details: dto.details,
      status: 'NEW',
    },
  });

  // Bước 2: Phát tín hiệu Realtime ("Ting") xuống đúng Quản lý của chi nhánh đó
  const roomName = `branch_room_${dto.branchId}`;
  this.bookingGateway.server.to(roomName).emit('new_booking_alert', {
    bookingId: newBooking.id,
    customerName: newBooking.customerName,
    zaloPhone: newBooking.zaloPhone,
    guestCount: newBooking.guestCount,
    type: newBooking.type,
    createdAt: newBooking.createdAt,
  });

  return newBooking;
}
```

---

## 5. QUY TRÌNH GIT & PUSH CODE KHÔNG BAO GIỜ XUNG ĐỘT

### 5.1. Quy tắc đặt tên Nhánh (Branch Naming)
Tuyệt đối **KHÔNG** code trực tiếp trên nhánh `main` hoặc `develop`. Mỗi thành viên tạo nhánh riêng theo đúng mã Task của mình:
* **Thành viên A:**
  * `feat/A1-google-one-tap-auth`
  * `feat/A2-reviews-media-hls`
  * `feat/A3-manager-delete-and-admin-logs`
* **Thành viên B:**
  * `feat/B1-mobile-layout-and-branches`
  * `feat/B2-admin-manage-staff-role2`
  * `feat/B3-zalo-booking-realtime-socket`

### 5.2. Quy tắc Commit Message
Bắt buộc ghi tiền tố `[A]` hoặc `[B]` kèm mã Task ở đầu mỗi câu lệnh commit để dễ tra cứu lịch sử:
* `git commit -m "[A][Task-A2.1] feat: tích hợp presigned url upload ảnh webp và video hls"`
* `git commit -m "[B][Task-B3.1] feat: hoàn thiện socket bắn thông báo đặt bàn zalo theo chi nhánh"`

### 5.3. Quy trình 4 Bước Trước Khi Push & Merge Code
Trước khi đẩy code lên tạo Pull Request (PR) vào nhánh `develop`, cả A và B bắt buộc chạy đúng 4 lệnh sau:
```bash
# Bước 1: Lưu các file đang làm ở nhánh của mình
git add .
git commit -m "[A/B][Task-...] mô tả ngắn gọn"

# Bước 2: Kéo code mới nhất từ nhánh chung (develop) về máy để kiểm tra
git fetch origin
git rebase origin/develop

# Bước 3: Chạy thử lệnh build để chắc chắn không có lỗi TypeScript hay thiếu thư viện
npm run build

# Bước 4: Đẩy nhánh của mình lên GitHub/GitLab và tạo Pull Request
git push origin <tên-nhánh-của-bạn>
```

---

## 6. CHECKLIST KIỂM TRA TRƯỚC KHI PUSH (DEFINITION OF DONE)

Trước khi bấm `git push`, mỗi thành viên tự kiểm tra nhanh 5 gạch đầu dòng sau:
- [ ] **Không chạm vào thư mục của người kia:** A không sửa các file trong `branches/`, `users/`, `bookings/`; B không sửa các file trong `auth/`, `reviews/`, `deletion-logs/`.
- [ ] **Đầy đủ chú thích tiếng Việt:** Mọi hàm mới viết đã có đầy đủ khối chú thích `@author`, `@description` và chú thích từng bước xử lý (`// Bước 1:`, `// Bước 2:`).
- [ ] **Đúng quy tắc nghiệp vụ cốt lõi:**
  - Giao diện của Khách (Role 1) chỉ có nút **"Chỉnh sửa"**, hoàn toàn không có nút xóa đánh giá.
  - Khi Quản lý (Role 2) xóa bài, điểm `avg_rating` của chi nhánh giảm/tăng lại ngay lập tức và lưu đủ dữ liệu vào `review_deletion_logs`.
- [ ] **Cài thêm thư viện (`package.json`):** Nếu có chạy `npm install <thư-viện>`, phải nhắn ngay vào nhóm chat cho người kia biết để người kia `git pull` về chạy `npm install`.