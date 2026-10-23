/**
 * @file backend-nestjs/src/main.ts
 * @description Điểm khởi chạy (Entry point) của ứng dụng Backend NestJS.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Khởi tạo ứng dụng NestJS từ AppModule gốc
  const app = await NestFactory.create(AppModule);

  // 1. Cho phép Frontend (Next.js chạy ở cổng 3000) có thể gọi API sang Backend mà không bị lỗi CORS
  app.enableCors({
    origin: true, // Cho phép các domain từ Frontend gửi request
    credentials: true,
  });

  // 2. Kích hoạt bộ kiểm tra dữ liệu đầu vào tự động (ValidationPipe)
  // Nếu client gửi dữ liệu sai kiểu (VD: số sao là chữ, email sai định dạng), NestJS tự động báo lỗi ngay
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Tự động loại bỏ các trường không được khai báo trong DTO (chống hack)
      transform: true,            // Tự động ép kiểu dữ liệu về đúng kiểu khai báo (VD: chuỗi "5" -> số 5)
      forbidNonWhitelisted: true, // Báo lỗi nếu client cố tình gửi các trường lạ
    }),
  );

  // Đọc cổng chạy từ file .env hoặc dùng cổng mặc định 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend Lẩu Mắm Trăm Rưỡi đang chạy tại: http://localhost:${port}`);
}

bootstrap();
