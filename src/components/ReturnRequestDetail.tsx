import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  CreditCard,
  MessageCircle,
  Camera,
  AlertCircle,
  FileText,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'shipping_back' | 'received' | 'refunded';

interface ReturnRequestDetailProps {
  returnId: string;
  onBack: () => void;
}

const statusInfo: Record<ReturnStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  approved: { label: 'Đã duyệt', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: XCircle },
  shipping_back: { label: 'Đang gửi trả', color: 'bg-purple-100 text-purple-800', icon: Truck },
  received: { label: 'Đã nhận hàng', color: 'bg-green-100 text-green-800', icon: Package },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
};

export function ReturnRequestDetail({ returnId, onBack }: ReturnRequestDetailProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Mock data
  const returnRequest = {
    id: returnId,
    returnNumber: 'TH001',
    orderNumber: 'DH012',
    status: 'shipping_back' as ReturnStatus,
    createdAt: '2025-11-09T10:30:00',
    approvedAt: '2025-11-09T14:20:00',
    items: [
      { id: '1', name: 'Áo thun nam cổ tròn', quantity: 2, price: 199000, image: '👕' },
      { id: '2', name: 'Mũ lưỡi trai', quantity: 1, price: 120000, image: '🧢' },
    ],
    reason: 'Sản phẩm không đúng size',
    description: 'Sản phẩm size L nhưng mặc như size M, quá nhỏ so với mô tả. Chưa qua sử dụng, còn nguyên tem mác.',
    images: ['🖼️', '📸', '📷'],
    refundMethod: 'Hoàn về phương thức thanh toán ban đầu',
    refundAmount: 428000,
    shippingFee: 30000,
    trackingNumber: 'VN987654321',
    rejectionReason: null,
    timeline: [
      { status: 'pending', label: 'Tạo yêu cầu', time: '2025-11-09T10:30:00', completed: true },
      { status: 'approved', label: 'Đã duyệt', time: '2025-11-09T14:20:00', completed: true },
      { status: 'shipping_back', label: 'Đang gửi trả', time: '2025-11-09T16:45:00', completed: true },
      { status: 'received', label: 'Shop nhận hàng', time: null, completed: false },
      { status: 'refunded', label: 'Hoàn tiền', time: null, completed: false },
    ],
    returnAddress: {
      name: 'Kho hàng Shop',
      phone: '0901234567',
      address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    },
  };

  const handleCancelReturn = () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy');
      return;
    }
    toast.success('Đã hủy yêu cầu trả hàng');
    setShowCancelDialog(false);
    onBack();
  };

  const handleContactSupport = () => {
    toast.info('Đang kết nối với bộ phận hỗ trợ...');
  };

  const StatusIcon = statusInfo[returnRequest.status].icon;

  return (
    <div className="min-h-screen bg-gray-50 pb-6 sm:pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 shadow-sm">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold">Chi tiết yêu cầu trả hàng</h1>
              <p className="text-xs text-gray-500">#{returnRequest.returnNumber}</p>
            </div>
            <Badge className={statusInfo[returnRequest.status].color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo[returnRequest.status].label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-3 sm:p-4 max-w-3xl space-y-4">
        {/* Rejection Alert (if rejected) */}
        {returnRequest.status === 'rejected' && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 mb-1">Yêu cầu đã bị từ chối</p>
                  <p className="text-sm text-red-700">
                    Lý do: Sản phẩm đã qua sử dụng, không đủ điều kiện trả hàng theo chính sách.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipping Info (if approved) */}
        {['approved', 'shipping_back'].includes(returnRequest.status) && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Địa chỉ gửi hàng trả
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="font-medium text-sm">{returnRequest.returnAddress.name}</p>
                <p className="text-sm text-gray-600">{returnRequest.returnAddress.phone}</p>
                <p className="text-sm text-gray-600 mt-1">{returnRequest.returnAddress.address}</p>
              </div>
              {returnRequest.trackingNumber && (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">Mã vận đơn (nếu có)</p>
                  <p className="font-mono font-semibold text-blue-600">{returnRequest.trackingNumber}</p>
                </div>
              )}
              <div className="text-xs text-blue-700 bg-blue-100 rounded p-2">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Vui lòng gửi hàng trong vòng 3 ngày kể từ khi được duyệt
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tiến trình xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {returnRequest.timeline.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    {index < returnRequest.timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={`font-medium text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(step.time).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sản phẩm trả lại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {returnRequest.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Số lượng: x{item.quantity}</p>
                </div>
                <div className="text-sm font-semibold text-right">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reason & Description */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lý do trả hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm font-medium text-amber-900">{returnRequest.reason}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{returnRequest.description}</p>
            </div>

            {/* Images */}
            {returnRequest.images.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Hình ảnh đính kèm
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {returnRequest.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center text-4xl"
                    >
                      {img}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refund Info */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-green-900">
              <CreditCard className="h-5 w-5" />
              Thông tin hoàn tiền
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Tiền sản phẩm:</span>
                <span className="font-medium text-green-900">
                  {returnRequest.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Phí vận chuyển:</span>
                <span className="font-medium text-green-900">
                  {returnRequest.shippingFee.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <Separator className="bg-green-300" />
              <div className="flex justify-between pt-1">
                <span className="font-semibold text-green-900">Tổng hoàn lại:</span>
                <span className="font-bold text-lg text-green-900">
                  {returnRequest.refundAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Phương thức hoàn tiền</p>
              <p className="text-sm font-medium text-gray-900">{returnRequest.refundMethod}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Mã đơn hàng:</span>
              <span className="font-medium">#{returnRequest.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tạo yêu cầu:</span>
              <span className="font-medium">
                {new Date(returnRequest.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
            {returnRequest.approvedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày duyệt:</span>
                <span className="font-medium">
                  {new Date(returnRequest.approvedAt).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleContactSupport}
          >
            <MessageCircle className="h-4 w-4" />
            Liên hệ hỗ trợ
          </Button>
          
          {returnRequest.status === 'pending' && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setShowCancelDialog(true)}
            >
              Hủy yêu cầu
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hủy yêu cầu trả hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn hủy yêu cầu này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Lý do hủy yêu cầu..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelDialog(false)}>
                Đóng
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleCancelReturn}>
                Xác nhận hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
