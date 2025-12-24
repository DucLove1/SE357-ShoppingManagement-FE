import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Eye, Check, X, Truck, Package as PackageIcon, Users, Filter } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { OrderStatus } from '../types';
import { SellerOrdersByCustomer } from './SellerOrdersByCustomer';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentStatus?: string;
  paymentMethod?: string;
  itemCount?: number;
  items?: { name: string; quantity: number; price: number }[];
}

const mapStatus = (s: string | undefined): OrderStatus => {
  switch ((s || '').toLowerCase()) {
    case 'pending': return 'pending';
    case 'confirmed': return 'confirmed';
    case 'processing': return 'processing';
    case 'shipping': case 'shipped': return 'shipping';
    case 'delivered': return 'delivered';
    case 'completed': return 'completed';
    case 'refunded': return 'refunded';
    case 'cancelled': case 'canceled': return 'cancelled';
    default: return 'pending';
  }
};

export function SellerOrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/api/orders/seller', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const list = res.data?.data?.orders || [];
        const normalized: Order[] = list.map((o: any) => ({
          id: String(o.id),
          orderNumber: o.order_number,
          customerName: 'Khách hàng',
          date: o.created_at,
          total: Number(o.total ?? 0),
          status: mapStatus(o.status),
          paymentStatus: o.payment_status,
          paymentMethod: o.payment_method,
          itemCount: o.item_count,
          items: [],
        }));
        if (active) setOrders(normalized);
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Không thể tải đơn hàng người bán');
        console.error(e);
      }
    };
    fetchOrders();
    return () => { active = false; };
  }, []);

  const fetchOrderDetail = async (orderId: string) => {
    setDetailLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`/api/orders/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const o = res.data?.data || {};
      const itemsSrc = Array.isArray(o.items) ? o.items : [];
      const items = itemsSrc.map((it: any) => ({
        name: it.product_name || it.name || 'Sản phẩm',
        quantity: Number(it.quantity ?? 1),
        price: Number(it.price ?? it.unit_price ?? 0),
      }));

      setSelectedOrder(prev => prev ? {
        ...prev,
        customerName: o.customer_name || prev.customerName,
        total: Number(o.total ?? prev.total ?? 0),
        status: mapStatus(o.status || prev.status),
        paymentStatus: o.payment_status || prev.paymentStatus,
        paymentMethod: o.payment_method || prev.paymentMethod,
        itemCount: o.item_count ?? prev.itemCount,
        items,
      } : prev);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredOrders = (status: OrderStatus | 'all') => {
    const byStatus = status === 'all' ? orders : orders.filter((o) => o.status === status);
    return byStatus.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<
      OrderStatus,
      { variant: 'default' | 'destructive' | 'secondary' | 'outline'; label: string }
    > = {
      pending: { variant: 'secondary', label: 'Chờ xử lý' },
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    fetchOrderDetail(order.id);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    toast.success('Đã cập nhật trạng thái đơn hàng');
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusCount = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const renderOrderRow = (order: Order) => (
    <TableRow key={order.id}>
      <TableCell>{order.orderNumber}</TableCell>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
      <TableCell>{order.total.toLocaleString('vi-VN')} ₫</TableCell>
      <TableCell>{getStatusBadge(order.status)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order)}>
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );

  const renderMobileCard = (order: Order) => (
    <Card key={order.id} className="p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-sm">{order.orderNumber}</p>
          <p className="text-xs text-gray-500">{order.customerName}</p>
        </div>
        {getStatusBadge(order.status)}
      </div>
      <div className="space-y-0.5 text-sm mb-3">
        <p className="text-gray-600 text-xs">Ngày: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
        <p className="font-semibold text-sm">{order.total.toLocaleString('vi-VN')} ₫</p>
      </div>
      <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => handleViewDetails(order)}>
        <Eye className="h-3 w-3 mr-1.5" />
        Xem chi tiết
      </Button>
    </Card>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="mb-1">Quản lý đơn hàng</h1>
        <p className="text-gray-500 text-sm">Xử lý và theo dõi đơn hàng</p>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="inline-flex w-auto min-w-full lg:grid lg:w-full lg:grid-cols-9">
            <TabsTrigger value="all" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Tất cả ({getStatusCount('all')})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Chờ ({getStatusCount('pending')})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Xác nhận ({getStatusCount('confirmed')})
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Xử lý ({getStatusCount('processing')})
            </TabsTrigger>
            <TabsTrigger value="shipping" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Giao ({getStatusCount('shipping')})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Đã giao ({getStatusCount('delivered')})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Xong ({getStatusCount('completed')})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Hủy ({getStatusCount('cancelled')})
            </TabsTrigger>
            <TabsTrigger value="refunded" className="text-xs px-2 lg:px-4 whitespace-nowrap">
              Hoàn ({getStatusCount('refunded')})
            </TabsTrigger>
          </TabsList>
        </div>

        {(['all', 'pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'refunded'] as const).map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            {/* Desktop Table */}
            <div className="hidden md:block border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders(status).map(renderOrderRow)}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredOrders(status).map(renderMobileCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>Thông tin chi tiết và cập nhật trạng thái</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt</p>
                  <p>{new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng tiền</p>
                  <p className="font-semibold">{selectedOrder.total.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Sản phẩm</p>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>SL</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">Đang tải chi tiết...</TableCell>
                        </TableRow>
                      ) : selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.price.toLocaleString('vi-VN')} ₫</TableCell>
                            <TableCell>{(item.quantity * item.price).toLocaleString('vi-VN')} ₫</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            {selectedOrder.itemCount ? `${selectedOrder.itemCount} sản phẩm` : 'Không có dữ liệu sản phẩm'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Status update buttons */}
              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'refunded' && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}>
                        <Check className="h-4 w-4 mr-2" />
                        Xác nhận đơn
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}>
                        <X className="h-4 w-4 mr-2" />
                        Hủy đơn
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <Button className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}>
                      <PackageIcon className="h-4 w-4 mr-2" />
                      Bắt đầu xử lý
                    </Button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <Button className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, 'shipping')}>
                      <Truck className="h-4 w-4 mr-2" />
                      Chuyển sang đang giao
                    </Button>
                  )}
                  {selectedOrder.status === 'shipping' && (
                    <Button className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}>
                      <Check className="h-4 w-4 mr-2" />
                      Đã giao hàng
                    </Button>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <Button className="flex-1" onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}>
                      <Check className="h-4 w-4 mr-2" />
                      Hoàn thành
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}