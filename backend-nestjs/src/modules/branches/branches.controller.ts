import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Role } from '@prisma/client';
import { Roles, RolesGuard, JwtAuthGuard } from '../../common';

/**
 * @author Thành viên B (Task B1.2)
 * @description Controller cung cấp API quản lý danh sách và thông tin các chi nhánh.
 */
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  /**
   * @author Thành viên B (Task B1.2)
   * @description Lấy danh sách tất cả các chi nhánh (Công khai cho cả Khách và Quản trị).
   * @endpoint GET /branches
   */
  @Get()
  async findAll() {
    return this.branchesService.findAll();
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Lấy chi tiết thông tin một chi nhánh theo ID.
   * @endpoint GET /branches/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Tạo chi nhánh mới (Chỉ dành cho Super Admin - Role 3).
   * @endpoint POST /branches
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateBranchDto) {
    return this.branchesService.create(dto);
  }

  /**
   * @author Thành viên B (Task B1.2)
   * @description Cập nhật thông tin chi nhánh (Chỉ dành cho Super Admin - Role 3).
   * @endpoint PATCH /branches/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchesService.update(id, dto);
  }
}
