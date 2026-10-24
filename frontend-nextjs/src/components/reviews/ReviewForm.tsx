/**
 * @file frontend-nextjs/src/components/reviews/ReviewForm.tsx
 * @description Form viết bài đánh giá dành cho Khách hàng:
 * Hỗ trợ chọn tệp từ thư viện, chụp ảnh và quay video trực tiếp bằng camera thiết bị di động.
 * @author Thanh Vien A (Task A2.2)
 */

'use client';

import { useState, useRef } from 'react';
import { Star, Image as ImageIcon, Camera, Video, X, Send, Play } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { IReviewMedia } from '@/lib/contracts';

// Kiểu dữ liệu lưu trữ media tạm thời trên bộ nhớ trình duyệt của khách
interface LocalMediaItem {
  type: 'IMAGE' | 'VIDEO'; // Phân loại hình ảnh hay video
  url: string;             // Đường dẫn URL tạm (Blob URL) để xem trước ngay lập tức
  file: File;              // File gốc thu thập từ camera hoặc thư viện máy
}

interface ReviewFormProps {
  branchId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ReviewForm({ branchId, onSuccess, onClose }: ReviewFormProps) {
  // 1. Quản lý trạng thái đánh giá: Số sao (1 - 5) và hiệu ứng hover
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // 2. Nội dung lời nhận xét món ăn của thực khách
  const [content, setContent] = useState<string>('');

  // 3. Danh sách các file ảnh/video khách đã chọn hoặc vừa chụp/quay
  const [mediaList, setMediaList] = useState<LocalMediaItem[]>([]);

  // 4. Trạng thái gửi và thông báo lỗi
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 5. Khởi tạo Ref liên kết đến các thẻ <input type="file" /> ẩn bên dưới
  const galleryInputRef = useRef<HTMLInputElement | null>(null);    // Input chọn từ thư viện
  const cameraPhotoInputRef = useRef<HTMLInputElement | null>(null); // Input kích hoạt camera chụp ảnh
  const cameraVideoInputRef = useRef<HTMLInputElement | null>(null); // Input kích hoạt camera quay video

  /**
   * Hàm xử lý khi khách chọn file hoặc vừa chụp/quay xong
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Giới hạn tối đa 5 file phương tiện cho một bài viết để tối ưu hiệu năng
    if (mediaList.length + files.length > 5) {
      setError('Bạn chỉ có thể đính kèm tối đa 5 ảnh hoặc video cho mỗi bài đánh giá!');
      return;
    }

    const newItems: LocalMediaItem[] = [];

    Array.from(files).forEach((file) => {
      // Nhận diện loại file: nếu MIME type bắt đầu bằng 'video/' thì là VIDEO, ngược lại là IMAGE
      const isVideo = file.type.startsWith('video/');
      const mediaType: 'IMAGE' | 'VIDEO' = isVideo ? 'VIDEO' : 'IMAGE';

      // Tạo Blob URL xem trước ngay lập tức trên máy khách mà không cần mạng
      const previewUrl = URL.createObjectURL(file);

      newItems.push({
        type: mediaType,
        url: previewUrl,
        file: file,
      });
    });

    // Cập nhật danh sách hiển thị
    setMediaList((prev) => [...prev, ...newItems]);
    setError('');

    // Đặt lại giá trị input để có thể chọn lại file nếu muốn
    e.target.value = '';
  };

  /**
   * Hàm xóa một ảnh/video khỏi danh sách đính kèm
   */
  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => {
      // Hủy đường dẫn Blob khỏi RAM trình duyệt để chống rò rỉ bộ nhớ
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  /**
   * Hàm gửi bài đánh giá lên server
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra độ dài nội dung hợp lệ
    if (content.trim().length < 5) {
      setError('Nội dung đánh giá phải có ít nhất 5 ký tự!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Chuẩn hóa danh sách media sang hợp đồng IReviewMedia của Backend
      const formattedMedia: IReviewMedia[] = mediaList.map((item) => ({
        type: item.type,
        url: item.url, // URL ảnh/video xem trước hoặc CDN
      }));

      // Gọi API POST /reviews của Backend NestJS
      await apiClient('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          branchId,
          rating,
          content: content.trim(),
          mediaUrls: formattedMedia,
        }),
      });

      // Báo thành công và đóng form
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Bạn cần đăng nhập để gửi bài đánh giá!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Modal trượt từ dưới lên (Bottom Sheet) chuẩn thao tác ngón cái trên Mobile */}
      <div className="w-full sm:max-w-md bg-stone-900 text-stone-100 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-stone-800 animate-slideUp sm:animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Viết đánh giá món ăn</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Báo lỗi nếu có */}
        {error && (
          <div className="mt-3 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* 1. Khu vực chọn số sao (1 - 5 sao) */}
          <div className="text-center py-1">
            <p className="text-xs text-stone-400 mb-2 font-medium">Bạn chấm món lẩu mắm hôm nay mấy sao?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform active:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300">
              {rating === 5 && 'Tuyệt vời, ngon chuẩn vị miền Tây! 🍲'}
              {rating === 4 && 'Rất ngon, phục vụ chu đáo! 👍'}
              {rating === 3 && 'Tạm ổn, cần cải thiện thêm! 👌'}
              {rating === 2 && 'Chưa được ngon lắm! 😐'}
              {rating === 1 && 'Rất thất vọng! 👎'}
            </span>
          </div>

          {/* 2. Ô nhập cảm nhận thực khách */}
          <div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nước lẩu hôm nay thế nào? Cá, tôm, mực và các loại rau đồng có tươi ngon không?..."
              required
              className="w-full p-3.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500 placeholder-stone-500 resize-none transition-all"
            />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* CÁC THẺ INPUT FILE ẨN HỖ TRỢ CHỤP ẢNH / QUAY VIDEO / THƯ VIỆN */}
          {/* ------------------------------------------------------------- */}

          {/* Thẻ 1: Lấy ảnh hoặc video từ thư viện máy */}
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />

          {/* Thẻ 2: Bật Camera chụp ảnh trực tiếp (capture="environment" chọn camera sau) */}
          <input
            type="file"
            ref={cameraPhotoInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Thẻ 3: Bật Camera quay video trực tiếp */}
          <input
            type="file"
            ref={cameraVideoInputRef}
            onChange={handleFileChange}
            accept="video/*"
            capture="environment"
            className="hidden"
          />

          {/* 3 Nút bấm đính kèm theo thao tác di động */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">
              Đính kèm hình ảnh hoặc video trải nghiệm:
            </label>

            <div className="grid grid-cols-3 gap-2">
              {/* Nút 1: Thư viện */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="py-2.5 px-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] font-medium">Thư viện</span>
              </button>

              {/* Nút 2: Chụp ảnh trực tiếp */}
              <button
                type="button"
                onClick={() => cameraPhotoInputRef.current?.click()}
                className="py-2.5 px-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-rose-400" />
                <span className="text-[11px] font-medium">Chụp ảnh</span>
              </button>

              {/* Nút 3: Quay video trực tiếp */}
              <button
                type="button"
                onClick={() => cameraVideoInputRef.current?.click()}
                className="py-2.5 px-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <Video className="w-5 h-5 text-sky-400" />
                <span className="text-[11px] font-medium">Quay video</span>
              </button>
            </div>

            {/* Khu vực xem trước (Preview) ảnh/video sau khi chọn */}
            {mediaList.length > 0 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-2 pt-1">
                {mediaList.map((media, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500/50 flex-shrink-0 bg-black group"
                  >
                    {media.type === 'IMAGE' ? (
                      <img
                        src={media.url}
                        alt="Ảnh món ăn"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <video
                          src={media.url}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    )}

                    {/* Nút xóa ảnh/video */}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/80 text-white rounded-full hover:bg-red-600 transition-all shadow-md cursor-pointer"
                      title="Xóa tệp này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nút Gửi bài đánh giá */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition-all disabled:opacity-60 active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Gửi bài đánh giá</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
