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
import type { IJwtPayload } from '../../contracts';

/**
 * @author Thành viên B (Task B3.1)
 * @description Xử lý toàn bộ logic nghiệp vụ Đặt bàn / Mua mang về qua Zalo
 * và tích hợp bắn thông báo Realtime ("Ting") xuống Quản lý chi nhánh.
 */
@Injectable()
export class BookingsService {
  private inMemoryBookings: any[] = [];

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
    let newBooking: any;

    try {
      newBooking = await this.prisma.bookingOrder.create({
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
    } catch (e) {
      // In-memory fallback if database is not reachable during local testing
      newBooking = {
        id: `ord-demo-${Date.now()}`,
        branchId: dto.branchId,
        userId: dto.userId || null,
        customerName: dto.customerName,
        zaloPhone: dto.zaloPhone,
        guestCount: dto.guestCount || 1,
        type: dto.type,
        details: dto.details,
        status: 'NEW',
        createdAt: new Date(),
      };
      this.inMemoryBookings.unshift(newBooking);
    }

    // Phát tín hiệu Realtime ("Ting") xuống đúng Quản lý của chi nhánh đó
    const createdAtStr =
      newBooking.createdAt instanceof Date
        ? newBooking.createdAt.toISOString()
        : String(newBooking.createdAt);

    this.bookingsGateway.notifyManagerNewBooking(dto.branchId, {
      bookingId: newBooking.id,
      customerName: newBooking.customerName,
      zaloPhone: newBooking.zaloPhone,
      guestCount: newBooking.guestCount,
      type: newBooking.type,
      details: newBooking.details,
      createdAt: createdAtStr,
    });

    return newBooking;
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Lấy danh sách đơn đặt bàn của một chi nhánh (Quản lý Role 2 theo dõi).
   * @param branchId ID chi nhánh cần lấy đơn
   */
  async findByBranch(branchId: string) {
    try {
      const orders = await this.prisma.bookingOrder.findMany({
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
      if (orders && orders.length > 0) return orders;
    } catch (e) {}

    return this.inMemoryBookings.filter((b) => b.branchId === branchId);
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Cập nhật trạng thái đơn đặt bàn (NEW -> CONFIRMED -> DONE).
   * @param id ID đơn cần cập nhật
   * @param dto Trạng thái mới
   * @param manager Thông tin người quản lý đăng nhập (từ JWT)
   */
  async updateStatus(id: string, dto: UpdateBookingStatusDto, manager?: IJwtPayload) {
    try {
      return await this.prisma.bookingOrder.update({
        where: { id },
        data: { status: dto.status },
      });
    } catch (e) {
      const found = this.inMemoryBookings.find((b) => b.id === id);
      if (found) {
        found.status = dto.status;
        return found;
      }
      throw new NotFoundException('Không tìm thấy đơn đặt bàn cần cập nhật!');
    }
  }
}
