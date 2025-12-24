import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, ShoppingCart, Plus, Minus, Store, Star } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const DEFAULT_IMAGE = 'https://via.placeholder.com/400?text=No+Image';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  storeName?: string;
  rating?: number;
  stock?: number;
}

interface CartContextType {
  cart: Record<string, number>;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

export function CustomerShop({ cart, addToCart, updateQuantity, onSelectProduct }: CartContextType) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const normalizeImageUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = (import.meta as any).env?.VITE_API_BASE_URL || '';
    return `${base}${url}`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryName = async (id: string): Promise<string> => {
      try {
        const res = await axios.get(`/api/categories/${id}`);
        return res.data?.data?.name || 'Danh mục';
      } catch (error) {
        return 'Danh mục';
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/products');
        const list = (res.data?.data as any[]) || [];

        const categoryIds = Array.from(new Set(list.map((p) => p.category_id).filter(Boolean)));
        const entries = await Promise.all(
          categoryIds.map(async (id) => [id, await fetchCategoryName(id)])
        );
        const categories = Object.fromEntries(entries);
        if (isMounted) {
          setCategoryMap(categories);
        }

        const normalized: Product[] = list.map((p) => ({
          id: p.id,
          name: p.name,
          category: categories[p.category_id] || 'Danh mục',
          price: p.sale_price ?? p.price ?? 0,
          image: normalizeImageUrl(p.thumbnail?.url) || '🛒',
          inStock: (p.stock_quantity ?? 0) > 0 && p.status === 'active',
          storeName: 'ShopeeShop',
          rating: p.rating ?? 0,
          stock: p.stock_quantity ?? 0,
        }));

        if (isMounted) {
          setProducts(normalized);
        }
      } catch (error) {
        toast.error('Không tải được danh sách sản phẩm');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="mb-1">Cửa hàng</h1>
          <p className="text-gray-500 text-sm">Khám phá sản phẩm của chúng tôi</p>
        </div>
        <Badge variant="default" className="text-xs sm:text-sm px-3 py-1.5">
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
          {cartItemCount} sản phẩm
        </Badge>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <p className="text-xs sm:text-sm mb-1.5">Danh mục</p>
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap text-xs h-8"
              >
                {category === 'all' ? 'Tất cả' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading && (
          <Card className="col-span-full">
            <CardContent className="py-6 text-center text-sm text-gray-500">Đang tải sản phẩm...</CardContent>
          </Card>
        )}

        {!loading && filteredProducts.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-6 text-center text-sm text-gray-500">Chưa có sản phẩm</CardContent>
          </Card>
        )}

        {!loading && filteredProducts.map((product) => {
          const quantity = cart[product.id] || 0;
          const hasImage = !!product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'));
          return (
            <Card key={product.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
              <div onClick={() => onSelectProduct(product)}>
                <CardHeader>
                  <div className="h-40 flex items-center justify-center mb-4 bg-gray-50 rounded">
                    {hasImage ? (
                      <img
                        src={product.image || DEFAULT_IMAGE}
                        alt={product.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          if (img.src !== DEFAULT_IMAGE) {
                            img.src = DEFAULT_IMAGE;
                          }
                        }}
                      />
                    ) : (
                      <img
                        src={DEFAULT_IMAGE}
                        alt="placeholder"
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <CardTitle className="text-base line-clamp-2 mb-2">{product.name}</CardTitle>
                  {product.storeName && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <Store className="h-3 w-3" />
                      <span>{product.storeName}</span>
                    </div>
                  )}
                  {product.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-semibold">{product.rating}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <p className="text-lg font-semibold">{product.price.toLocaleString('vi-VN')} ₫</p>
                  {!product.inStock && (
                    <Badge variant="destructive" className="mt-2">Hết hàng</Badge>
                  )}
                </CardContent>
              </div>
              <CardFooter onClick={(e) => e.stopPropagation()}>
                {product.inStock ? (
                  quantity > 0 ? (
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Thêm vào giỏ
                    </Button>
                  )
                ) : (
                  <Button disabled className="w-full">
                    Hết hàng
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
