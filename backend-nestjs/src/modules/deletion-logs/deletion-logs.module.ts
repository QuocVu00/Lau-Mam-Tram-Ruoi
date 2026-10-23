/**
 * @file backend-nestjs/src/modules/deletion-logs/deletion-logs.module.ts
 * @description Đóng gói Module Lịch sử xóa của Thành viên A.
 * @author Thanh Vien A (Task A3.1)
 */

import { Module } from '@nestjs/common';
import { DeletionLogsService } from './deletion-logs.service';
import { DeletionLogsController } from './deletion-logs.controller';

@Module({
  controllers: [DeletionLogsController],
  providers: [DeletionLogsService],
  exports: [DeletionLogsService],
})
export class DeletionLogsModule {}
