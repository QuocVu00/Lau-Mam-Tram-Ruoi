import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';

/**
 * @author Thành viên B (Task B1.2)
 * @description Module quản lý Chi nhánh của hệ thống Lẩu Mắm Trăm Rưỡi.
 */
@Module({
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
