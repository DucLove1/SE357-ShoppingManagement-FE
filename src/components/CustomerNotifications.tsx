import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, Tag, Truck, MessageCircle, Star, Bell, RotateCcw } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'chat' | 'review' | 'return';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'return',
    title: 'Yêu cầu trả hàng đã được duyệt',
    message: 'Yêu cầu trả hàng TH001 đã được duyệt. Vui lòng gửi hàng trong 3 ngày.',
    time: '2025-11-09T14:20:00',
    isRead: false,
  },
  {
    id: '2',
    type: 'order',
    title: 'Đơn hàng đã được giao',
    message: 'Đơn hàng DH012 đã được giao thành công. Vui lòng xác nhận đã nhận hàng.',
    time: '2025-11-09T08:30:00',
    isRead: false,
  },
  {
    id: '3',
    type: 'chat',
    title: 'Tin nhắn mới từ người bán',
    message: 'Nhân viên bán hàng A: Sản phẩm của bạn đã sẵn sàng để giao',
    time: '2025-11-09T07:15:00',
    isRead: false,
  },
  {
    id: '4',
    type: 'return',
    title: 'Đã hoàn tiền',
    message: 'Yêu cầu trả hàng TH003 đã hoàn tất. Số tiền 350.000đ đã được hoàn vào tài khoản.',
    time: '2025-11-07T16:30:00',
    isRead: true,
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Mã giảm giá mới cho bạn',
    message: 'Nhận ngay mã giảm 20% cho đơn hàng tiếp theo. Mã: SAVE20',
    time: '2025-11-08T18:00:00',
    isRead: true,
  },
  {
    id: '6',
    type: 'order',
    title: 'Đơn hàng đang được vận chuyển',
    message: 'Đơn hàng DH011 đang trên đường giao đến bạn. Mã vận đơn: VN123456789',
    time: '2025-11-08T14:20:00',
    isRead: true,
  },
  {
    id: '7',
    type: 'review',
    title: 'Đánh giá sản phẩm',
    message: 'Bạn có thể đánh giá sản phẩm trong đơn hàng DH008 của mình',
    time: '2025-11-07T10:00:00',
    isRead: true,
  },
  {
    id: '8',
    type: 'return',
    title: 'Yêu cầu trả hàng bị từ chối',
    message: 'Yêu cầu trả hàng TH004 không đủ điều kiện. Xem lý do chi tiết.',
    time: '2025-11-04T10:20:00',
    isRead: true,
  },
  {
    id: '9',
    type: 'system',
    title: 'Cập nhật chính sách',
    message: 'Chính sách đổi trả hàng đã được cập nhật. Xem chi tiết.',
    time: '2025-11-06T09:00:00',
    isRead: true,
  },
];

export function CustomerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'promotion':
        return <Tag className="h-5 w-5 text-green-600" />;
      case 'chat':
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'return':
        return <RotateCcw className="h-5 w-5 text-orange-600" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-600" />;
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
              <p className="font-semibold text-sm">{notification.title}</p>
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
