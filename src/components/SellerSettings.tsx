import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Store, CreditCard, Bell, Shield, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

export function SellerSettings() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: (user?.avatar as string | undefined) || undefined,
  });

  const [store, setStore] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo: undefined as string | undefined,
  });

  const [bank, setBank] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    branch: '',
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    newReview: true,
    newMessage: true,
    paymentUpdate: false,
    systemUpdate: false,
  });

  useEffect(() => {
    if (!user) return;
    setProfile((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
      avatar: user.avatar || prev.avatar,
    }));
  }, [user]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
        toast.success('Đã cập nhật ảnh đại diện');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStore({ ...store, logo: reader.result as string });
        toast.success('Đã cập nhật logo cửa hàng');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    toast.success('Đã lưu thông tin cá nhân');
  };

  const saveStore = () => {
    toast.success('Đã lưu thông tin cửa hàng');
  };

  const saveBank = () => {
    toast.success('Đã lưu thông tin ngân hàng');
  };

  const saveNotifications = () => {
    toast.success('Đã lưu cài đặt thông báo');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mb-1 sm:mb-2">Cài đặt</h1>
        <p className="text-gray-500 text-sm">Quản lý thông tin tài khoản và cửa hàng</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">
            <User className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Cá nhân</span>
          </TabsTrigger>
          <TabsTrigger value="store" className="text-xs sm:text-sm">
            <Store className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Cửa hàng</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="text-xs sm:text-sm">
            <CreditCard className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Ngân hàng</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            <Bell className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Thông báo</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">
            <Shield className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Bảo mật</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Profile */}
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl text-white">{profile.name.charAt(0)}</span>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700"
                  >
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm">Ảnh đại diện</p>
                  <p className="text-xs text-gray-500">JPG, PNG. Tối đa 5MB</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <Button onClick={saveProfile} className="w-full sm:w-auto">
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Information */}
        <TabsContent value="store" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Thông tin cửa hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
                    {store.logo ? (
                      <img src={store.logo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Store className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="logo-upload"
                    className="absolute bottom-0 right-0 h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 text-white" />
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm">Logo cửa hàng</p>
                  <p className="text-xs text-gray-500">JPG, PNG. Tối đa 5MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeName">Tên cửa hàng</Label>
                <Input
                  id="storeName"
                  value={store.name}
                  onChange={(e) => setStore({ ...store, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Mô tả cửa hàng</Label>
                <Textarea
                  id="storeDescription"
                  rows={3}
                  value={store.description}
                  onChange={(e) => setStore({ ...store, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress">Địa chỉ</Label>
                <Input
                  id="storeAddress"
                  value={store.address}
                  onChange={(e) => setStore({ ...store, address: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Số điện thoại</Label>
                  <Input
                    id="storePhone"
                    value={store.phone}
                    onChange={(e) => setStore({ ...store, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={store.email}
                    onChange={(e) => setStore({ ...store, email: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={saveStore} className="w-full sm:w-auto">
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Information */}
        <TabsContent value="bank" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Thông tin thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  Thông tin ngân hàng được sử dụng để nhận thanh toán từ các đơn hàng. Vui lòng kiểm tra kỹ thông tin trước khi lưu.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Ngân hàng</Label>
                <Input
                  id="bankName"
                  value={bank.bankName}
                  onChange={(e) => setBank({ ...bank, bankName: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Số tài khoản</Label>
                  <Input
                    id="accountNumber"
                    value={bank.accountNumber}
                    onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Tên tài khoản</Label>
                  <Input
                    id="accountName"
                    value={bank.accountName}
                    onChange={(e) => setBank({ ...bank, accountName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Chi nhánh</Label>
                <Input
                  id="branch"
                  value={bank.branch}
                  onChange={(e) => setBank({ ...bank, branch: e.target.value })}
                />
              </div>

              <Button onClick={saveBank} className="w-full sm:w-auto">
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Cài đặt thông báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Đơn hàng mới</p>
                    <p className="text-xs text-gray-500">Thông báo khi có đơn hàng mới</p>
                  </div>
                  <Switch
                    checked={notifications.newOrder}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newOrder: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Cảnh báo tồn kho</p>
                    <p className="text-xs text-gray-500">Thông báo khi sản phẩm sắp hết hàng</p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, lowStock: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Đánh giá mới</p>
                    <p className="text-xs text-gray-500">Thông báo khi có đánh giá từ khách hàng</p>
                  </div>
                  <Switch
                    checked={notifications.newReview}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newReview: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Tin nhắn mới</p>
                    <p className="text-xs text-gray-500">Thông báo khi có tin nhắn từ khách hàng</p>
                  </div>
                  <Switch
                    checked={notifications.newMessage}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newMessage: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Cập nhật thanh toán</p>
                    <p className="text-xs text-gray-500">Thông báo về các khoản thanh toán</p>
                  </div>
                  <Switch
                    checked={notifications.paymentUpdate}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, paymentUpdate: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Cập nhật hệ thống</p>
                    <p className="text-xs text-gray-500">Thông báo về tính năng và cập nhật mới</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdate}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, systemUpdate: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={saveNotifications} className="w-full sm:w-auto">
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input id="currentPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <Button
                onClick={() => toast.success('Đã đổi mật khẩu thành công')}
                className="w-full sm:w-auto"
              >
                Đổi mật khẩu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Xác thực hai yếu tố</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Bảo vệ tài khoản của bạn bằng cách bật xác thực hai yếu tố
              </p>
              <Button variant="outline" className="w-full sm:w-auto">
                Kích hoạt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
