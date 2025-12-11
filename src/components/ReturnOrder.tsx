import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, Upload, X, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReturnOrderProps {
  order: {
    id: string;
    orderNumber: string;
    date: string;
    items: { 
      id: string;
      name: string; 
      quantity: number; 
      price: number; 
      image: string;
    }[];
    total: number;
  };
  onBack: () => void;
}

const returnReasons = [
  'Sản phẩm bị lỗi/hỏng',
  'Sản phẩm không đúng mô tả',
  'Sản phẩm không đúng size/màu',
  'Giao nhầm sản phẩm',
  'Thay đổi ý định mua hàng',
  'Khác (ghi rõ bên dưới)',
];

const refundMethods = [
  { value: 'original', label: 'Hoàn về phương thức thanh toán ban đầu', desc: 'Tiền sẽ được hoàn trong 5-7 ngày làm việc' },
  { value: 'wallet', label: 'Hoàn vào ví Shop', desc: 'Nhận ngay, có thể dùng cho đơn hàng tiếp theo' },
  { value: 'bank', label: 'Chuyển khoản ngân hàng', desc: 'Nhận trong 3-5 ngày làm việc' },
];

export function ReturnOrder({ order, onBack }: ReturnOrderProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [refundMethod, setRefundMethod] = useState('original');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedImages.length + files.length > 6) {
      toast.error('Tối đa 6 ảnh');
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const calculateRefundAmount = () => {
    const selectedTotal = order.items
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // If all items are returned, include shipping fee
    const isFullReturn = selectedItems.length === order.items.length;
    const shippingFee = isFullReturn ? 30000 : 0;
    
    return selectedTotal + shippingFee;
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    if (!selectedReason) {
      toast.error('Vui lòng chọn lý do trả hàng');
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng mô tả chi tiết lý do trả hàng');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đã gửi yêu cầu trả hàng. Chúng tôi sẽ xử lý trong 24-48h.');
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 sm:pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 shadow-sm">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold">Yêu cầu trả hàng</h1>
              <p className="text-xs text-gray-500">Đơn hàng #{order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-3 sm:p-4 max-w-3xl space-y-4">
        {/* Info Alert */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-700">
                <p className="font-medium mb-1">Chính sách trả hàng:</p>
                <ul className="space-y-1 ml-3">
                  <li>• Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                  <li>• Trong vòng 7 ngày kể từ khi nhận hàng</li>
                  <li>• Có đầy đủ hóa đơn, phụ kiện kèm theo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Chọn sản phẩm muốn trả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedItems.includes(item.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleItemToggle(item.id)}
              >
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleItemToggle(item.id)}
                  className="mt-1"
                />
                <div className="text-3xl sm:text-4xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-blue-600 mt-1">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))}

            {selectedItems.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4 inline mr-1" />
                  Đã chọn {selectedItems.length} sản phẩm
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reason Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Lý do trả hàng <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {returnReasons.map((reason) => (
              <div
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedReason === reason
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReason(reason)}
              >
                <RadioGroupItem
                  value={reason}
                  checked={selectedReason === reason}
                  className="flex-shrink-0"
                />
                <Label className="flex-1 cursor-pointer text-sm sm:text-base">
                  {reason}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Vui lòng mô tả chi tiết lý do trả hàng, tình trạng sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500">
              {description.length}/500 ký tự
            </p>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Hình ảnh sản phẩm</CardTitle>
              <Badge variant="outline" className="text-xs">Tối đa 6 ảnh</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={image}
                    alt={`Ảnh ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {uploadedImages.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 text-center px-1">Thêm ảnh</span>
                </label>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                <strong>Lưu ý:</strong> Hãy chụp rõ ràng tình trạng sản phẩm, bao gồm cả nhãn mác, tem, phụ kiện kèm theo (nếu có) để tăng tốc độ xét duyệt.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Refund Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Phương thức hoàn tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={refundMethod} onValueChange={setRefundMethod} className="space-y-3">
              {refundMethods.map((method) => (
                <div
                  key={method.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                    refundMethod === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setRefundMethod(method.value)}
                >
                  <RadioGroupItem
                    value={method.value}
                    checked={refundMethod === method.value}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <Label className="cursor-pointer font-medium text-sm sm:text-base">
                      {method.label}
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedItems.length > 0 && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg text-green-900">
                Tổng tiền hoàn lại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Tiền sản phẩm:</span>
                  <span className="font-medium text-green-900">
                    {order.items
                      .filter(item => selectedItems.includes(item.id))
                      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                      .toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {selectedItems.length === order.items.length && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Phí vận chuyển:</span>
                    <span className="font-medium text-green-900">30.000đ</span>
                  </div>
                )}
                <div className="border-t border-green-300 pt-2 flex justify-between">
                  <span className="font-semibold text-green-900">Tổng cộng:</span>
                  <span className="font-bold text-green-900">
                    {calculateRefundAmount().toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 sm:static bg-white sm:bg-transparent p-3 sm:p-0 border-t sm:border-0 -mx-3 sm:mx-0">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting || selectedItems.length === 0 || !selectedReason || !description.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Đang gửi yêu cầu...
              </>
            ) : (
              'Gửi yêu cầu trả hàng'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
