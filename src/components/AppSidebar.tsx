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
} from './ui/sidebar';
import { LayoutDashboard, Package, ShoppingCart, Users, Store, UserCheck, Bell, User as UserIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  pendingCount?: number;
  notificationCount?: number;
}

export function AppSidebar({ currentView, onNavigate, pendingCount = 0, notificationCount = 0 }: AppSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      title: 'Tổng quan',
      icon: LayoutDashboard,
    },
    {
      id: 'seller-applications',
      title: 'Duyệt chủ cửa hàng',
      icon: UserCheck,
      badge: pendingCount,
    },
    {
      id: 'products',
      title: 'Sản phẩm',
      icon: Package,
    },
    {
      id: 'orders',
      title: 'Đơn hàng',
      icon: ShoppingCart,
    },
    {
      id: 'customers',
      title: 'Người dùng',
      icon: Users,
    },
  ];

  const accountItems = [
    {
      id: 'notifications',
      title: 'Thông báo',
      icon: Bell,
      badge: notificationCount,
    },
    {
      id: 'profile',
      title: 'Tài khoản',
      icon: UserIcon,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4">
          <Store className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-lg">Quản lý bán hàng</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Cá nhân</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto">
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
    </Sidebar>
  );
}