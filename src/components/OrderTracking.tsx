import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Package, 
  Truck,
  CheckCircle2,
  Circle,
  Navigation,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OrderTrackingProps {
  orderId: string;
  onBack: () => void;
}

interface TrackingEvent {
  time: string;
  status: string;
  description: string;
  location?: string;
  completed: boolean;
}

const mockTrackingEvents: TrackingEvent[] = [
  {
    time: '14:30',
    status: 'Đang giao hàng',
    description: 'Shipper đang trên đường giao hàng',
    location: 'Quận 1, TP.HCM',
    completed: false,
  },
  {
    time: '13:45',
    status: 'Đã rời kho',
    description: 'Đơn hàng đã rời kho phân phối',
    location: 'Kho Tân Bình',
    completed: true,
  },
  {
    time: '11:20',
    status: 'Đã đến kho',
    description: 'Đơn hàng đã đến kho phân phối',
    location: 'Kho Tân Bình',
    completed: true,
  },
  {
    time: '09:00',
    status: 'Đã lấy hàng',
    description: 'Shipper đã lấy hàng từ người bán',
    location: 'Tech Store Vietnam',
    completed: true,
  },
  {
    time: '08:30',
    status: 'Đã xác nhận',
    description: 'Đơn hàng đã được xác nhận và đóng gói',
    location: 'Tech Store Vietnam',
    completed: true,
  },
];

export function OrderTracking({ orderId, onBack }: OrderTrackingProps) {
  const [mapView, setMapView] = useState<'map' | 'satellite'>('map');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Đã cập nhật thông tin giao hàng');
    }, 1000);
  };

  return (
    <div className="space-y-3 sm:space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 sticky top-0 bg-white z-10 py-3 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-base sm:text-lg">Theo dõi đơn hàng</h1>
          <p className="text-xs text-gray-500">#{orderId}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        <Badge className="bg-blue-500">Đang giao</Badge>
      </div>

      {/* Map View */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Fake Map */}
          <div className={`relative h-64 sm:h-80 transition-all duration-500 ${
            mapView === 'map' 
              ? 'bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50' 
              : 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500'
          }`}>
            {/* Map Controls */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button
                size="sm"
                variant={mapView === 'map' ? 'default' : 'secondary'}
                onClick={() => setMapView('map')}
                className="text-xs"
              >
                Bản đồ
              </Button>
              <Button
                size="sm"
                variant={mapView === 'satellite' ? 'default' : 'secondary'}
                onClick={() => setMapView('satellite')}
                className="text-xs"
              >
                Vệ tinh
              </Button>
            </div>

            {/* Distance indicator */}
            <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1.5 rounded-lg shadow-lg">
              <p className="text-xs font-semibold text-blue-600">Còn ~2.5 km</p>
            </div>

            {/* Map Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Roads */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-300 opacity-50" />
                <div className="absolute top-2/3 left-0 right-0 h-2 bg-gray-300 opacity-50" />
                <div className="absolute left-1/3 top-0 bottom-0 w-2 bg-gray-300 opacity-50" />
                <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-gray-300 opacity-50" />
              </div>

              {/* Delivery Route */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 80 220 Q 150 180, 220 200 T 380 160"
                  stroke="#2563eb"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10,5"
                />
              </svg>

              {/* Starting Point (Shop) */}
              <div className="absolute left-20 bottom-12 flex flex-col items-center">
                <div className="bg-green-500 rounded-full p-2 shadow-lg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="mt-1 bg-white px-2 py-1 rounded shadow text-xs font-medium">
                  Cửa hàng
                </div>
              </div>

              {/* Delivery Person (Moving) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  {/* Pulse ring */}
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
                  <div className="relative bg-blue-500 rounded-full p-3 shadow-xl">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-1 bg-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-blue-500 animate-bounce">
                  <p className="text-xs font-bold text-blue-600">Đang giao hàng</p>
                  <p className="text-xs text-gray-600">~10 phút nữa</p>
                </div>
              </div>

              {/* Destination (Customer) */}
              <div className="absolute right-16 top-1/3 flex flex-col items-center">
                <div className="bg-red-500 rounded-full p-2 shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="mt-1 bg-white px-2 py-1 rounded shadow text-xs font-medium">
                  Địa chỉ nhận hàng
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base mb-1">Thông tin giao hàng</CardTitle>
              <p className="text-sm text-gray-600">Dự kiến: 15:00 - Hôm nay</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <Clock className="h-3 w-3 mr-1" />
              ~10 phút
            </Badge>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Tiến trình</span>
              <span>75%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shipper Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
              🏍️
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Nguyễn Văn Tài</p>
              <p className="text-xs text-gray-600">Shipper</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">(4.9)</span>
              </div>
            </div>
            <Button size="sm" className="gap-1">
              <Phone className="h-4 w-4" />
              Gọi
            </Button>
          </div>

          <Separator />

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div className="w-0.5 h-12 bg-gray-300 my-1" />
              </div>
              <div className="flex-1 pb-3">
                <p className="text-xs text-gray-500 mb-1">Lấy hàng từ</p>
                <p className="text-sm font-medium">Tech Store Vietnam</p>
                <p className="text-xs text-gray-600">123 Nguyễn Huệ, Q.1, TP.HCM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Giao đến</p>
                <p className="text-sm font-medium">456 Lê Lợi, Quận 1, TP.HCM</p>
                <p className="text-xs text-gray-600">Nguyễn Văn A • 0901234567</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lịch sử vận chuyển</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrackingEvents.map((event, index) => (
              <div key={index} className="flex gap-3">
                {/* Timeline Icon */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.completed
                      ? 'bg-green-100'
                      : 'bg-blue-100 animate-pulse'
                  }`}>
                    {event.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  {index < mockTrackingEvents.length - 1 && (
                    <div className={`w-0.5 h-12 my-1 ${
                      event.completed ? 'bg-green-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>

                {/* Event Details */}
                <div className={`flex-1 pb-4 ${!event.completed && 'bg-blue-50 -ml-3 pl-3 -mr-3 pr-3 rounded-lg'}`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className={`text-sm font-semibold ${!event.completed && 'text-blue-700'}`}>
                      {event.status}
                    </p>
                    <span className="text-xs text-gray-500">{event.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{event.description}</p>
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Items Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sản phẩm (2)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
              👕
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-2 mb-1">Áo thun nam cổ tròn</p>
              <p className="text-xs text-gray-500">x2</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
              🧢
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-2 mb-1">Mũ lưỡi trai</p>
              <p className="text-xs text-gray-500">x1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 sm:p-4">
        <div className="max-w-screen-lg mx-auto flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Phone className="h-4 w-4" />
            Liên hệ shop
          </Button>
          <Button className="flex-1 gap-2 bg-blue-600">
            <Navigation className="h-4 w-4" />
            Chỉ đường
          </Button>
        </div>
      </div>
    </div>
  );
}
