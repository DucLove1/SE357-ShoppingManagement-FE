import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, ChevronRight, Package, Clock, CheckCircle2, XCircle, Truck, RefreshCw, ArrowLeft } from 'lucide-react';

interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'shipping_back' | 'received' | 'refunded';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  refundAmount: number;
  reason: string;
  createdAt: string;
  updatedAt?: string;
}

interface CustomerReturnsProps {
  onViewDetail: (returnId: string) => void;
  onBack?: () => void;
}

const statusInfo: Record<ReturnRequest['status'], { label: string; color: string; icon: any }> = {
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  approved: { label: 'Đã duyệt', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: XCircle },
  shipping_back: { label: 'Đang gửi trả', color: 'bg-purple-100 text-purple-800', icon: Truck },
  received: { label: 'Đã nhận hàng', color: 'bg-green-100 text-green-800', icon: Package },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
};

const mockReturns: ReturnRequest[] = [
  {
    id: '1',
    returnNumber: 'TH001',
    orderNumber: 'DH012',
    date: '2025-11-09',
    status: 'pending',
    items: [
      { id: '1', name: 'Áo thun nam cổ tròn', quantity: 2, price: 199000, image: '👕' },
    ],
    refundAmount: 398000,
    reason: 'Sản phẩm không đúng size',
    createdAt: '2025-11-09T10:30:00',
  },
  {
    id: '2',
    returnNumber: 'TH002',
    orderNumber: 'DH008',
    date: '2025-11-07',
    status: 'shipping_back',
    items: [
      { id: '1', name: 'Áo khoác hoodie', quantity: 1, price: 550000, image: '🧥' },
    ],
    refundAmount: 550000,
    reason: 'Sản phẩm bị lỗi/hỏng',
    createdAt: '2025-11-07T14:20:00',
    updatedAt: '2025-11-08T09:15:00',
  },
  {
    id: '3',
    returnNumber: 'TH003',
    orderNumber: 'DH007',
    date: '2025-11-05',
    status: 'refunded',
    items: [
      { id: '1', name: 'Túi xách nữ da PU', quantity: 1, price: 320000, image: '👜' },
    ],
    refundAmount: 350000,
    reason: 'Giao nhầm sản phẩm',
    createdAt: '2025-11-05T08:10:00',
    updatedAt: '2025-11-07T16:30:00',
  },
  {
    id: '4',
    returnNumber: 'TH004',
    orderNumber: 'DH006',
    date: '2025-11-03',
    status: 'rejected',
    items: [
      { id: '1', name: 'Giày sneaker nam', quantity: 1, price: 890000, image: '👟' },
    ],
    refundAmount: 890000,
    reason: 'Thay đổi ý định mua hàng',
    createdAt: '2025-11-03T11:45:00',
    updatedAt: '2025-11-04T10:20:00',
  },
];

export function CustomerReturns({ onViewDetail, onBack }: CustomerReturnsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filterReturnsByStatus = (returns: ReturnRequest[], status: string) => {
    if (status === 'all') return returns;
    if (status === 'processing') {
      return returns.filter(r => ['pending', 'approved', 'shipping_back', 'received'].includes(r.status));
    }
    if (status === 'completed') {
      return returns.filter(r => r.status === 'refunded');
    }
    if (status === 'cancelled') {
      return returns.filter(r => r.status === 'rejected');
    }
    return returns;
  };

  const filteredReturns = filterReturnsByStatus(mockReturns, activeTab).filter(
    (returnReq) =>
      returnReq.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnReq.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnReq.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabCount = (status: string) => {
    return filterReturnsByStatus(mockReturns, status).length;
  };

  const ReturnCard = ({ returnReq }: { returnReq: ReturnRequest }) => {
    const StatusIcon = statusInfo[returnReq.status].icon;
    
    return (
      <Card 
        className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onViewDetail(returnReq.id)}
      >
        <CardContent className="p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm sm:text-base">#{returnReq.returnNumber}</span>
                <Badge variant="outline" className="text-xs">
                  {returnReq.orderNumber}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                Tạo lúc: {new Date(returnReq.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
            <Badge className={statusInfo[returnReq.status].color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo[returnReq.status].label}
            </Badge>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-3">
            {returnReq.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                <div className="text-2xl sm:text-3xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">x{item.quantity}</p>
                </div>
                <div className="text-sm font-semibold text-right">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
          </div>

          {/* Reason */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
            <p className="text-xs text-amber-800">
              <strong>Lý do:</strong> {returnReq.reason}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Số tiền hoàn lại</p>
              <p className="font-bold text-base sm:text-lg text-green-600">
                {returnReq.refundAmount.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              Xem chi tiết
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 sm:pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="font-bold">Trả hàng/Hoàn tiền</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo mã trả hàng, đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-3 sm:px-4 max-w-3xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
            <TabsList className="inline-flex w-full min-w-max sm:grid sm:grid-cols-4 mb-4">
              <TabsTrigger value="all" className="text-xs sm:text-sm flex-shrink-0 px-3 sm:px-4 gap-1">
                <span>Tất cả</span>
                {getTabCount('all') > 0 && (
                  <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px] leading-none">
                    {getTabCount('all')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="processing" className="text-xs sm:text-sm flex-shrink-0 px-3 sm:px-4 gap-1">
                <span className="whitespace-nowrap">Đang xử lý</span>
                {getTabCount('processing') > 0 && (
                  <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px] leading-none">
                    {getTabCount('processing')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm flex-shrink-0 px-3 sm:px-4 gap-1">
                <span className="whitespace-nowrap">Hoàn thành</span>
                {getTabCount('completed') > 0 && (
                  <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px] leading-none">
                    {getTabCount('completed')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs sm:text-sm flex-shrink-0 px-3 sm:px-4 gap-1">
                <span>Từ chối</span>
                {getTabCount('cancelled') > 0 && (
                  <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px] leading-none">
                    {getTabCount('cancelled')}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {filteredReturns.length === 0 ? (
              <Card className="mt-4">
                <CardContent className="py-12 text-center">
                  <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-1">Chưa có yêu cầu trả hàng</p>
                  <p className="text-sm text-gray-400">
                    {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Các yêu cầu trả hàng sẽ hiển thị tại đây'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredReturns.map((returnReq) => (
                  <ReturnCard key={returnReq.id} returnReq={returnReq} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Info Banner */}
      <div className="container mx-auto px-3 sm:px-4 max-w-3xl mt-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-700">
                <p className="font-medium mb-1">Lưu ý về trả hàng:</p>
                <ul className="space-y-1 ml-3">
                  <li>• Thời gian xét duyệt: 24-48 giờ làm việc</li>
                  <li>• Sau khi được duyệt, vui lòng gửi hàng trong 3 ngày</li>
                  <li>• Hoàn tiền trong 5-7 ngày sau khi nhận hàng</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
