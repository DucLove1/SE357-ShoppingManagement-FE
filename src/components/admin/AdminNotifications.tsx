import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Bell, 
  CheckCheck, 
  UserPlus, 
  ShoppingCart, 
  AlertTriangle, 
  Star,
  FileText
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'seller_registration' | 'new_order' | 'report' | 'review' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'seller_registration',
    title: 'Đăng ký chủ cửa hàng mới',
    message: 'Lê Minh C vừa đăng ký tài khoản chủ cửa hàng - Beauty Shop C',
    time: '5 phút trước',
    read: false,
    priority: 'high',
    link: 'seller-applications',
  },
  {
    id: '2',
    type: 'seller_registration',
    title: 'Đăng ký chủ cửa hàng mới',
    message: 'Phạm Thị D vừa đăng ký tài khoản chủ cửa hàng - Home Decor D',
    time: '2 giờ trước',
    read: false,
    priority: 'high',
    link: 'seller-applications',
  },
  {
    id: '3',
    type: 'report',
    title: 'Báo cáo sản phẩm',
    message: 'Khách hàng báo cáo sản phẩm "Áo thun nam cổ tròn" vi phạm',
    time: '3 giờ trước',
    read: false,
    priority: 'high',
  },
  {
    id: '4',
    type: 'new_order',
    title: 'Đơn hàng lớn',
    message: 'Đơn hàng DH156 trị giá 15.000.000đ vừa được đặt',
    time: '5 giờ trước',
    read: true,
    priority: 'medium',
  },
  {
    id: '5',
    type: 'review',
    title: 'Đánh giá 1 sao',
    message: 'Sản phẩm "Giày thể thao nam" nhận đánh giá 1 sao từ khách hàng',
    time: '1 ngày trước',
    read: true,
    priority: 'medium',
  },
  {
    id: '6',
    type: 'system',
    title: 'Cảnh báo tồn kho',
    message: '12 sản phẩm sắp hết hàng, cần nhập thêm',
    time: '1 ngày trước',
    read: true,
    priority: 'low',
  },
  {
    id: '7',
    type: 'seller_registration',
    title: 'Đăng ký chủ cửa hàng mới',
    message: 'Hoàng Văn E vừa đăng ký tài khoản chủ cửa hàng - Electronics Hub E',
    time: '1 ngày trước',
    read: false,
    priority: 'high',
    link: 'seller-applications',
  },
  {
    id: '8',
    type: 'system',
    title: 'Báo cáo doanh thu tuần',
    message: 'Doanh thu tuần này đạt 156.000.000đ (+12% so với tuần trước)',
    time: '2 ngày trước',
    read: true,
    priority: 'low',
  },
];

interface AdminNotificationsProps {
  onNavigate?: (view: string) => void;
}

export function AdminNotifications({ onNavigate }: AdminNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter((n) => !n.read)
    : notifications;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'seller_registration':
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case 'new_order':
        return <ShoppingCart className="h-5 w-5 text-green-600" />;
      case 'report':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'system':
        return <FileText className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const config = {
      high: { variant: 'destructive' as const, label: 'Ưu tiên cao' },
      medium: { variant: 'secondary' as const, label: 'Trung bình' },
      low: { variant: 'outline' as const, label: 'Thấp' },
    };
    return <Badge variant={config[priority].variant}>{config[priority].label}</Badge>;
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('Đã đánh dấu tất cả là đã đọc');
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link && onNavigate) {
      onNavigate(notification.link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="mb-2">Thông báo</h1>
          <p className="text-gray-500">Theo dõi các hoạt động quan trọng</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-base px-3 py-1">
              {unreadCount} chưa đọc
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">
            Tất cả ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Chưa đọc ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all cursor-pointer hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{notification.title}</h3>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">{notification.time}</p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            Đánh dấu đã đọc
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
