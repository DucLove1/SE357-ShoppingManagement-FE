import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Minus, Trash2, ShoppingBag, Store, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category?: string;
  price: number;
  image: string;
  inStock?: boolean;
  sellerId?: string;
  sellerName?: string;
  salePrice?: number;
  originalPrice?: number;
}

const mockProducts: Record<string, Product> = {
  '1': { id: '1', name: 'Áo thun nam cổ tròn', price: 199000, image: '👕', sellerId: '2', sellerName: 'Tech Store Vietnam' },
  '2': { id: '2', name: 'Quần jean nữ skinny', price: 450000, image: '👖', sellerId: '2', sellerName: 'Tech Store Vietnam' },
  '4': { id: '4', name: 'Túi xách nữ da PU', price: 320000, image: '👜', sellerId: '2', sellerName: 'Tech Store Vietnam' },
  '5': { id: '5', name: 'Áo khoác hoodie', price: 550000, image: '🧥', sellerId: '3', sellerName: 'Fashion House' },
  '6': { id: '6', name: 'Mũ lưỡi trai', price: 120000, image: '🧢', sellerId: '3', sellerName: 'Fashion House' },
  '7': { id: '7', name: 'Váy midi nữ', price: 380000, image: '👗', sellerId: '4', sellerName: 'Style & Co' },
  '8': { id: '8', name: 'Kính mát thời trang', price: 250000, image: '🕶️', sellerId: '4', sellerName: 'Style & Co' },
};

interface CartProps {
  cart: Record<string, number>;
  products?: Record<string, Product>;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  onCheckout: (selectedItems: Array<{ productId: string; product: Product; quantity: number }>) => void;
  onBack?: () => void;
  addToCart?: (productId: string, quantity: number) => Promise<void>;
  removeFromCart?: (productId: string) => Promise<void>;
  deleteFromCart?: (productId: string) => Promise<void>;
}

interface ShopGroup {
  sellerId: string;
  sellerName: string;
  items: Array<{ productId: string; product: Product; quantity: number }>;
}

export function CustomerCart({ cart, products, updateQuantity, clearCart, onCheckout, onBack, addToCart, removeFromCart, deleteFromCart }: CartProps) {
  const [selectedShops, setSelectedShops] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const cartItems = Object.entries(cart).filter(([_, qty]) => qty > 0);

  // Group items by seller
  const shopGroups: ShopGroup[] = [];
  const shopMap = new Map<string, ShopGroup>();

  cartItems.forEach(([productId, quantity]) => {
    const product = (products && products[productId]) || mockProducts[productId];
    if (!product) return;

    const sellerId = product.sellerId || 'unknown';
    const sellerName = product.sellerName || 'Cửa hàng';

    if (!shopMap.has(sellerId)) {
      const group: ShopGroup = {
        sellerId: sellerId,
        sellerName: sellerName,
        items: [],
      };
      shopMap.set(sellerId, group);
      shopGroups.push(group);
    }

    shopMap.get(sellerId)!.items.push({ productId, product, quantity });
  });

  const toggleShopSelection = (sellerId: string, items: ShopGroup['items']) => {
    const newSelectedShops = new Set(selectedShops);
    const newSelectedItems = new Set(selectedItems);

    if (selectedShops.has(sellerId)) {
      newSelectedShops.delete(sellerId);
      items.forEach(item => newSelectedItems.delete(item.productId));
    } else {
      newSelectedShops.add(sellerId);
      items.forEach(item => newSelectedItems.add(item.productId));
    }

    setSelectedShops(newSelectedShops);
    setSelectedItems(newSelectedItems);
  };

  const toggleItemSelection = (productId: string, sellerId: string, shopItems: ShopGroup['items']) => {
    const newSelectedItems = new Set(selectedItems);
    const newSelectedShops = new Set(selectedShops);

    if (selectedItems.has(productId)) {
      newSelectedItems.delete(productId);
      // Check if shop should be deselected
      const anySelected = shopItems.some(item =>
        item.productId !== productId && newSelectedItems.has(item.productId)
      );
      if (!anySelected) {
        newSelectedShops.delete(sellerId);
      }
    } else {
      newSelectedItems.add(productId);
      // Check if all items in shop are selected
      const allSelected = shopItems.every(item =>
        item.productId === productId || newSelectedItems.has(item.productId)
      );
      if (allSelected) {
        newSelectedShops.add(sellerId);
      }
    }

    setSelectedItems(newSelectedItems);
    setSelectedShops(newSelectedShops);
  };

  const calculateShopTotal = (items: ShopGroup['items']) => {
    return items.reduce((sum, { product, quantity }) => {
      const unitPrice = product.salePrice ?? product.price;
      return sum + unitPrice * quantity;
    }, 0);
  };

  const calculateSelectedTotal = () => {
    let total = 0;
    shopGroups.forEach(shop => {
      shop.items.forEach(({ productId, product, quantity }) => {
        if (selectedItems.has(productId)) {
          const unitPrice = product.salePrice ?? product.price;
          total += unitPrice * quantity;
        }
      });
    });
    return total;
  };

  const handleCheckoutShop = (sellerId: string, items: ShopGroup['items']) => {
    // Select only this shop's items
    const newSelectedItems = new Set<string>();
    items.forEach(item => newSelectedItems.add(item.productId));
    setSelectedItems(newSelectedItems);
    setSelectedShops(new Set([sellerId]));

    toast.success(`Đang thanh toán ${items.length} sản phẩm từ ${items[0].product.sellerName}`);
    onCheckout(items);
  };

  const handleCheckoutSelected = () => {
    if (selectedItems.size === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }
    toast.success(`Đang thanh toán ${selectedItems.size} sản phẩm đã chọn`);

    // Build array of selected items
    const selectedItemsArray: Array<{ productId: string; product: Product; quantity: number }> = [];
    cartItems.forEach(([productId, quantity]) => {
      if (selectedItems.has(productId)) {
        const product = (products && products[productId]) || mockProducts[productId];
        if (product) {
          selectedItemsArray.push({ productId, product, quantity });
        }
      }
    });

    onCheckout(selectedItemsArray);
  };

  const selectedSubtotal = calculateSelectedTotal();
  const selectedShipping = selectedSubtotal > 0 ? 30000 : 0;
  const selectedTotal = selectedSubtotal + selectedShipping;

  return (
    <div className="space-y-4 sm:space-y-6 pb-32 sm:pb-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack || (() => window.history.back())}
          className="-ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Giỏ hàng</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              {cartItems.length > 0
                ? `${cartItems.length} sản phẩm từ ${shopGroups.length} cửa hàng`
                : 'Giỏ hàng của bạn đang trống'}
            </p>
          </div>
          {cartItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCart}>
              <Trash2 className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Xóa tất cả</span>
            </Button>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <Card className="p-8 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Chưa có sản phẩm nào trong giỏ hàng</p>
          <Button onClick={() => window.history.back()}>Tiếp tục mua sắm</Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items - Grouped by Shop */}
          <div className="lg:col-span-2 space-y-4">
            {shopGroups.map((shop) => {
              const shopTotal = calculateShopTotal(shop.items);
              const isShopSelected = selectedShops.has(shop.sellerId);
              const selectedItemsCount = shop.items.filter(item =>
                selectedItems.has(item.productId)
              ).length;

              return (
                <Card key={shop.sellerId} className="overflow-hidden border-2">
                  {/* Shop Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={isShopSelected}
                            onCheckedChange={() => toggleShopSelection(shop.sellerId, shop.items)}
                            className="mt-0.5"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Store className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                {shop.sellerName}
                              </h3>
                              <p className="text-xs text-gray-600">
                                {shop.items.length} sản phẩm
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleCheckoutShop(shop.sellerId, shop.items)}
                          className="text-xs h-8 sm:h-9"
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                          <span className="hidden sm:inline">Mua ngay</span>
                          <span className="sm:hidden">Mua</span>
                        </Button>
                      </div>

                      {selectedItemsCount > 0 && selectedItemsCount < shop.items.length && (
                        <div className="flex items-center gap-2 pl-9">
                          <Badge variant="secondary" className="text-xs">
                            {selectedItemsCount}/{shop.items.length} sản phẩm được chọn
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shop Items */}
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {shop.items.map(({ productId, product, quantity }) => {
                        const isSelected = selectedItems.has(productId);

                        return (
                          <div
                            key={productId}
                            className={`p-3 sm:p-4 transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex gap-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleItemSelection(productId, shop.sellerId, shop.items)}
                                className="mt-1"
                              />

                              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/100?text=No+Image';
                                  }}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm font-semibold text-red-600">
                                    {(product.salePrice ?? product.price).toLocaleString('vi-VN')} ₫
                                  </p>
                                  {product.originalPrice && product.originalPrice > (product.salePrice ?? product.price) && (
                                    <p className="text-xs text-gray-500 line-through">
                                      {product.originalPrice.toLocaleString('vi-VN')} ₫
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2 bg-white border rounded-lg">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 sm:h-8 sm:w-8"
                                      onClick={() => removeFromCart && removeFromCart(productId)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 sm:h-8 sm:w-8"
                                      onClick={() => addToCart && addToCart(productId, 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => deleteFromCart && deleteFromCart(productId)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-sm sm:text-base text-blue-600">
                                  {((product.salePrice ?? product.price) * quantity).toLocaleString('vi-VN')} ₫
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>

                  {/* Shop Footer */}
                  <div className="bg-gray-50 border-t px-3 sm:px-4 py-2.5 sm:py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Package className="h-4 w-4" />
                        <span>Tổng tiền shop:</span>
                      </div>
                      <span className="font-bold text-sm sm:text-base text-gray-900">
                        {shopTotal.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700 mb-2">Sản phẩm đã chọn</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedItems.size}</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{selectedSubtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium">{selectedShipping.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {selectedTotal.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={handleCheckoutSelected}
                  disabled={selectedItems.size === 0}
                >
                  Mua hàng ({selectedItems.size})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-gray-600">
                  Đã chọn {selectedItems.size} sản phẩm
                </p>
                <p className="font-bold text-blue-600">
                  {selectedTotal.toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <Button
                onClick={handleCheckoutSelected}
                disabled={selectedItems.size === 0}
                size="lg"
                className="h-11"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Mua hàng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
