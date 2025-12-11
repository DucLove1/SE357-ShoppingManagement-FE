import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Package, MapPin, Truck, CreditCard, FileText, MessageCircle, Star, RotateCcw } from 'lucide-react';
import { OrderStatus } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface OrderDetailProps {
  order: {
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    status: OrderStatus;
    sellerName: string;
    trackingNumber?: string;
    items: { name: string; quantity: number; price: number; image: string }[];
  };
  onBack: () => void;
  onViewInvoice: (orderId: string) => void;
  onChatWithSeller: () => void;
  onReturnOrder?: () => void;
}

const statusInfo: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800' },
};

export function OrderDetail({ order, onBack, onViewInvoice, onChatWithSeller, onReturnOrder }: OrderDetailProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleSubmitReview = () => {
    toast.success('Đánh giá đã được gửi');
    setShowReviewDialog(false);
    setReviewText('');
    setRating(5);
  };



  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Chi tiết đơn hàng</h1>
              <p className="text-xs text-gray-500">{order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-2xl space-y-3">
        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">Trạng thái</span>
              </div>
              <Badge className={statusInfo[order.status].color}>
                {statusInfo[order.status].label}
              </Badge>
            </div>
            {order.trackingNumber && (
              <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Mã vận đơn</p>
                  <p className="font-semibold text-sm">{order.trackingNumber}</p>
                </div>
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Địa chỉ giao hàng</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-sm mb-1">Nguyễn Văn A</p>
            <p className="text-sm text-gray-600 mb-1">0901234567</p>
            <p className="text-sm text-gray-600">123 Đường ABC, Phường 1, Quận 1, TP.HCM</p>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sản phẩm đã đặt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1 line-clamp-2">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">x{item.quantity}</span>
                    <span className="text-sm font-semibold">{item.price.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Thông tin thanh toán</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>{shippingFee.toLocaleString('vi-VN')} ₫</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span className="text-blue-600">{order.total.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Phương thức thanh toán</p>
              <p className="text-sm font-medium">Thanh toán khi nhận hàng (COD)</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onChatWithSeller}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Chat với shop
          </Button>
          <Button
            variant="outline"
            onClick={() => onViewInvoice(order.id)}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Xem hóa đơn
          </Button>
        </div>

        {order.status === 'delivered' && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowReviewDialog(true)}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Đánh giá
            </Button>
            <Button
              variant="outline"
              onClick={onReturnOrder}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Trả hàng
            </Button>
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đánh giá sản phẩm</DialogTitle>
            <DialogDescription>Chia sẻ trải nghiệm của bạn về sản phẩm</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Chất lượng sản phẩm</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-2">Nhận xét</p>
              <Textarea
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmitReview} className="w-full">
              Gửi đánh giá
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
