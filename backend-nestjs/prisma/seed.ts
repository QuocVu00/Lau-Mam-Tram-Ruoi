/**
 * @file backend-nestjs/prisma/seed.ts
 * @description Kịch bản gieo mầm dữ liệu mẫu ban đầu (Seed data) cho hệ thống Lẩu Mắm Trăm Rưỡi.
 * @author Thanh Vien A
 */

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang gieo mầm dữ liệu ban đầu...');

  // Bước 1: Tạo chi nhánh đầu tiên (Chi nhánh Quận 1)
  const branchQ1 = await prisma.branch.upsert({
    where: { id: 'branch-q1-uuid-demo' },
    update: {},
    create: {
      id: 'branch-q1-uuid-demo',
      name: 'Lẩu Mắm Trăm Rưỡi - Chi nhánh Quận 1',
      address: '150 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
      phone: '0901234567',
      avgRating: 5.0,
      totalActiveReviews: 0,
    },
  });
  console.log(`✅ Đã tạo chi nhánh: ${branchQ1.name}`);

  // Bước 1b: Tạo chi nhánh thứ 2 (Chi nhánh Bình Thạnh)
  const branchQ2 = await prisma.branch.upsert({
    where: { id: 'b2-default' },
    update: {},
    create: {
      id: 'b2-default',
      name: 'Lẩu Mắm Trăm Rưỡi - Bình Thạnh',
      address: '280 Phan Xích Long nối dài, Phường 2, Q. Phú Nhuận, TP.HCM',
      phone: '0909 150 151',
      avgRating: 4.8,
      totalActiveReviews: 0,
    },
  });
  console.log(`✅ Đã tạo chi nhánh: ${branchQ2.name}`);

  // Bước 2: Băm mật khẩu bằng thuật toán bcrypt (độ khó vòng lặp: 10)
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const managerPasswordHash = await bcrypt.hash('manager123', 10);

  // Bước 3: Tạo tài khoản Quản trị viên tối cao (Role 3: ADMIN)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@laumam.vn' },
    update: {},
    create: {
      email: 'admin@laumam.vn',
      fullName: 'Quản Trị Viên Tối Cao',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      branchId: null, // Admin quản lý toàn chuỗi nên không thuộc riêng chi nhánh nào
    },
  });
  console.log(`✅ Đã tạo tài khoản Admin: ${admin.email} (Mật khẩu: admin123)`);

  // Bước 4: Tạo tài khoản Quản lý chi nhánh Quận 1 (Role 2: MANAGER)
  const manager = await prisma.user.upsert({
    where: { email: 'manager.q1@laumam.vn' },
    update: {},
    create: {
      email: 'manager.q1@laumam.vn',
      fullName: 'Nguyễn Văn Quản Lý (Q1)',
      passwordHash: managerPasswordHash,
      role: Role.MANAGER,
      branchId: branchQ1.id, // Bắt buộc gán vào chi nhánh Quận 1
    },
  });
  console.log(`✅ Đã tạo tài khoản Quản lý: ${manager.email} (Mật khẩu: manager123)`);

  // Bước 5: Tạo tài khoản khách hàng mẫu và bài đánh giá đầu tiên
  const customer = await prisma.user.upsert({
    where: { email: 'khachhang@gmail.com' },
    update: {},
    create: {
      email: 'khachhang@gmail.com',
      fullName: 'Hoàng Long (Thực khách)',
      passwordHash: await bcrypt.hash('123456', 10),
      role: Role.CUSTOMER,
    },
  });

  await prisma.review.createMany({
    data: [
      {
        branchId: branchQ1.id,
        userId: customer.id,
        rating: 5,
        content: 'Nước lẩu mắm đậm đà chuẩn vị miền Tây sông nước! Hải sản tươi rói ăn cùng 12 loại rau đồng xanh mướt giòn rụm.',
        mediaUrls: [
          { type: 'IMAGE', url: '/images/menu-lau-mam-1.jpg' },
          { type: 'IMAGE', url: '/images/menu-lau-mam-2.jpg' },
        ],
        status: 'ACTIVE',
      },
      {
        branchId: branchQ1.id,
        userId: customer.id,
        rating: 5,
        content: 'Quán sạch sẽ mát mẻ, set 150k ăn bao no cho 2 người. Đặt bàn qua app và nhận đơn ngay lập tức!',
        mediaUrls: [
          { type: 'IMAGE', url: '/images/menu-lau-mam-1.jpg' },
        ],
        status: 'ACTIVE',
      },
    ],
    skipDuplicates: true,
  });

  // Cập nhật lại số lượng bài đánh giá
  await prisma.branch.update({
    where: { id: branchQ1.id },
    data: { totalActiveReviews: 2, avgRating: 5.0 },
  });

  console.log('🎉 Hoàn tất gieo mầm dữ liệu!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi gieo mầm dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
