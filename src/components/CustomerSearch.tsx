import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Search, X, TrendingUp, Clock, Star, Store } from 'lucide-react';
import { toast } from 'sonner';

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

interface CustomerSearchProps {
  onSelectProduct: (product: Product) => void;
  onBack: () => void;
  products: Product[];
}

const mockSearchHistory = [
  'Áo thun nam',
  'Giày thể thao',
  'Túi xách',
  'Quần jean',
];

const mockSuggestions = [
  { text: 'Áo khoác hoodie', trending: true },
  { text: 'Phụ kiện thời trang', trending: true },
  { text: 'Giày dép nữ', trending: false },
  { text: 'Đồ thể thao', trending: false },
  { text: 'Mũ lưỡi trai', trending: false },
];

export function CustomerSearch({ onSelectProduct, onBack, products }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(mockSearchHistory);
  const [isSearching, setIsSearching] = useState(false);

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    // Add to search history if not already there
    if (term && !searchHistory.includes(term)) {
      setSearchHistory([term, ...searchHistory.slice(0, 4)]);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    toast.success('Đã xóa lịch sử tìm kiếm');
  };

  const removeHistoryItem = (item: string) => {
    setSearchHistory(searchHistory.filter((h) => h !== item));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Input */}
      <div className="sticky top-0 bg-white border-b p-3 sm:p-4 z-10">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-9 h-10"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsSearching(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="ghost" onClick={onBack}>
            Hủy
          </Button>
        </div>
      </div>

      <div className="p-4 pb-20">
        {isSearching && searchTerm ? (
          // Search Results
          <div>
            <p className="text-sm text-gray-600 mb-4">
              {filteredProducts.length} kết quả cho "{searchTerm}"
            </p>
            {filteredProducts.length > 0 ? (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectProduct(product)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="text-4xl">{product.image}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm mb-1 line-clamp-2">
                            {product.name}
                          </p>
                          {product.storeName && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                              <Store className="h-3 w-3" />
                              <span>{product.storeName}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-blue-600 font-semibold">
                              {product.price.toLocaleString('vi-VN')} ₫
                            </p>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-xs">{product.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm text-gray-400 mt-1">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </div>
        ) : (
          // Default View
          <div className="space-y-6">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <h3 className="text-sm font-semibold">Tìm kiếm gần đây</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs h-7"
                  >
                    Xóa tất cả
                  </Button>
                </div>
                <div className="space-y-2">
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                      onClick={() => handleSearch(item)}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{item}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHistoryItem(item);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-semibold">Tìm kiếm phổ biến</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 py-2 px-3"
                    onClick={() => handleSearch(suggestion.text)}
                  >
                    {suggestion.trending && (
                      <TrendingUp className="h-3 w-3 text-orange-500 mr-1.5" />
                    )}
                    {suggestion.text}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Danh mục phổ biến</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Thời trang', icon: '👕', color: 'bg-blue-50' },
                  { name: 'Giày dép', icon: '👟', color: 'bg-green-50' },
                  { name: 'Phụ kiện', icon: '👜', color: 'bg-purple-50' },
                  { name: 'Đồ thể thao', icon: '⚽', color: 'bg-orange-50' },
                ].map((category, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSearch(category.name)}
                  >
                    <CardContent className={`p-4 ${category.color}`}>
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <p className="text-sm font-semibold">{category.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
