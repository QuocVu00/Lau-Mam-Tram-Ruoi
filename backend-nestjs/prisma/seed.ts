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
