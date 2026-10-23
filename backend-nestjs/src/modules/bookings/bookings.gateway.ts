import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * @author Thành viên B (Task B3.1)
 * @description WebSocket Gateway (Socket.io) xử lý giao tiếp thời gian thực
 * giữa Khách hàng và Quản lý chi nhánh cho luồng Đặt bàn / Mua mang về.
 */
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BookingsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected to Socket.io: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected from Socket.io: ${client.id}`);
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Quản lý chi nhánh gửi sự kiện này khi vào trang quản trị
   * để tham gia vào đúng phòng (Room) của chi nhánh mình.
   */
  @SubscribeMessage('join_branch_room')
  handleJoinBranchRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { branchId: string },
  ) {
    if (data?.branchId) {
      const roomName = `branch_room_${data.branchId}`;
      client.join(roomName);
      console.log(`📍 Manager [${client.id}] joined room: ${roomName}`);
      return { event: 'joined_room', status: 'success', room: roomName };
    }
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Rời khỏi phòng chi nhánh khi chuyển trang hoặc đăng xuất.
   */
  @SubscribeMessage('leave_branch_room')
  handleLeaveBranchRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { branchId: string },
  ) {
    if (data?.branchId) {
      const roomName = `branch_room_${data.branchId}`;
      client.leave(roomName);
      console.log(`🚪 Manager [${client.id}] left room: ${roomName}`);
    }
  }

  /**
   * @author Thành viên B (Task B3.1)
   * @description Bắn thông báo đơn mới ("Ting") xuống đúng phòng Quản lý chi nhánh đó.
   */
  notifyManagerNewBooking(branchId: string, bookingData: any) {
    const roomName = `branch_room_${branchId}`;
    this.server.to(roomName).emit('new_booking_alert', bookingData);
    console.log(`🔔 Emitted 'new_booking_alert' to ${roomName} for booking ${bookingData.bookingId}`);
  }
}
