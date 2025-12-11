import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Eye, Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reason: string;
  items: { name: string; quantity: number; price: number }[];
}

const mockReturns: ReturnRequest[] = [
  {
    id: '1',
    returnNumber: 'RT001',
    orderNumber: 'DH012',
    customerName: 'Nguyễn Văn A',
    date: '2025-11-10',
    amount: 398000,
    status: 'pending',
    reason: 'Sản phẩm bị lỗi',
    items: [{ name: 'Áo thun nam cổ tròn', quantity: 2, price: 199000 }],
  },
  {
    id: '2',
    returnNumber: 'RT002',
    orderNumber: 'DH015',
    customerName: 'Trần Thị B',
    date: '2025-11-09',
    amount: 450000,
    status: 'approved',
    reason: 'Sai màu sắc',
    items: [{ name: 'Quần jean nữ skinny', quantity: 1, price: 450000 }],
  },
  {
    id: '3',
    returnNumber: 'RT003',
    orderNumber: 'DH018',
    customerName: 'Lê Văn C',
    date: '2025-11-08',
    amount: 320000,
    status: 'completed',
    reason: 'Không vừa size',
    items: [{ name: 'Túi xách nữ da PU', quantity: 1, price: 320000 }],
  },
  {
    id: '4',
    returnNumber: 'RT004',
    orderNumber: 'DH020',
    customerName: 'Phạm Thị D',
    date: '2025-11-07',
    amount: 550000,
    status: 'rejected',
    reason: 'Thay đổi ý định',
    items: [{ name: 'Áo khoác hoodie', quantity: 1, price: 550000 }],
  },
];

export function SellerReturns() {
  const [returns, setReturns] = useState<ReturnRequest[]>(mockReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filteredReturns = (status: ReturnRequest['status'] | 'all') => {
    const byStatus = status === 'all' ? returns : returns.filter((r) => r.status === status);
    return byStatus.filter(
      (ret) =>
        ret.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ret.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ret.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getStatusBadge = (status: ReturnRequest['status']) => {
    const config = {
      pending: { variant: 'secondary' as const, label: 'Chờ duyệt' },
      approved: { variant: 'default' as const, label: 'Đã duyệt' },
      rejected: { variant: 'destructive' as const, label: 'Từ chối' },
      completed: { variant: 'outline' as const, label: 'Hoàn thành' },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  const getStatusCount = (status: ReturnRequest['status'] | 'all') => {
    if (status === 'all') return returns.length;
    return returns.filter((r) => r.status === status).length;
  };

  const handleViewDetail = (returnReq: ReturnRequest) => {
    setSelectedReturn(returnReq);
    setIsDetailOpen(true);
    setRejectReason('');
  };

  const handleApprove = () => {
    if (!selectedReturn) return;
    setReturns(returns.map((r) => (r.id === selectedReturn.id ? { ...r, status: 'approved' } : r)));
    toast.success('Đã duyệt yêu cầu trả hàng');
    setSelectedReturn({ ...selectedReturn, status: 'approved' });
  };

  const handleReject = () => {
    if (!selectedReturn || !rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    setReturns(returns.map((r) => (r.id === selectedReturn.id ? { ...r, status: 'rejected' } : r)));
    toast.success('Đã từ chối yêu cầu trả hàng');
    setSelectedReturn({ ...selectedReturn, status: 'rejected' });
    setRejectReason('');
  };

  const handleComplete = () => {
    if (!selectedReturn) return;
    setReturns(returns.map((r) => (r.id === selectedReturn.id ? { ...r, status: 'completed' } : r)));
    toast.success('Đã hoàn thành xử lý trả hàng');
    setSelectedReturn({ ...selectedReturn, status: 'completed' });
  };

  const renderMobileCard = (returnReq: ReturnRequest) => (
    <Card key={returnReq.id} className="p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm">{returnReq.returnNumber}</p>
          <p className="text-xs text-gray-500">{returnReq.orderNumber}</p>
        </div>
        {getStatusBadge(returnReq.status)}
      </div>
      <div className="space-y-1 mb-3">
        <p className="text-xs text-gray-600">{returnReq.customerName}</p>
        <p className="text-xs text-gray-500">{new Date(returnReq.date).toLocaleDateString('vi-VN')}</p>
        <p className="text-sm">{returnReq.amount.toLocaleString('vi-VN')} ₫</p>
      </div>
      <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => handleViewDetail(returnReq)}>
        <Eye className="h-3 w-3 mr-1.5" />
        Xem chi tiết
      </Button>
    </Card>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="mb-1 sm:mb-2">Quản lý trả hàng</h1>
        <p className="text-gray-500 text-sm">Xử lý yêu cầu trả hàng & hoàn tiền</p>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm yêu cầu trả hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="inline-flex w-auto min-w-full lg:grid lg:w-full lg:grid-cols-5">
            <TabsTrigger value="all" className="text-xs px-3 lg:px-4 whitespace-nowrap">
              Tất cả ({getStatusCount('all')})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs px-3 lg:px-4 whitespace-nowrap">
              Chờ duyệt ({getStatusCount('pending')})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs px-3 lg:px-4 whitespace-nowrap">
              Đã duyệt ({getStatusCount('approved')})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-3 lg:px-4 whitespace-nowrap">
              Hoàn thành ({getStatusCount('completed')})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs px-3 lg:px-4 whitespace-nowrap">
              Từ chối ({getStatusCount('rejected')})
            </TabsTrigger>
          </TabsList>
        </div>

        {(['all', 'pending', 'approved', 'completed', 'rejected'] as const).map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            {/* Desktop Table */}
            <div className="hidden md:block border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã trả hàng</TableHead>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày yêu cầu</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReturns(status).map((returnReq) => (
                    <TableRow key={returnReq.id}>
                      <TableCell>{returnReq.returnNumber}</TableCell>
                      <TableCell>{returnReq.orderNumber}</TableCell>
                      <TableCell>{returnReq.customerName}</TableCell>
                      <TableCell>{new Date(returnReq.date).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>{returnReq.amount.toLocaleString('vi-VN')} ₫</TableCell>
                      <TableCell>{getStatusBadge(returnReq.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetail(returnReq)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredReturns(status).map(renderMobileCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu trả hàng {selectedReturn?.returnNumber}</DialogTitle>
            <DialogDescription>Xem và xử lý yêu cầu trả hàng</DialogDescription>
          </DialogHeader>

          {selectedReturn && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn hàng</p>
                  <p>{selectedReturn.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p>{selectedReturn.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                  <p>{new Date(selectedReturn.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <div className="mt-1">{getStatusBadge(selectedReturn.status)}</div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Lý do trả hàng</p>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <p className="text-sm">{selectedReturn.reason}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Sản phẩm trả lại</p>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>SL</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReturn.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.price.toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell>{(item.quantity * item.price).toLocaleString('vi-VN')} ₫</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center mt-2 p-3 bg-gray-50 rounded-lg">
                  <p>Tổng tiền hoàn trả:</p>
                  <p className="text-lg">{selectedReturn.amount.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>

              {selectedReturn.status === 'pending' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">Lý do từ chối (nếu có)</label>
                    <Textarea
                      placeholder="Nhập lý do từ chối yêu cầu..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleApprove}>
                      <Check className="h-4 w-4 mr-2" />
                      Duyệt yêu cầu
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={handleReject}>
                      <X className="h-4 w-4 mr-2" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              )}

              {selectedReturn.status === 'approved' && (
                <Button className="w-full" onClick={handleComplete}>
                  <Check className="h-4 w-4 mr-2" />
                  Xác nhận hoàn thành
                </Button>
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
