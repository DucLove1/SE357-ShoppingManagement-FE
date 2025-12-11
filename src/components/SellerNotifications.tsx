import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShoppingCart, AlertCircle, TrendingUp, MessageCircle, Star, Bell, RotateCcw, Package } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'revenue' | 'chat' | 'review' | 'return';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng mới',
    message: 'Bạn có đơn hàng mới #DH015 từ Nguyễn Văn A. Giá trị: 1.340.000đ',
    time: '2025-11-13T14:20:00',
    isRead: false,
  },
  {
    id: '2',
    type: 'inventory',
    title: 'Cảnh báo tồn kho',
    message: 'Sản phẩm "Quần jean nữ skinny" (Mã: QJ002) sắp hết hàng. Còn lại: 8 sản phẩm.',
    time: '2025-11-13T08:15:00',
    isRead: false,
  },
  {
    id: '3',
    type: 'chat',
    title: 'Tin nhắn mới từ khách hàng',
    message: 'Lê Văn C: "Cho em hỏi sản phẩm này còn màu đen không ạ?"',
    time: '2025-11-12T16:45:00',
    isRead: false,
  },
  {
    id: '4',
    type: 'review',
    title: 'Đánh giá 5 sao mới',
    message: 'Phạm Thị D đã đánh giá 5⭐ cho đơn hàng #DH005: "Sản phẩm chất lượng, giao hàng nhanh!"',
    time: '2025-11-12T14:20:00',
    isRead: true,
  },
  {
    id: '5',
    type: 'revenue',
    title: 'Thanh toán đã xử lý',
    message: 'Khoản thanh toán tháng 11/2025 trị giá 67.000.000đ đang được xử lý.',
    time: '2025-11-12T09:00:00',
    isRead: true,
  },
  {
    id: '6',
    type: 'order',
    title: 'Đơn hàng đã giao thành công',
    message: 'Đơn hàng #DH012 đã được giao thành công đến khách hàng Hoàng Văn E.',
    time: '2025-11-11T18:30:00',
    isRead: true,
  },
  {
    id: '7',
    type: 'inventory',
    title: 'Sản phẩm hết hàng',
    message: 'Sản phẩm "Giày thể thao nam" (Mã: GT003) đã hết hàng. Vui lòng nhập thêm.',
    time: '2025-11-11T11:20:00',
    isRead: true,
  },
  {
    id: '8',
    type: 'review',
    title: 'Đánh giá 2 sao',
    message: 'Nguyễn Thị F đã đánh giá 2⭐ cho đơn #DH007: "Sản phẩm không giống mô tả". Vui lòng phản hồi.',
    time: '2025-11-10T15:40:00',
    isRead: true,
  },
];

export function SellerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case 'inventory':
        return <Package className="h-5 w-5 text-orange-600" />;
      case 'revenue':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'chat':
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'return':
        return <RotateCcw className="h-5 w-5 text-red-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const filterNotifications = (filter: 'all' | 'unread') => {
    if (filter === 'unread') return notifications.filter((n) => !n.isRead);
    return notifications;
  };

  const renderNotification = (notification: Notification) => (
    <Card
      key={notification.id}
      className={`cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm">{notification.title}</p>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
            <p className="text-xs text-gray-400">{formatTime(notification.time)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-1">Thông báo</h1>
          <p className="text-gray-500 text-sm">
            Bạn có {unreadCount} thông báo chưa đọc
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Tất cả ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc ({unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2 sm:space-y-3 mt-3">
          {filterNotifications('all').map(renderNotification)}
        </TabsContent>

        <TabsContent value="unread" className="space-y-2 sm:space-y-3 mt-3">
          {filterNotifications('unread').length > 0 ? (
            filterNotifications('unread').map(renderNotification)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có thông báo chưa đọc</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}