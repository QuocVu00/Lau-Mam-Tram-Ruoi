import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingsGateway } from './bookings.gateway';
import { IJwtPayload } from '../../../../shared/contracts';

/**
 * @author Thành viên B (Task B3.1)
 * @description Xử lý toàn bộ logic nghiệp vụ Đặt bàn / Mua mang về qua Zalo
 * và tích hợp bắn thông báo Realtime ("Ting") xuống Quản lý chi nhánh.
 */
@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingsGateway: BookingsGateway,
  ) {}

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
    // Bước 1: Kiểm tra xem chi nhánh khách chọn có tồn tại không
    const branch = await this.prisma.branch.findUnique({
      where: { id: dto.branchId },
    });

    if (!branch) {
      throw new BadRequestException('Chi nhánh được chọn không tồn tại trong hệ thống!');
    }

    // Bước 2: Lưu đơn đặt bàn/mua mang về vào PostgreSQL
    const newBooking = await this.prisma.bookingOrder.create({
      data: {
        branchId: dto.branchId,
        userId: dto.userId || null,
        customerName: dto.customerName,
        zaloPhone: dto.zaloPhone,
        guestCount: dto.guestCount || 1,
        type: dto.type,
        details: dto.details,
        status: 'NEW',
      },
    });

    // Bước 3: Phát tín hiệu Realtime ("Ting") xuống đúng Quản lý của chi nhánh đó
    this.bookingsGateway.notifyManagerNewBooking(dto.branchId, {
      bookingId: newBooking.id,
      customerName: newBooking.customerName,
      zaloPhone: newBooking.zaloPhone,
      guestCount: newBooking.guestCount,
      type: newBooking.type,
      details: newBooking.details,
      createdAt: newBooking.createdAt.toISOString(),
    });

    return newBooking;
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Lấy danh sách đơn đặt bàn của một chi nhánh (Quản lý Role 2 theo dõi).
   * @param branchId ID chi nhánh cần lấy đơn
   */
  async findByBranch(branchId: string) {
    return this.prisma.bookingOrder.findMany({
      where: { branchId },
      orderBy: { createdAt: 'desc' },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Cập nhật trạng thái đơn đặt bàn (NEW -> CONFIRMED -> DONE).
   * @param id ID đơn cần cập nhật
   * @param dto Trạng thái mới
   * @param manager Thông tin người quản lý đăng nhập (từ JWT)
   */
  async updateStatus(id: string, dto: UpdateBookingStatusDto, manager?: IJwtPayload) {
    // Bước 1: Kiểm tra đơn có tồn tại không
    const booking = await this.prisma.bookingOrder.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt bàn cần cập nhật!');
    }

    // Bước 2: Nếu là Quản lý (Role 2), chỉ được cập nhật đơn thuộc chi nhánh của mình
    if (manager && manager.role === 'MANAGER' && manager.branchId !== booking.branchId) {
      throw new ForbiddenException('Bạn chỉ có quyền cập nhật đơn tại chi nhánh mình quản lý!');
    }

    // Bước 3: Cập nhật trạng thái mới vào cơ sở dữ liệu
    return this.prisma.bookingOrder.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
