import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ArrowLeft, Download, Share2, Building2, User, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InvoiceViewProps {
  orderId: string;
  onBack: () => void;
}

export function InvoiceView({ orderId, onBack }: InvoiceViewProps) {
  const handleDownload = () => {
    toast.success('Đang tải xuống hóa đơn...');
  };

  const handleShare = () => {
    toast.success('Chia sẻ hóa đơn');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 sm:pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 shadow-sm">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-sm sm:text-base">Hóa đơn bán hàng</h1>
                <p className="text-xs text-gray-500 hidden sm:block">#{orderId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="h-8 sm:h-9">
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="ml-1.5 hidden sm:inline text-xs">Chia sẻ</span>
              </Button>
              <Button variant="default" size="sm" onClick={handleDownload} className="h-8 sm:h-9">
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="ml-1.5 hidden sm:inline text-xs">Tải xuống</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-3 sm:p-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-blue-600 pb-4">
              <div className="mb-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">HÓA ĐƠN BÁN HÀNG</h2>
                <p className="text-xs sm:text-sm text-gray-500">INVOICE</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                <Badge variant="outline" className="text-xs sm:text-sm">
                  <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                  Số: DH012
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                  Ngày: 08/11/2025
                </Badge>
              </div>
            </div>

            {/* Company & Customer Info - Mobile: Stack, Desktop: Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Company Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900">Thông tin cửa hàng</h3>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-sm sm:text-base font-semibold text-gray-900">Tech Store Vietnam</p>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                    <p>123 Nguyễn Huệ, Q.1, TP.HCM</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <p>0901234567</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <p>contact@techstore.vn</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900">Thông tin khách hàng</h3>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-sm sm:text-base font-semibold text-gray-900">Nguyễn Văn A</p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <p>0901234567</p>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                    <p>123 Đường ABC, Phường 1, Quận 1, TP.HCM</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Items - Responsive Table */}
            <div>
              <h3 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">Chi tiết đơn hàng</h3>
              
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-50 p-2.5 sm:p-3 rounded-lg border">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">Sản phẩm</div>
                    <div className="col-span-2 text-center">Số lượng</div>
                    <div className="col-span-2 text-right">Đơn giá</div>
                    <div className="col-span-2 text-right">Thành tiền</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-2 text-xs sm:text-sm p-2.5 sm:p-3 items-center border-b hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 text-2xl sm:text-3xl">👕</div>
                    <div className="col-span-5 font-medium">Áo thun nam cổ tròn</div>
                    <div className="col-span-2 text-center">
                      <Badge variant="outline" className="text-xs">x2</Badge>
                    </div>
                    <div className="col-span-2 text-right text-gray-600">199,000₫</div>
                    <div className="col-span-2 text-right font-bold">398,000₫</div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 text-xs sm:text-sm p-2.5 sm:p-3 items-center border-b hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 text-2xl sm:text-3xl">🧢</div>
                    <div className="col-span-5 font-medium">Mũ lưỡi trai</div>
                    <div className="col-span-2 text-center">
                      <Badge variant="outline" className="text-xs">x1</Badge>
                    </div>
                    <div className="col-span-2 text-right text-gray-600">120,000₫</div>
                    <div className="col-span-2 text-right font-bold">120,000₫</div>
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex gap-3">
                    <div className="text-3xl">👕</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-2">Áo thun nam cổ tròn</p>
                      <div className="flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <p className="text-gray-600">Đơn giá: <span className="font-medium text-gray-900">199,000₫</span></p>
                          <p className="text-gray-600">Số lượng: <Badge variant="outline" className="text-xs ml-1">x2</Badge></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-0.5">Thành tiền</p>
                          <p className="font-bold text-blue-600">398,000₫</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <div className="flex gap-3">
                    <div className="text-3xl">🧢</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-2">Mũ lưỡi trai</p>
                      <div className="flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <p className="text-gray-600">Đơn giá: <span className="font-medium text-gray-900">120,000₫</span></p>
                          <p className="text-gray-600">Số lượng: <Badge variant="outline" className="text-xs ml-1">x1</Badge></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-0.5">Thành tiền</p>
                          <p className="font-bold text-blue-600">120,000₫</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 sm:p-4 border">
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Tổng tiền hàng:</span>
                  <span className="font-medium">518,000₫</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">30,000₫</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-medium text-orange-600">-50,000₫</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 -mx-3 sm:-mx-4 px-3 sm:px-4 py-3 -mb-3 sm:-mb-4 rounded-b-lg">
                  <span className="font-bold text-sm sm:text-base text-white">Tổng cộng:</span>
                  <span className="font-bold text-lg sm:text-xl md:text-2xl text-white">498,000₫</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div>
              <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-3">Phương thức thanh toán</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm sm:text-base">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-bold text-green-800 mb-1">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-xs sm:text-sm text-green-600">Đã thanh toán: <span className="font-bold">498,000₫</span></p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-bold text-sm sm:text-base mb-2 text-blue-900 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ghi chú quan trọng
              </h3>
              <ul className="text-xs sm:text-sm text-blue-700 space-y-1.5 sm:space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Hóa đơn này là bằng chứng cho giao dịch của bạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Vui lòng giữ hóa đơn để được hỗ trợ bảo hành và đổi trả</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Chính sách đổi trả trong vòng 7 ngày kể từ ngày nhận hàng</span>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center text-xs sm:text-sm text-gray-500 pt-4 border-t-2 border-dashed">
              <div className="mb-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl sm:text-3xl">🎉</span>
                </div>
                <p className="font-bold text-sm sm:text-base text-gray-900 mb-1">Cảm ơn quý khách đã mua hàng!</p>
                <p className="text-xs sm:text-sm text-gray-600">Hẹn gặp lại quý khách trong lần mua sắm tiếp theo</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 space-y-1">
                <p className="font-medium text-gray-700">Liên hệ hỗ trợ</p>
                <p className="text-xs sm:text-sm">Hotline: <a href="tel:0901234567" className="text-blue-600 font-medium">0901234567</a></p>
                <p className="text-xs sm:text-sm">Email: <a href="mailto:support@techstore.vn" className="text-blue-600 font-medium">support@techstore.vn</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
