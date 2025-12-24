import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Package, ShieldCheck, Filter } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const DEFAULT_IMAGE = 'https://via.placeholder.com/600x600?text=No+Image';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  categoryId?: string;
  originalPrice?: number;
  salePrice?: number;
  description?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  specifications?: Record<string, string>;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sản phẩm rất tốt, chất lượng vượt mong đợi. Giao hàng nhanh!',
    date: '2025-11-05',
  },
  {
    id: '2',
    userName: 'Trần Thị B',
    rating: 4,
    comment: 'Đẹp, giá hợp lý. Sẽ mua lại lần sau.',
    date: '2025-11-03',
  },
  {
    id: '3',
    userName: 'Lê Văn C',
    rating: 5,
    comment: 'Chất lượng tuyệt vời, đúng như mô tả',
    date: '2025-11-01',
  },
  {
    id: '4',
    userName: 'Phạm Thị D',
    rating: 3,
    comment: 'Sản phẩm tạm ổn, giá hơi cao so với chất lượng',
    date: '2025-10-28',
  },
  {
    id: '5',
    userName: 'Hoàng Văn E',
    rating: 5,
    comment: 'Rất hài lòng với sản phẩm này. Sẽ giới thiệu cho bạn bè',
    date: '2025-10-25',
  },
  {
    id: '6',
    userName: 'Võ Thị F',
    rating: 2,
    comment: 'Không như mong đợi, màu sắc không giống hình',
    date: '2025-10-20',
  },
];

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  addToCart: (productId: string) => void;
  onViewReviews?: (productId: string) => void;
}

export function ProductDetail({ product, onBack, addToCart, onViewReviews }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful'>('newest');
  const [imageError, setImageError] = useState(false);
  const [displayImage, setDisplayImage] = useState<string>(DEFAULT_IMAGE);
  const [detail, setDetail] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizeImageUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = (import.meta as any).env?.VITE_API_BASE_URL || '';
    return `${base}${url}`;
  };

  const view = useMemo(() => (detail ? { ...product, ...detail } : product), [detail, product]);

  const imageUrl = useMemo(() => normalizeImageUrl(view.image), [view.image]);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${product.id}`);
        const d = res.data?.data;
        if (d && isMounted) {
          const basePrice = (d.price ?? product.originalPrice ?? product.price) as number;
          const salePrice = (d.sale_price ?? basePrice) as number;
          const updated: Partial<Product> = {
            id: d.id ?? product.id,
            name: d.name ?? product.name,
            price: salePrice,
            salePrice,
            originalPrice: basePrice,
            stock: (d.stock_quantity ?? product.stock) as number,
            description: d.description ?? product.description,
            rating: (d.rating ?? product.rating) as number,
            reviewCount: (d.rating_count ?? product.reviewCount) as number,
            soldCount: (d.sold_count ?? product.soldCount) as number,
            category: product.category,
            categoryId: d.category_id ?? product.categoryId,
            image: (d.thumbnail?.url || (Array.isArray(d.images) && d.images[0]?.url) || product.image) as string,
          };
          setDetail(updated);
        }
      } catch (e) {
        // keep initial product data
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [product.id]);

  useEffect(() => {
    setImageError(false);
    setDisplayImage(imageUrl || DEFAULT_IMAGE);
  }, [imageUrl]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart would be handled by parent
    toast.success('Chuyển đến giỏ hàng');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  const handleShare = () => {
    toast.success('Đã sao chép liên kết sản phẩm');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const filteredReviews = mockReviews
    .filter((review) => {
      if (starFilter === 'all') return true;
      return review.rating === starFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'helpful':
          // In real app, this would sort by helpful votes
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const ratingValue = view.rating ?? 0;
  const displayRating = ratingValue.toFixed(1);
  const reviewCount = view.reviewCount ?? 0;
  const soldCount = view.soldCount ?? 0;

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base sm:text-lg">Chi tiết sản phẩm</h1>
      </div>

      {/* Product Info */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-8 sm:p-12">
              <img
                src={imageError ? DEFAULT_IMAGE : displayImage}
                alt={view.name}
                className="max-h-80 sm:max-h-[26rem] object-contain"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {view.category}
                </Badge>
                <h2 className="text-xl sm:text-2xl mb-2">{view.name}</h2>

                {/* Rating */}
                <button
                  onClick={() => onViewReviews?.(product.id)}
                  className="flex items-center gap-3 mb-3 hover:opacity-70 transition-opacity"
                >
                  {renderStars(ratingValue)}
                  <span className="text-sm text-gray-600">
                    {displayRating} ({reviewCount} đánh giá)
                  </span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-600">
                    Đã bán {soldCount}
                  </span>
                </button>

                {/* Price */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                    <p className="text-3xl sm:text-4xl text-blue-600">
                      {view.price.toLocaleString('vi-VN')} ₫
                    </p>
                    {view.originalPrice && view.originalPrice > view.price && (
                      <p className="text-sm sm:text-base text-gray-500 line-through">
                        {view.originalPrice.toLocaleString('vi-VN')} ₫
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Còn lại: {view.stock} sản phẩm
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(view.stock, quantity + 1))}
                    className="px-3 py-1.5 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button className="flex-1" onClick={handleBuyNow}>
                  Mua ngay
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWishlist}
                  className={isWishlisted ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  Yêu thích
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>Chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span>Giao hàng nhanh</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description" className="text-xs sm:text-sm">
            Mô tả
          </TabsTrigger>
          <TabsTrigger value="specifications" className="text-xs sm:text-sm">
            Thông số
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm">
            Đánh giá ({reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-3">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="mb-3">Mô tả sản phẩm</h3>
              <p className="text-gray-700 leading-relaxed">
                {view.description ||
                  'Sản phẩm chất lượng cao, được làm từ những nguyên liệu tốt nhất. Thiết kế hiện đại, phù hợp với mọi phong cách. Đảm bảo độ bền và tính thẩm mỹ cao. Sản phẩm đã được kiểm định chất lượng và đạt các tiêu chuẩn quốc tế.'}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  ✓ Chất lượng cao, bền bỉ theo thời gian
                </p>
                <p className="text-sm text-gray-600">✓ Dễ dàng sử dụng và bảo quản</p>
                <p className="text-sm text-gray-600">✓ Đổi trả trong vòng 7 ngày</p>
                <p className="text-sm text-gray-600">✓ Bảo hành chính hãng</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-3">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="mb-3">Thông số kỹ thuật</h3>
              <div className="space-y-3">
                {view.specifications ? (
                  Object.entries(view.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-2 border-b last:border-0">
                      <span className="text-gray-600 w-1/3">{key}</span>
                      <span className="font-medium w-2/3">{value}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex py-2 border-b">
                      <span className="text-gray-600 w-1/3">Danh mục</span>
                      <span className="font-medium w-2/3">{view.category}</span>
                    </div>
                    <div className="flex py-2 border-b">
                      <span className="text-gray-600 w-1/3">Mã sản phẩm</span>
                      <span className="font-medium w-2/3">{view.id}</span>
                    </div>
                    <div className="flex py-2 border-b">
                      <span className="text-gray-600 w-1/3">Tình trạng</span>
                      <span className="font-medium w-2/3">Còn hàng</span>
                    </div>
                    <div className="flex py-2">
                      <span className="text-gray-600 w-1/3">Kho</span>
                      <span className="font-medium w-2/3">{view.stock} sản phẩm</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-3">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Đánh giá từ khách hàng</h3>
                  {onViewReviews && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReviews(product.id)}
                    >
                      Xem tất cả
                    </Button>
                  )}
                </div>
                <button
                  onClick={() => onViewReviews?.(product.id)}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full"
                >
                  <div className="text-center">
                    <p className="text-4xl mb-1">{displayRating}</p>
                    {renderStars(ratingValue)}
                    <p className="text-sm text-gray-600 mt-1">
                      {reviewCount} đánh giá
                    </p>
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = mockReviews.filter((r) => r.rating === star).length;
                      const percentage = (count / mockReviews.length) * 100;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm w-12">{star} sao</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 pb-4 border-b">
                <div className="flex-1">
                  <p className="text-sm mb-2 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Lọc theo đánh giá
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <Button
                      variant={starFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStarFilter('all')}
                      className="whitespace-nowrap text-xs"
                    >
                      Tất cả ({mockReviews.length})
                    </Button>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = mockReviews.filter((r) => r.rating === star).length;
                      return (
                        <Button
                          key={star}
                          variant={starFilter === star ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setStarFilter(star)}
                          className="whitespace-nowrap text-xs"
                        >
                          {star} ⭐ ({count})
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:w-48">
                  <p className="text-sm mb-2">Sắp xếp</p>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="helpful">Hữu ích nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{review.userName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-500">
                              {new Date(review.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có đánh giá nào phù hợp với bộ lọc
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
