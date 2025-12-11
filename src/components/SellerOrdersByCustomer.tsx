import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Eye, User, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { OrderStatus } from '../types';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: { name: string; quantity: number; price: number }[];
}

interface CustomerStats {
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
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
    id: '7',
    orderNumber: 'DH007',
    customerName: 'Nguyễn Văn A',
    date: '2025-10-20',
    total: 890000,
    status: 'completed',
    items: [{ name: 'Giày thể thao nam', quantity: 1, price: 890000 }],
  },
  {
    id: '8',
    orderNumber: 'DH008',
    customerName: 'Nguyễn Văn A',
    date: '2025-09-15',
    total: 450000,
    status: 'completed',
    items: [{ name: 'Quần jean nữ skinny', quantity: 1, price: 450000 }],
  },
  {
    id: '2',
    orderNumber: 'DH002',
    customerName: 'Trần Thị B',
    date: '2025-11-07',
    total: 450000,
    status: 'shipping',
    items: [{ name: 'Quần jean nữ skinny', quantity: 1, price: 450000 }],
  },
  {
    id: '9',
    orderNumber: 'DH009',
    customerName: 'Trần Thị B',
    date: '2025-10-25',
    total: 550000,
    status: 'completed',
    items: [{ name: 'Áo khoác hoodie', quantity: 1, price: 550000 }],
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
  {
    id: '6',
    orderNumber: 'DH006',
    customerName: 'Nguyễn Thị F',
    date: '2025-11-03',
    total: 450000,
    status: 'completed',
    items: [{ name: 'Quần jean nữ skinny', quantity: 1, price: 450000 }],
  },
];

export function SellerOrdersByCustomer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerStats | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Group orders by customer
  const customerStats: CustomerStats[] = Object.values(
    mockOrders.reduce((acc, order) => {
      if (!acc[order.customerName]) {
        acc[order.customerName] = {
          name: order.customerName,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.date,
          orders: [],
        };
      }
      acc[order.customerName].totalOrders += 1;
      acc[order.customerName].totalSpent += order.total;
      acc[order.customerName].orders.push(order);
      // Update last order date if newer
      if (new Date(order.date) > new Date(acc[order.customerName].lastOrderDate)) {
        acc[order.customerName].lastOrderDate = order.date;
      }
      return acc;
    }, {} as Record<string, CustomerStats>)
  ).sort((a, b) => b.totalSpent - a.totalSpent);

  const filteredCustomers = customerStats.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleViewCustomer = (customer: CustomerStats) => {
    // Sort orders by date (newest first)
    const sortedOrders = [...customer.orders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setSelectedCustomer({ ...customer, orders: sortedOrders });
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mb-1 sm:mb-2">Đơn hàng theo khách hàng</h1>
        <p className="text-gray-500 text-sm">Xem lịch sử mua hàng của từng khách hàng</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Tổng khách hàng</p>
                <p className="text-xl sm:text-2xl mt-1">{customerStats.length}</p>
              </div>
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Tổng đơn hàng</p>
                <p className="text-xl sm:text-2xl mt-1">{mockOrders.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Giá trị TB/KH</p>
                <p className="text-xl sm:text-2xl mt-1">
                  {(customerStats.reduce((sum, c) => sum + c.totalSpent, 0) / customerStats.length / 1000).toFixed(0)}k
                </p>
              </div>
              <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">ĐH TB/Khách</p>
                <p className="text-xl sm:text-2xl mt-1">
                  {(mockOrders.length / customerStats.length).toFixed(1)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <Input
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Tổng đơn hàng</TableHead>
              <TableHead>Tổng chi tiêu</TableHead>
              <TableHead>Đơn gần nhất</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.totalOrders} đơn</Badge>
                  </TableCell>
                  <TableCell>{customer.totalSpent.toLocaleString('vi-VN')} ₫</TableCell>
                  <TableCell>{new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
                      <Eye className="h-3 w-3 mr-1.5" />
                      Xem đơn hàng
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Không tìm thấy khách hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <Card key={customer.name}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{customer.name}</p>
                    <p className="text-xs text-gray-500">
                      Đơn gần nhất: {new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Tổng đơn</p>
                    <p className="text-sm">{customer.totalOrders} đơn</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Tổng chi tiêu</p>
                    <p className="text-sm">{(customer.totalSpent / 1000).toFixed(0)}k</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8"
                  onClick={() => handleViewCustomer(customer)}
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  Xem đơn hàng
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500 text-sm">
              Không tìm thấy khách hàng nào
            </CardContent>
          </Card>
        )}
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lịch sử đơn hàng - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Tổng {selectedCustomer?.totalOrders} đơn hàng • Chi tiêu:{' '}
              {selectedCustomer?.totalSpent.toLocaleString('vi-VN')} ₫
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              {/* Customer Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Tổng đơn hàng</p>
                  <p className="text-xl mt-1">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Tổng chi tiêu</p>
                  <p className="text-xl mt-1">{(selectedCustomer.totalSpent / 1000000).toFixed(1)}tr</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Giá trị TB/đơn</p>
                  <p className="text-xl mt-1">
                    {(selectedCustomer.totalSpent / selectedCustomer.totalOrders / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Đơn gần nhất</p>
                  <p className="text-sm mt-1">
                    {new Date(selectedCustomer.lastOrderDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Orders List */}
              <div>
                <h3 className="text-sm mb-3">Danh sách đơn hàng ({selectedCustomer.orders.length})</h3>
                
                {/* Desktop Table */}
                <div className="hidden md:block border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCustomer.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              {order.items.map((item, idx) => (
                                <p key={idx} className="text-xs text-gray-600">
                                  {item.name} x{item.quantity}
                                </p>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{order.total.toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {selectedCustomer.orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm">{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="space-y-1 mb-2">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                              • {item.name} x{item.quantity}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm">{order.total.toLocaleString('vi-VN')} ₫</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
