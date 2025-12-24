import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, MessageCircle, Star, FileText, RotateCcw } from 'lucide-react';
import { OrderStatus } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: OrderStatus;
  sellerName: string;
  trackingNumber?: string;
  items: { name: string; quantity: number; price: number; image: string }[];
}

const mapStatus = (s: string | undefined): OrderStatus => {
  switch ((s || '').toLowerCase()) {
    case 'pending':
      return 'pending';
    case 'confirmed':
      return 'confirmed';
    case 'processing':
      return 'processing';
    case 'shipping':
      return 'shipping';
    case 'delivered':
      return 'delivered';
    case 'completed':
      return 'completed';
    case 'refunded':
      return 'refunded';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

interface CustomerOrdersProps {
  onViewOrderDetail?: (orderId: string) => void;
  onViewTracking?: (orderId: string) => void;
  onViewReturns?: () => void;
}

export function CustomerOrders({ onViewOrderDetail, onViewTracking, onViewReturns }: CustomerOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/api/orders/my-orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = res.data?.data?.orders || [];
        const normalized: Order[] = data.map((o: any) => {
          // For now, create placeholder items since API doesn't return items in list view
          const items = Array.isArray(o.items) ? o.items.map((it: any) => ({
            name: it.name || it.product_name || 'Sản phẩm',
            quantity: Number(it.quantity ?? 1),
            price: Number(it.price ?? it.unit_price ?? 0),
            image: it.image || '📦',
          })) : [];

          // Use item_count to show number of items if items array not available
          const itemCount = o.item_count || items.length || 0;

          return {
            id: String(o.id),
            orderNumber: o.order_number,
            date: o.created_at,
            total: Number(o.total),
            status: mapStatus(o.status),
            sellerName: 'Người bán',
            trackingNumber: o.tracking_number,
            items: items.length > 0 ? items : [{
              name: `${itemCount} sản phẩm`,
              quantity: itemCount,
              price: Number(o.total) / (itemCount || 1),
              image: '📦',
            }],
          } as Order;
        });
        if (active) setOrders(normalized);
      } catch (e) {
        toast.error('Không tải được danh sách đơn hàng');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      active = false;
    };
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<
      OrderStatus,
      { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }
    > = {
      pending: { variant: 'secondary', label: 'Chờ xác nhận' },
      confirmed: { variant: 'default', label: 'Đã xác nhận' },
      processing: { variant: 'default', label: 'Đang xử lý' },
      shipping: { variant: 'outline', label: 'Đang giao' },
      delivered: { variant: 'default', label: 'Đã giao' },
      completed: { variant: 'default', label: 'Hoàn thành' },
      cancelled: { variant: 'destructive', label: 'Đã hủy' },
      refunded: { variant: 'secondary', label: 'Đã hoàn tiền' },
    };
    return <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>;
  };

  const filterOrdersByStatus = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders;
    return orders.filter((order) => order.status === status);
  };

  const handleConfirmReceived = (orderId: string) => {
    toast.success('Đã xác nhận nhận hàng thành công');
    // Update order status to completed
  };

  const handleReview = (order: Order) => {
    setSelectedOrder(order);
    setIsReviewOpen(true);
  };

  const handleSubmitReview = () => {
    toast.success('Đã gửi đánh giá thành công');
    setIsReviewOpen(false);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleReturnRequest = (order: Order) => {
    setSelectedOrder(order);
    setIsReturnOpen(true);
  };

  const handleSubmitReturn = () => {
    toast.success('Đã gửi yêu cầu trả hàng');
    setIsReturnOpen(false);
    setReturnReason('');
  };

  const renderOrderCard = (order: Order) => (
    <Card key={order.id}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-sm sm:text-base">{order.orderNumber}</CardTitle>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              {new Date(order.date).toLocaleDateString('vi-VN')} • {order.sellerName}
            </p>
            {order.trackingNumber && (
              <p className="text-xs text-blue-600 mt-1">
                Mã vận đơn: {order.trackingNumber}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-xl sm:text-2xl">{item.image}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-500">x{item.quantity}</p>
              </div>
              <p className="text-xs sm:text-sm">{item.price.toLocaleString('vi-VN')} ₫</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t mb-3">
          <span className="text-sm text-gray-600">Tổng cộng</span>
          <span className="font-semibold text-base sm:text-lg">{order.total.toLocaleString('vi-VN')} ₫</span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {order.status === 'shipping' ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
              onClick={() => {
                if (onViewTracking) {
                  onViewTracking(order.id);
                }
              }}
            >
              <Package className="h-4 w-4 mr-2" />
              Theo dõi đơn hàng
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onViewOrderDetail) {
                  onViewOrderDetail(order.id);
                } else {
                  setSelectedOrder(order);
                  setIsDetailOpen(true);
                }
              }}
            >
              <Package className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
          )}

          {order.status === 'delivered' && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleConfirmReceived(order.id)}
              >
                Đã nhận hàng
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReturnRequest(order)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Trả hàng
              </Button>
            </>
          )}

          {order.status === 'completed' && (
            <Button variant="outline" size="sm" onClick={() => handleReview(order)}>
              <Star className="h-4 w-4 mr-2" />
              Đánh giá
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Nhắn tin
          </Button>

          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Hóa đơn
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="mb-1">Đơn hàng của tôi</h1>
        <p className="text-gray-500 text-sm">Theo dõi và quản lý đơn hàng</p>
      </div>

      {/* Quick Action */}
      {onViewReturns && (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={onViewReturns}
            className="w-full sm:w-auto gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <RotateCcw className="h-4 w-4" />
            Xem yêu cầu trả hàng/hoàn tiền
          </Button>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full lg:grid lg:w-full lg:grid-cols-8">
            <TabsTrigger value="all" className="text-xs px-3 lg:px-4">Tất cả</TabsTrigger>
            <TabsTrigger value="processing" className="text-xs px-3 lg:px-4">Xử lý</TabsTrigger>
            <TabsTrigger value="shipping" className="text-xs px-3 lg:px-4">Đang giao</TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs px-3 lg:px-4">Đã giao</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-3 lg:px-4">Hoàn thành</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs px-3 lg:px-4">Đã hủy</TabsTrigger>
            <TabsTrigger value="refunded" className="text-xs px-3 lg:px-4">Hoàn tiền</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs px-3 lg:px-4">Chờ</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4 mt-4">
          {loading && (
            <Card>
              <CardContent className="py-6 text-center text-sm text-gray-500">Đang tải đơn hàng...</CardContent>
            </Card>
          )}
          {!loading && filterOrdersByStatus('all').length === 0 && (
            <Card>
              <CardContent className="py-6 text-center text-sm text-gray-500">Bạn chưa có đơn hàng nào</CardContent>
            </Card>
          )}
          {!loading && filterOrdersByStatus('all').map(renderOrderCard)}
        </TabsContent>
        <TabsContent value="processing" className="space-y-4 mt-4">
          {filterOrdersByStatus('processing').map(renderOrderCard)}
        </TabsContent>
        <TabsContent value="shipping" className="space-y-4 mt-4">
          {filterOrdersByStatus('shipping').map(renderOrderCard)}
        </TabsContent>
        <TabsContent value="delivered" className="space-y-4 mt-4">
          {filterOrdersByStatus('delivered').map(renderOrderCard)}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4 mt-4">
          {filterOrdersByStatus('completed').map(renderOrderCard)}
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-4 mt-4">
          {filterOrdersByStatus('cancelled').map(renderOrderCard)}
        </TabsContent>
        <TabsContent value="refunded" className="space-y-4 mt-4">
          {filterOrdersByStatus('refunded').map(renderOrderCard)}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4 mt-4">
          {filterOrdersByStatus('pending').map(renderOrderCard)}
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>Thông tin chi tiết về đơn hàng của bạn</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Người bán</p>
                  <p>{selectedOrder.sellerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt</p>
                  <p>{new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                {selectedOrder.trackingNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Mã vận đơn</p>
                    <p className="text-blue-600">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh giá đơn hàng</DialogTitle>
            <DialogDescription>Chia sẻ trải nghiệm của bạn với sản phẩm</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Chọn số sao</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className={`text-2xl ${star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-2">Nhận xét của bạn</p>
              <Textarea
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitReview}>Gửi đánh giá</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Request Dialog */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yêu cầu trả hàng/hoàn tiền</DialogTitle>
            <DialogDescription>Vui lòng cho chúng tôi biết lý do</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Lý do trả hàng..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsReturnOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitReturn}>Gửi yêu cầu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
