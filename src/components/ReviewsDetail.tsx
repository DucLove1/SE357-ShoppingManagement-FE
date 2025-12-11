import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Progress } from './ui/progress';
import { ArrowLeft, Star, ThumbsUp, Image as ImageIcon } from 'lucide-react';

interface ReviewsDetailProps {
  productId?: string;
  shopId?: string;
  onBack: () => void;
}

const mockProductReviews = [
  {
    id: '1',
    userName: 'Nguyễn Văn A',
    avatar: '👤',
    rating: 5,
    date: '2025-11-05',
    comment: 'Sản phẩm rất tốt, chất lượng vượt mong đợi. Giao hàng nhanh.',
    images: ['📷', '📷'],
    likes: 12,
  },
  {
    id: '2',
    userName: 'Trần Thị B',
    avatar: '👤',
    rating: 4,
    date: '2025-11-03',
    comment: 'Sản phẩm đẹp, đúng mô tả. Chỉ có điểm trừ là hơi lâu.',
    images: [],
    likes: 5,
  },
  {
    id: '3',
    userName: 'Lê Văn C',
    avatar: '👤',
    rating: 5,
    date: '2025-11-01',
    comment: 'Rất hài lòng với sản phẩm. Sẽ mua thêm lần sau.',
    images: ['📷'],
    likes: 8,
  },
];

const mockShopReviews = [
  {
    id: '1',
    userName: 'Phạm Thị D',
    avatar: '👤',
    rating: 5,
    date: '2025-11-06',
    comment: 'Shop phục vụ nhiệt tình, đóng gói cẩn thận. Rất uy tín!',
    likes: 15,
  },
  {
    id: '2',
    userName: 'Hoàng Văn E',
    avatar: '👤',
    rating: 4,
    date: '2025-11-04',
    comment: 'Shop giao hàng nhanh, sản phẩm tốt.',
    likes: 7,
  },
];

export function ReviewsDetail({ productId, shopId, onBack }: ReviewsDetailProps) {
  const [activeTab, setActiveTab] = useState('product');

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Đánh giá</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl">
        {/* Rating Summary */}
        <Card className="m-4 mb-3">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4.8</div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">142 đánh giá</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm w-8">{star} ⭐</span>
                    <Progress
                      value={star === 5 ? 80 : star === 4 ? 15 : star === 3 ? 3 : star === 2 ? 1 : 1}
                      className="h-2"
                    />
                    <span className="text-xs text-gray-600 w-8">
                      {star === 5 ? 113 : star === 4 ? 21 : star === 3 ? 5 : star === 2 ? 2 : 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="product" className="flex-1">
              Đánh giá sản phẩm ({mockProductReviews.length})
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex-1">
              Đánh giá shop ({mockShopReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="product" className="space-y-3 mt-3">
            {mockProductReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{review.userName}</p>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      {renderStarRating(review.rating)}
                      <p className="text-sm text-gray-700 mt-2 mb-3">{review.comment}</p>
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl"
                            >
                              {img}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Hữu ích ({review.likes})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="shop" className="space-y-3 mt-3">
            {mockShopReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{review.userName}</p>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      {renderStarRating(review.rating)}
                      <p className="text-sm text-gray-700 mt-2 mb-3">{review.comment}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Hữu ích ({review.likes})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
