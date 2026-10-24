/**
 * @file frontend-nextjs/src/lib/api.ts
 * @description Trạm trung chuyển kết nối API giữa Next.js Frontend và NestJS Backend.
 * @author Dung chung cho Thanh Vien A & B
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Hàm gọi API tổng quát, tự động đính kèm Token và xử lý dữ liệu JSON
 * @param endpoint Tuyến đường API (VD: '/auth/login', '/reviews')
 * @param options Cấu hình request (method, body, headers...)
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  // Bước 1: Ghép các tham số Query Params vào URL (nếu có, VD: ?branchId=...&page=1)
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Bước 2: Tự động trích xuất Token từ localStorage (nếu người dùng đã đăng nhập)
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }

  // Bước 3: Thiết lập các tiêu đề (Headers) gửi đi
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // Bước 4: Thực hiện gửi yêu cầu HTTP
  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  // Bước 5: Bóc tách dữ liệu phản hồi
  const data = await response.json().catch(() => ({}));

  // Nếu server trả về lỗi (mã status >= 400), ném ra lỗi để giao diện bắt và hiển thị
  if (!response.ok) {
    const errorMessage =
      Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Có lỗi xảy ra, vui lòng thử lại!';
    throw new Error(errorMessage);
  }

  return data as T;
}
