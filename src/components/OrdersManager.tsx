import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Search, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { name: string; quantity: number; price: number }[];
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'DH001',
    customerName: 'Nguyễn Văn A',
    date: '2025-11-08',
    total: 1340000,
    status: 'delivered',
    items: [
      { name: 'Áo thun nam cổ tròn', quantity: 2, price: 199000 },
      { name: 'Túi xách nữ da PU', quantity: 3, price: 320000 },
    ],
  },
  {
    id: '2',
    orderNumber: 'DH002',
    customerName: 'Trần Thị B',
    date: '2025-11-07',
    total: 450000,
    status: 'shipped',
    items: [{ name: 'Quần jean nữ skinny', quantity: 1, price: 450000 }],
  },
  {
    id: '3',
    orderNumber: 'DH003',
    customerName: 'Lê Văn C',
    date: '2025-11-06',
    total: 890000,
    status: 'processing',
    items: [{ name: 'Giày thể thao nam', quantity: 1, price: 890000 }],
  },
  {
    id: '4',
    orderNumber: 'DH004',
    customerName: 'Phạm Thị D',
    date: '2025-11-05',
    total: 1100000,
    status: 'pending',
    items: [{ name: 'Áo khoác hoodie', quantity: 2, price: 550000 }],
  },
  {
    id: '5',
    orderNumber: 'DH005',
    customerName: 'Hoàng Văn E',
    date: '2025-11-04',
    total: 640000,
    status: 'cancelled',
    items: [{ name: 'Túi xách nữ da PU', quantity: 2, price: 320000 }],
  },
];

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig: Record<
      Order['status'],
      { variant: 'default' | 'destructive' | 'secondary' | 'outline'; label: string }
    > = {
      pending: { variant: 'secondary', label: 'Chờ xử lý' },
      processing: { variant: 'default', label: 'Đang xử lý' },
      shipped: { variant: 'outline', label: 'Đang giao' },
      delivered: { variant: 'default', label: 'Đã giao' },
      cancelled: { variant: 'destructive', label: 'Đã hủy' },
    };
    return <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>;
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Quản lý đơn hàng</h1>
        <p className="text-gray-500">Danh sách tất cả đơn hàng</p>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="shipped">Đang giao</SelectItem>
            <SelectItem value="delivered">Đã giao</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
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
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{order.total.toLocaleString('vi-VN')} ₫</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt</p>
                  <p>{new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng tiền</p>
                  <p className="font-semibold">{selectedOrder.total.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Sản phẩm</p>
                <div className="border rounded-lg">
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
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.price.toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell>
                            {(item.quantity * item.price).toLocaleString('vi-VN')} ₫
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
