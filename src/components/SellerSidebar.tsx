import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from './ui/sidebar';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  RotateCcw, 
  Wallet, 
  MessageCircle, 
  Bell,
  Store,
  LogOut,
  Users,
  Star,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SellerSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userName: string;
  onLogout: () => void;
}

export function SellerSidebar({ currentView, onNavigate, userName, onLogout }: SellerSidebarProps) {
  const menuItems = [
    {
      id: 'home',
      title: 'Tổng quan',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      title: 'Đơn hàng',
      icon: ShoppingCart,
      badge: 5,
    },
    {
      id: 'orders-by-customer',
      title: 'Khách hàng',
      icon: Users,
    },
    {
      id: 'products',
      title: 'Sản phẩm',
      icon: Package,
    },
    {
      id: 'reviews',
      title: 'Đánh giá',
      icon: Star,
    },
    {
      id: 'analytics',
      title: 'Thống kê',
      icon: BarChart3,
    },
    {
      id: 'returns',
      title: 'Trả hàng',
      icon: RotateCcw,
      badge: 2,
    },
    {
      id: 'payouts',
      title: 'Thanh toán',
      icon: Wallet,
    },
    {
      id: 'chat',
      title: 'Tin nhắn',
      icon: MessageCircle,
      badge: 3,
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      icon: Bell,
      badge: 7,
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4">
          <Store className="h-6 w-6 text-blue-600" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">Seller Dashboard</p>
            <p className="text-xs text-gray-500 truncate">{userName}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto h-5 min-w-[20px] rounded-full px-1 text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onLogout}
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}