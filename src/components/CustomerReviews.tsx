import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  createdAt: string;
  canEdit: boolean;
}

const mockReviews: Review[] = [
  {
    id: '1',
    orderNumber: 'DH008',
    productName: 'Áo khoác hoodie',
    productImage: '🧥',
    rating: 5,
    comment: 'Sản phẩm rất đẹp và chất lượng tốt. Giao hàng nhanh. Sẽ ủng hộ shop!',
    createdAt: '2025-11-07',
    canEdit: true,
  },
  {
    id: '2',
    orderNumber: 'DH006',
    productName: 'Túi xách nữ da PU',
    productImage: '👜',
    rating: 4,
    comment: 'Túi đẹp nhưng có một chút mùi. Tổng thể vẫn ổn.',
    createdAt: '2025-11-05',
    canEdit: true,
  },
];

interface PendingReview {
  orderNumber: string;
  productName: string;
  productImage: string;
}

const mockPendingReviews: PendingReview[] = [
  {
    orderNumber: 'DH012',
    productName: 'Áo thun nam cổ tròn',
    productImage: '👕',
  },
  {
    orderNumber: 'DH011',
    productName: 'Quần jean nữ skinny',
    productImage: '👖',
  },
];

interface CustomerReviewsProps {
  onViewReviewsDetail?: () => void;
  onWriteReview?: (data: { productName: string; productImage: string; orderId: string; productId?: string }) => void;
  onEditReview?: (data: { productName: string; productImage: string; orderId: string; reviewId: string; rating: number; comment: string; images?: string[] }) => void;
}

export function CustomerReviews({ onViewReviewsDetail, onWriteReview, onEditReview }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [pendingReviews] = useState<PendingReview[]>(mockPendingReviews);

  const handleWriteReview = (product: PendingReview) => {
    if (onWriteReview) {
      onWriteReview({
        productName: product.productName,
        productImage: product.productImage,
        orderId: product.orderNumber,
        productId: undefined,
      });
    }
  };

  const handleEditReview = (review: Review) => {
    if (onEditReview) {
      onEditReview({
        productName: review.productName,
        productImage: review.productImage,
        orderId: review.orderNumber,
        reviewId: review.id,
        rating: review.rating,
        comment: review.comment,
        images: [],
      });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Đánh giá của tôi</h1>
          <p className="text-gray-500 text-sm">Quản lý đánh giá sản phẩm</p>
        </div>
        {onViewReviewsDetail && (
          <Button variant="outline" size="sm" onClick={onViewReviewsDetail}>
            Xem tất cả đánh giá
          </Button>
        )}
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div>
          <h2 className="text-base sm:text-lg mb-3">Chờ đánh giá ({pendingReviews.length})</h2>
          <div className="space-y-2 sm:space-y-3">
            {pendingReviews.map((product, index) => (
              <Card key={index}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl sm:text-4xl">{product.productImage}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base mb-1">
                        {product.productName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Đơn hàng: {product.orderNumber}
                      </p>
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleWriteReview(product)}
                      >
                        <Star className="h-3 w-3 mr-1.5" />
                        Viết đánh giá
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Reviews */}
      <div>
        <h2 className="text-base sm:text-lg mb-3">Đánh giá của tôi ({reviews.length})</h2>
        <div className="space-y-2 sm:space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl sm:text-4xl">{review.productImage}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base mb-1">
                          {review.productName}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Đơn hàng: {review.orderNumber} • {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      {review.canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleEditReview(review)}
                        >
                          Sửa
                        </Button>
                      )}
                    </div>
                    <div className="mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
