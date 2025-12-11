import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Star, ThumbsUp, MessageSquare, Search, Filter, TrendingUp, TrendingDown, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
  images?: string[];
  helpful: number;
  sellerReply?: {
    message: string;
    date: string;
  };
}

const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Nguyễn Văn A',
    productName: 'Áo thun nam cổ tròn',
    productImage: '👕',
    rating: 5,
    comment: 'Sản phẩm chất lượng tuyệt vời! Vải mềm mại, form đẹp. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lâu dài!',
    date: '2025-11-10T14:30:00',
    orderId: 'DH015',
    helpful: 12,
    sellerReply: {
      message: 'Cảm ơn bạn đã tin tùng và ủng hộ shop! Chúc bạn luôn hài lòng với sản phẩm ạ.',
      date: '2025-11-10T16:00:00',
    },
  },
  {
    id: '2',
    customerName: 'Trần Thị B',
    productName: 'Quần jean nữ skinny',
    productImage: '👖',
    rating: 4,
    comment: 'Quần đẹp, vừa vặn. Nhưng màu sắc hơi khác một chút so với hình. Tuy nhiên vẫn ưng lắm!',
    date: '2025-11-09T10:15:00',
    orderId: 'DH012',
    helpful: 8,
  },
  {
    id: '3',
    customerName: 'Lê Văn C',
    productName: 'Áo khoác hoodie',
    productImage: '🧥',
    rating: 5,
    comment: 'Áo khoác chất lượng cao cấp, form đẹp, mặc ấm áp. Giá cả hợp lý. Highly recommend!',
    date: '2025-11-08T16:45:00',
    orderId: 'DH010',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'],
    helpful: 15,
    sellerReply: {
      message: 'Thank you! Rất vui vì bạn hài lòng với sản phẩm. Hẹn gặp lại bạn trong những đơn hàng tiếp theo!',
      date: '2025-11-08T18:00:00',
    },
  },
  {
    id: '4',
    customerName: 'Phạm Thị D',
    productName: 'Túi xách nữ da PU',
    productImage: '👜',
    rating: 3,
    comment: 'Túi ok nhưng khóa hơi lỏng. Mong shop cải thiện chất lượng hơn.',
    date: '2025-11-07T09:20:00',
    orderId: 'DH008',
    helpful: 5,
  },
  {
    id: '5',
    customerName: 'Hoàng Văn E',
    productName: 'Áo thun nam cổ tròn',
    productImage: '👕',
    rating: 5,
    comment: 'Áo đẹp, chất vải tốt, mặc mát. Giao hàng cực nhanh. 5 sao cho shop!',
    date: '2025-11-06T14:10:00',
    orderId: 'DH005',
    helpful: 10,
    sellerReply: {
      message: 'Cảm ơn bạn rất nhiều! Shop luôn cố gắng mang đến sản phẩm và dịch vụ tốt nhất.',
      date: '2025-11-06T15:30:00',
    },
  },
  {
    id: '6',
    customerName: 'Võ Thị F',
    productName: 'Váy midi nữ',
    productImage: '👗',
    rating: 2,
    comment: 'Váy không giống hình. Chất vải hơi mỏng. Hơi thất vọng.',
    date: '2025-11-05T11:30:00',
    orderId: 'DH003',
    helpful: 3,
  },
];

export function SellerReviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterProduct, setFilterProduct] = useState<string>('all');

  // Get unique products from reviews
  const products = Array.from(new Set(reviews.map((r) => r.productName))).map((name) => {
    const review = reviews.find((r) => r.productName === name)!;
    return {
      name,
      image: review.productImage,
      count: reviews.filter((r) => r.productName === name).length,
      avgRating: (
        reviews.filter((r) => r.productName === name).reduce((sum, r) => sum + r.rating, 0) /
        reviews.filter((r) => r.productName === name).length
      ).toFixed(1),
    };
  });

  const stats = {
    total: reviews.length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    five: reviews.filter((r) => r.rating === 5).length,
    four: reviews.filter((r) => r.rating === 4).length,
    three: reviews.filter((r) => r.rating === 3).length,
    two: reviews.filter((r) => r.rating === 2).length,
    one: reviews.filter((r) => r.rating === 1).length,
    replied: reviews.filter((r) => r.sellerReply).length,
    pending: reviews.filter((r) => !r.sellerReply).length,
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleReply = (reviewId: string) => {
    if (!replyMessage.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }

    setReviews(
      reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              sellerReply: {
                message: replyMessage,
                date: new Date().toISOString(),
              },
            }
          : r
      )
    );

    setReplyMessage('');
    setSelectedReview(null);
    toast.success('Đã gửi phản hồi thành công');
  };

  const filteredReviews = reviews.filter((review) => {
    const matchSearch =
      searchQuery === '' ||
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRating = filterRating === null || review.rating === filterRating;

    const matchProduct = filterProduct === 'all' || review.productName === filterProduct;

    return matchSearch && matchRating && matchProduct;
  });

  const unrepliedReviews = filteredReviews.filter((r) => !r.sellerReply);
  const repliedReviews = filteredReviews.filter((r) => r.sellerReply);

  const renderReview = (review: Review) => (
    <Card key={review.id}>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">{review.customerName.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">{review.customerName}</p>
                <span className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(review.rating)}
                <span className="text-xs text-gray-500">#{review.orderId}</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-2xl">{review.productImage}</span>
            <span className="text-xs text-gray-600">{review.productName}</span>
          </div>

          {/* Comment */}
          <p className="text-sm text-gray-700">{review.comment}</p>

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2">
              {review.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Review"
                  className="h-16 w-16 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* Helpful count */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{review.helpful} người thấy hữu ích</span>
            </div>
          </div>

          {/* Seller Reply */}
          {review.sellerReply ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 ml-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-900">Phản hồi của bạn</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(review.sellerReply.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.sellerReply.message}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setSelectedReview(review)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Phản hồi
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mb-1 sm:mb-2">Đánh giá từ khách hàng</h1>
        <p className="text-gray-500 text-sm">Quản lý và phản hồi đánh giá</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl sm:text-3xl">{stats.averageRating}</span>
              </div>
              <p className="text-xs text-gray-500">{stats.total} đánh giá</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-2xl sm:text-3xl text-green-600">{stats.five}</span>
              </div>
              <p className="text-xs text-gray-500">5 sao ({((stats.five / stats.total) * 100).toFixed(0)}%)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="text-2xl sm:text-3xl text-blue-600">{stats.replied}</span>
              </div>
              <p className="text-xs text-gray-500">Đã phản hồi</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <span className="text-2xl sm:text-3xl text-orange-600">{stats.pending}</span>
              </div>
              <p className="text-xs text-gray-500">Chờ phản hồi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên khách hàng, sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Product Filter */}
              <div className="flex-1">
                <Select value={filterProduct} onValueChange={setFilterProduct}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <span>Tất cả sản phẩm</span>
                        <Badge variant="secondary" className="ml-auto">
                          {reviews.length}
                        </Badge>
                      </div>
                    </SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.name} value={product.name}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{product.image}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{product.name}</span>
                              <Badge variant="secondary" className="text-[10px] h-4">
                                {product.count}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-500">{product.avgRating}</span>
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                <Button
                  variant={filterRating === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRating(null)}
                  className="whitespace-nowrap"
                >
                  Tất cả
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filterRating === rating ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterRating(rating)}
                    className="whitespace-nowrap gap-1"
                  >
                    {rating} <Star className="h-3 w-3 fill-current" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(filterProduct !== 'all' || filterRating !== null) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Bộ lọc:</span>
                {filterProduct !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {products.find((p) => p.name === filterProduct)?.image}{' '}
                    {filterProduct}
                    <button
                      onClick={() => setFilterProduct('all')}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filterRating !== null && (
                  <Badge variant="secondary" className="gap-1">
                    {filterRating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <button
                      onClick={() => setFilterRating(null)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterProduct('all');
                    setFilterRating(null);
                  }}
                  className="h-6 text-xs"
                >
                  Xóa tất cả
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Chờ phản hồi ({unrepliedReviews.length})
          </TabsTrigger>
          <TabsTrigger value="replied">
            Đã phản hồi ({repliedReviews.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Tất cả ({filteredReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-3">
          {unrepliedReviews.length > 0 ? (
            unrepliedReviews.map(renderReview)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có đánh giá chờ phản hồi</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="replied" className="space-y-3 mt-3">
          {repliedReviews.length > 0 ? (
            repliedReviews.map(renderReview)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có đánh giá nào được phản hồi</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3 mt-3">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(renderReview)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không tìm thấy đánh giá nào</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <Card className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-auto">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg mb-4">Phản hồi đánh giá</h3>

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{selectedReview.customerName}</span>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{selectedReview.comment}</p>
              </div>

              <div className="space-y-3">
                <Textarea
                  placeholder="Nhập phản hồi của bạn..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedReview(null);
                      setReplyMessage('');
                    }}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button onClick={() => handleReply(selectedReview.id)} className="flex-1">
                    Gửi phản hồi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}