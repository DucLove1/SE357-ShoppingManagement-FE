import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ArrowLeft, Star, Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WriteReviewProps {
  productId?: string;
  productName: string;
  productImage: string;
  orderId: string;
  onBack: () => void;
  existingReview?: {
    id: string;
    rating: number;
    comment: string;
    images?: string[];
  };
}

export function WriteReview({ productId, productName, productImage, orderId, onBack, existingReview }: WriteReviewProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingReview?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!existingReview;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedImages.length + files.length > 5) {
      toast.error('Tối đa 5 ảnh');
      return;
    }

    // Simulate image upload - in real app, upload to server
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isEditMode ? 'Đã cập nhật đánh giá thành công!' : 'Đã gửi đánh giá thành công!');
      onBack();
    }, 1500);
  };

  const ratingLabels = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];

  return (
    <div className="min-h-screen bg-gray-50 pb-6 sm:pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 shadow-sm">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold">{isEditMode ? 'Sửa đánh giá' : 'Viết đánh giá'}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-3 sm:p-4 max-w-3xl space-y-4">
        {/* Product Info */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex gap-3 items-center">
              <div className="text-4xl sm:text-5xl">{productImage}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">{productName}</h3>
                <p className="text-xs sm:text-sm text-gray-500">Đơn hàng #{orderId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Đánh giá của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Chất lượng sản phẩm</Label>
              <div className="flex flex-col items-center py-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 active:scale-95"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-8 w-8 sm:h-10 sm:w-10 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {(hoverRating || rating) > 0 && (
                  <div className="text-center">
                    <p className="font-semibold text-amber-700">
                      {ratingLabels[(hoverRating || rating) - 1]}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      {hoverRating || rating} sao
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm sm:text-base">
                Nhận xét của bạn <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comment"
                placeholder="Hãy chia sẻ cảm nhận, đánh giá của bạn về sản phẩm này..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="resize-none text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500">
                {comment.length}/500 ký tự
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm sm:text-base">Thêm hình ảnh</Label>
                <Badge variant="outline" className="text-xs">
                  Tối đa 5 ảnh
                </Badge>
              </div>

              {/* Upload Button */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={image}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {uploadedImages.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mb-1" />
                    <span className="text-[10px] sm:text-xs text-gray-500 text-center px-1">Thêm ảnh</span>
                  </label>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Hướng dẫn chụp ảnh:</p>
                    <ul className="space-y-0.5 ml-3">
                      <li>• Chụp ảnh thực tế sản phẩm bạn nhận được</li>
                      <li>• Hình ảnh rõ ràng, đủ ánh sáng</li>
                      <li>• Giúp người mua khác tham khảo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-3 sm:p-4">
            <h4 className="font-semibold text-sm sm:text-base text-green-900 mb-2">
              💡 Mẹo viết đánh giá hữu ích
            </h4>
            <ul className="text-xs sm:text-sm text-green-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Chia sẻ trải nghiệm thực tế của bạn về sản phẩm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Nêu rõ ưu điểm và nhược điểm (nếu có)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Đánh giá khách quan, trung thực</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Thêm hình ảnh thực tế để tăng độ tin cậy</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 sm:static bg-white sm:bg-transparent p-3 sm:p-0 border-t sm:border-0 -mx-3 sm:mx-0">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {isEditMode ? 'Đang cập nhật...' : 'Đang gửi...'}
              </>
            ) : (
              isEditMode ? 'Cập nhật đánh giá' : 'Gửi đánh giá'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
