import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, ShoppingCart, Plus, Minus, Store, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  storeName?: string;
  rating?: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Áo thun nam cổ tròn', category: 'Thời trang', price: 199000, image: '👕', inStock: true, storeName: 'Fashion Store A', rating: 4.5 },
  { id: '2', name: 'Quần jean nữ skinny', category: 'Thời trang', price: 450000, image: '👖', inStock: true, storeName: 'Denim Shop', rating: 4.8 },
  { id: '3', name: 'Giày thể thao nam', category: 'Giày dép', price: 890000, image: '👟', inStock: false, storeName: 'Sport Shoes Pro', rating: 4.3 },
  { id: '4', name: 'Túi xách nữ da PU', category: 'Phụ kiện', price: 320000, image: '👜', inStock: true, storeName: 'Bags & More', rating: 4.7 },
  { id: '5', name: 'Áo khoác hoodie', category: 'Thời trang', price: 550000, image: '🧥', inStock: true, storeName: 'Fashion Store A', rating: 4.9 },
  { id: '6', name: 'Mũ lưỡi trai', category: 'Phụ kiện', price: 120000, image: '🧢', inStock: true, storeName: 'Accessories Hub', rating: 4.2 },
  { id: '7', name: 'Váy midi nữ', category: 'Thời trang', price: 380000, image: '👗', inStock: true, storeName: 'Fashion Store A', rating: 4.6 },
  { id: '8', name: 'Kính mát thời trang', category: 'Phụ kiện', price: 250000, image: '🕶️', inStock: true, storeName: 'Accessories Hub', rating: 4.4 },
];

interface CartContextType {
  cart: Record<string, number>;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

export function CustomerShop({ cart, addToCart, updateQuantity, onSelectProduct }: CartContextType) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = mockProducts.filter((product) => {
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
        {filteredProducts.map((product) => {
          const quantity = cart[product.id] || 0;
          return (
            <Card key={product.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
              <div onClick={() => onSelectProduct(product)}>
                <CardHeader>
                  <div className="text-6xl text-center mb-4">{product.image}</div>
                  <CardTitle className="text-base line-clamp-2 mb-2">{product.name}</CardTitle>
                  {product.storeName && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <Store className="h-3 w-3" />
                      <span>{product.storeName}</span>
                    </div>
                  )}
                  {product.rating && (
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
