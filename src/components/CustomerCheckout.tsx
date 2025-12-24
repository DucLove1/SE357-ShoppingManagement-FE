import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { MapPin, Tag, CreditCard, Wallet, ChevronRight, CheckCircle2, ArrowLeft, Plus, Store } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category?: string;
  price: number;
  image: string;
  inStock?: boolean;
  storeName?: string;
  sellerId?: string;
  sellerName?: string;
  salePrice?: number;
  originalPrice?: number;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

interface Voucher {
  id: string;
  code: string;
  description: string;
  discount: number;
  minOrder: number;
  maxDiscount?: number;
}

interface CustomerCheckoutProps {
  cart: Record<string, number>;
  products: Product[];
  selectedItems?: Array<{ productId: string; product: Product; quantity: number }>;
  onBack: () => void;
  onCheckoutSuccess: () => void;
  onAddAddress: () => void;
  clearCart: () => void;
  updateQuantity?: (productId: string, quantity: number) => void;
  deleteFromCart?: (productId: string) => Promise<void>;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '456 Đường XYZ, Phường 2, Quận 3, TP.HCM',
    isDefault: false,
  },
];

const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'SAVE20K',
    description: 'Giảm 20.000₫ cho đơn từ 200.000₫',
    discount: 20000,
    minOrder: 200000,
  },
  {
    id: '2',
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển cho đơn từ 150.000₫',
    discount: 25000,
    minOrder: 150000,
  },
  {
    id: '3',
    code: 'SALE10',
    description: 'Giảm 10% tối đa 50.000₫',
    discount: 0,
    minOrder: 100000,
    maxDiscount: 50000,
  },
  {
    id: '4',
    code: 'NEWUSER50',
    description: 'Giảm 50.000₫ cho khách hàng mới',
    discount: 50000,
    minOrder: 0,
  },
  {
    id: '5',
    code: 'FLASH15',
    description: 'Giảm 15% tối đa 100.000₫',
    discount: 0,
    minOrder: 300000,
    maxDiscount: 100000,
  },
  {
    id: '6',
    code: 'VIP100',
    description: 'Giảm 100.000₫ cho đơn từ 500.000₫',
    discount: 100000,
    minOrder: 500000,
  },
  {
    id: '7',
    code: 'MEGA20',
    description: 'Giảm 20% tối đa 200.000₫',
    discount: 0,
    minOrder: 800000,
    maxDiscount: 200000,
  },
  {
    id: '8',
    code: 'WEEKEND30',
    description: 'Giảm 30.000₫ cuối tuần',
    discount: 30000,
    minOrder: 250000,
  },
];

export function CustomerCheckout({ cart, products, selectedItems, onBack, onCheckoutSuccess, onAddAddress, clearCart, updateQuantity, deleteFromCart }: CustomerCheckoutProps) {
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    mockAddresses.find((a) => a.isDefault) || mockAddresses[0]
  );
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [customerNote, setCustomerNote] = useState('');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showVoucherDialog, setShowVoucherDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const cartItems = selectedItems
    ? selectedItems.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }))
    : Object.entries(cart)
      .map(([productId, quantity]) => ({
        product: products.find((p) => p.id === productId)!,
        quantity,
      }))
      .filter((item) => item.product);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = 25000;

  const calculateVoucherDiscount = (voucher: Voucher | null) => {
    if (!voucher) return 0;
    if (voucher.discount > 0) return voucher.discount;
    // For percentage vouchers
    const percentDiscount = voucher.code.includes('SALE10') ? subtotal * 0.1 :
      voucher.code.includes('FLASH15') ? subtotal * 0.15 :
        voucher.code.includes('MEGA20') ? subtotal * 0.2 :
          0;
    return Math.min(percentDiscount, voucher.maxDiscount || Infinity);
  };

  const voucherDiscount = calculateVoucherDiscount(selectedVoucher);
  const total = subtotal + shippingFee - voucherDiscount;

  const applicableVouchers = mockVouchers
    .filter((v) => subtotal >= v.minOrder)
    .sort((a, b) => {
      // Calculate actual discount for each voucher
      const discountA = calculateVoucherDiscount(a);
      const discountB = calculateVoucherDiscount(b);
      return discountB - discountA; // Sort by highest discount first
    });
  const unavailableVouchers = mockVouchers
    .filter((v) => subtotal < v.minOrder)
    .sort((a, b) => a.minOrder - b.minOrder); // Sort by lowest min order first

  const handleCheckout = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      return;
    }

    try {
      // Build order items from cart
      const orderItems = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      // Parse address - assuming format: "detail, ward, district, province"
      // For now, use mock IDs since we don't have the real province/ward IDs
      const orderData = {
        items: orderItems,
        shipping_address: {
          recipient_name: selectedAddress.name,
          phone_number: selectedAddress.phone,
          province_id: '694a5ef4578ea2eb3941e729', // Mock province ID
          ward_id: '694ac6dc6a2e7fcd094d22e4', // Mock ward ID
          detail: selectedAddress.address,
        },
        payment_method: paymentMethod === 'cash' ? 'cod' : 'online',
        customer_note: customerNote || undefined,
      };

      await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowSuccessDialog(true);
      setTimeout(async () => {
        setShowSuccessDialog(false);

        // Remove only the ordered items from cart
        if (selectedItems && deleteFromCart) {
          // Remove only selected items using DELETE API
          for (const item of selectedItems) {
            await deleteFromCart(item.productId);
          }
        } else {
          // Clear entire cart if no selection
          clearCart();
        }

        onCheckoutSuccess();
        toast.success('Đặt hàng thành công!');
      }, 2000);
    } catch (err) {
      console.error('Failed to place order:', err);
      toast.error('Đặt hàng thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="-ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Xác nhận đặt hàng</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-2xl space-y-3 sm:space-y-4">
        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Địa chỉ giao hàng</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddressDialog(true)}
                className="text-blue-600 h-8"
              >
                Thay đổi
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{selectedAddress.name}</p>
                <Badge variant="outline" className="text-xs">Mặc định</Badge>
              </div>
              <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
              <p className="text-sm text-gray-600">{selectedAddress.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Sản phẩm ({cartItems.length})</CardTitle>
              <Badge variant="outline" className="text-xs">
                {Object.values(cart).reduce((sum, qty) => sum + qty, 0)} sản phẩm
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-0 max-h-[400px] overflow-y-auto">
            {cartItems.map((item, index) => (
              <div key={item.product.id}>
                <div className="flex gap-3 py-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2 mb-1">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{item.product.storeName || 'Tech Store Vietnam'}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {item.product.price.toLocaleString('vi-VN')} ₫
                        </p>
                        <span className="text-xs text-gray-400">×</span>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {item.quantity}
                        </Badge>
                      </div>
                      <p className="font-bold text-sm text-blue-600">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>
                </div>
                {index < cartItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Voucher */}
        <Card className="border-dashed border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="p-3 sm:p-4">
            <button
              onClick={() => setShowVoucherDialog(true)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  {selectedVoucher ? (
                    <>
                      <p className="text-sm font-bold text-orange-700">
                        {selectedVoucher.code}
                      </p>
                      <p className="text-xs text-gray-600">{selectedVoucher.description}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-700">
                        Chọn hoặc nhập mã voucher
                      </p>
                      {applicableVouchers.length > 0 && (
                        <p className="text-xs text-orange-600">
                          {applicableVouchers.length} voucher có thể sử dụng
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedVoucher && (
                  <Badge className="bg-orange-600 text-white">
                    -{voucherDiscount.toLocaleString('vi-VN')}₫
                  </Badge>
                )}
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Phương thức thanh toán</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
              <div className={`flex items-center space-x-3 p-3 border rounded-lg mb-2 cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'
                }`}>
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'
                }`}>
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="flex-1 cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Thanh toán online</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-base">Chi tiết thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tiền hàng ({Object.values(cart).reduce((sum, qty) => sum + qty, 0)} sản phẩm)</span>
              <span className="font-medium">{subtotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-medium">{shippingFee.toLocaleString('vi-VN')} ₫</span>
            </div>
            {selectedVoucher && (
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-3 w-3 text-orange-600" />
                  <span className="text-orange-600">Giảm giá ({selectedVoucher.code})</span>
                </div>
                <span className="font-medium text-orange-600">-{voucherDiscount.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 px-6 py-3 -mb-6">
              <span className="font-bold">Tổng cộng</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {total.toLocaleString('vi-VN')} ₫
                </p>
                {selectedVoucher && voucherDiscount > 0 && (
                  <p className="text-xs text-gray-500 line-through">
                    {(total + voucherDiscount).toLocaleString('vi-VN')} ₫
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4 z-20">
        <div className="container mx-auto max-w-2xl flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Tổng thanh toán</p>
            <div className="flex items-center gap-2">
              <p className="text-lg sm:text-xl font-bold text-blue-600">
                {total.toLocaleString('vi-VN')} ₫
              </p>
              {selectedVoucher && voucherDiscount > 0 && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                  Tiết kiệm {voucherDiscount.toLocaleString('vi-VN')}₫
                </Badge>
              )}
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleCheckout}
            className="px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
          >
            Đặt hàng
          </Button>
        </div>
      </div>

      {/* Address Selection Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
            <DialogDescription>Chọn địa chỉ để nhận hàng hoặc thêm địa chỉ mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                setShowAddressDialog(false);
                onAddAddress();
              }}
            >
              <Plus className="h-4 w-4" />
              Thêm địa chỉ từ bản đồ
            </Button>
            {mockAddresses.map((address) => (
              <Card
                key={address.id}
                className={`cursor-pointer ${selectedAddress.id === address.id ? 'border-blue-600 bg-blue-50' : ''
                  }`}
                onClick={() => {
                  setSelectedAddress(address);
                  setShowAddressDialog(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{address.name}</p>
                      {address.isDefault && (
                        <Badge variant="outline" className="text-xs">Mặc định</Badge>
                      )}
                    </div>
                    {selectedAddress.id === address.id && (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                  <p className="text-sm text-gray-600">{address.address}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Voucher Selection Dialog */}
      <Dialog open={showVoucherDialog} onOpenChange={setShowVoucherDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn voucher giảm giá</DialogTitle>
            <DialogDescription>
              {applicableVouchers.length > 0 ? (
                <span>
                  <span className="text-green-600 font-semibold">{applicableVouchers.length}</span> voucher có thể sử dụng
                </span>
              ) : (
                <span className="text-orange-600">Không có voucher khả dụng</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Best deal indicator */}
          {applicableVouchers.length > 0 && !selectedVoucher && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-3 -mt-2">
              <p className="text-xs text-orange-800">
                💰 Tiết kiệm tối đa: <span className="font-bold">
                  {Math.max(...applicableVouchers.map(v => calculateVoucherDiscount(v))).toLocaleString('vi-VN')}₫
                </span>
              </p>
            </div>
          )}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {applicableVouchers.map((voucher, index) => {
              const getVoucherColor = (code: string) => {
                if (code.includes('VIP') || code.includes('MEGA')) return 'purple';
                if (code.includes('FLASH') || code.includes('SALE')) return 'red';
                if (code.includes('FREE')) return 'green';
                if (code.includes('NEW')) return 'blue';
                return 'orange';
              };

              const color = getVoucherColor(voucher.code);
              const isSelected = selectedVoucher?.id === voucher.id;
              const isBestDeal = index === 0; // First voucher is the best deal

              return (
                <Card
                  key={voucher.id}
                  className={`cursor-pointer transition-all hover:shadow-md relative ${isSelected ? `border-${color}-600 bg-${color}-50 shadow-md` : 'hover:border-gray-400'
                    } ${isBestDeal ? 'border-2 border-orange-400' : ''}`}
                  onClick={() => {
                    setSelectedVoucher(voucher);
                    setShowVoucherDialog(false);
                    toast.success('Đã áp dụng voucher');
                  }}
                >
                  {isBestDeal && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg z-10">
                      ⭐ Tốt nhất
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${color === 'purple' ? 'from-purple-500 to-purple-600' :
                        color === 'red' ? 'from-red-500 to-red-600' :
                          color === 'green' ? 'from-green-500 to-green-600' :
                            color === 'blue' ? 'from-blue-500 to-blue-600' :
                              'from-orange-500 to-orange-600'
                        }`}>
                        <Tag className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className={`font-bold text-sm ${color === 'purple' ? 'text-purple-700' :
                            color === 'red' ? 'text-red-700' :
                              color === 'green' ? 'text-green-700' :
                                color === 'blue' ? 'text-blue-700' :
                                  'text-orange-700'
                            }`}>{voucher.code}</p>
                          {isSelected && (
                            <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${color === 'purple' ? 'text-purple-600' :
                              color === 'red' ? 'text-red-600' :
                                color === 'green' ? 'text-green-600' :
                                  color === 'blue' ? 'text-blue-600' :
                                    'text-orange-600'
                              }`} />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{voucher.description}</p>
                        {voucher.discount > 0 && (
                          <Badge variant="outline" className={`text-xs ${color === 'purple' ? 'border-purple-300 bg-purple-100 text-purple-700' :
                            color === 'red' ? 'border-red-300 bg-red-100 text-red-700' :
                              color === 'green' ? 'border-green-300 bg-green-100 text-green-700' :
                                color === 'blue' ? 'border-blue-300 bg-blue-100 text-blue-700' :
                                  'border-orange-300 bg-orange-100 text-orange-700'
                            }`}>
                            Giảm {voucher.discount.toLocaleString('vi-VN')}₫
                          </Badge>
                        )}
                        {voucher.maxDiscount && (
                          <Badge variant="outline" className={`text-xs ml-1 ${color === 'purple' ? 'border-purple-300 bg-purple-100 text-purple-700' :
                            color === 'red' ? 'border-red-300 bg-red-100 text-red-700' :
                              color === 'green' ? 'border-green-300 bg-green-100 text-green-700' :
                                color === 'blue' ? 'border-blue-300 bg-blue-100 text-blue-700' :
                                  'border-orange-300 bg-orange-100 text-orange-700'
                            }`}>
                            Tối đa {voucher.maxDiscount.toLocaleString('vi-VN')}₫
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {selectedVoucher && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedVoucher(null);
                  setShowVoucherDialog(false);
                  toast.success('Đã bỏ chọn voucher');
                }}
              >
                Bỏ chọn voucher
              </Button>
            )}

            {/* Unavailable Vouchers */}
            {unavailableVouchers.length > 0 && (
              <>
                <Separator className="my-2" />
                <p className="text-xs text-gray-500 px-1">Voucher chưa đủ điều kiện ({unavailableVouchers.length})</p>
                {unavailableVouchers.map((voucher) => {
                  const getVoucherColor = (code: string) => {
                    if (code.includes('VIP') || code.includes('MEGA')) return 'purple';
                    if (code.includes('FLASH') || code.includes('SALE')) return 'red';
                    if (code.includes('FREE')) return 'green';
                    if (code.includes('NEW')) return 'blue';
                    return 'orange';
                  };

                  const color = getVoucherColor(voucher.code);
                  const needMore = voucher.minOrder - subtotal;

                  return (
                    <Card
                      key={voucher.id}
                      className="opacity-50 cursor-not-allowed"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${color === 'purple' ? 'from-purple-500 to-purple-600' :
                            color === 'red' ? 'from-red-500 to-red-600' :
                              color === 'green' ? 'from-green-500 to-green-600' :
                                color === 'blue' ? 'from-blue-500 to-blue-600' :
                                  'from-orange-500 to-orange-600'
                            } opacity-50`}>
                            <Tag className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-600">{voucher.code}</p>
                            <p className="text-xs text-gray-500 mb-2">{voucher.description}</p>
                            <Badge variant="outline" className="text-xs border-red-300 bg-red-50 text-red-700">
                              Mua thêm {needMore.toLocaleString('vi-VN')}₫
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-semibold text-blue-600">{total.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-semibold">{paymentMethod === 'cash' ? 'COD' : 'Online'}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Bạn có thể theo dõi đơn hàng tại mục "Đơn hàng"
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
