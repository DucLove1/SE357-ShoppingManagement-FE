import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { User, Mail, Phone, MapPin, Edit2, Lock, Package, RotateCcw, Star, MessageCircle, Bell, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

interface CustomerProfileProps {
  onEditProfile?: () => void;
  onViewOrders?: () => void;
  onViewReturns?: () => void;
  onViewReviews?: () => void;
  onViewChat?: () => void;
  onViewNotifications?: () => void;
  profile?: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
}

export function CustomerProfile({ 
  onEditProfile, 
  onViewOrders,
  onViewReturns,
  onViewReviews,
  onViewChat,
  onViewNotifications,
  profile: userProfile 
}: CustomerProfileProps) {
  const [profile, setProfile] = useState<ProfileData>({
    name: userProfile?.name || 'Nguyễn Văn A',
    email: userProfile?.email || 'nguyenvana@email.com',
    phone: userProfile?.phone || '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    dateOfBirth: '1990-01-01',
    gender: 'male',
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      setEditFormData(profile);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveProfile = () => {
    setProfile(editFormData);
    setIsEditDialogOpen(false);
    toast.success('Đã cập nhật thông tin cá nhân');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsPasswordDialogOpen(false);
    toast.success('Đã thay đổi mật khẩu thành công');
  };

  const stats = [
    { label: 'Đơn hàng', value: '15', color: 'text-blue-600' },
    { label: 'Đã hoàn thành', value: '12', color: 'text-green-600' },
    { label: 'Đang xử lý', value: '3', color: 'text-orange-600' },
    { label: 'Tổng chi tiêu', value: '12.5M ₫', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div>
        <h1 className="mb-1">Thông tin cá nhân</h1>
        <p className="text-gray-500 text-sm">Quản lý thông tin tài khoản của bạn</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl mb-1">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
            <Button variant="outline" onClick={handleEditProfile}>
              <Edit2 className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl sm:text-3xl mb-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 pb-3 border-b">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
              <p className="font-medium">{profile.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pb-3 border-b">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pb-3 border-b">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
              <p className="font-medium">{profile.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pb-3 border-b">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
              <p className="font-medium">{profile.address}</p>
            </div>
          </div>

          {profile.dateOfBirth && (
            <div className="flex items-start gap-3 pb-3 border-b">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Ngày sinh</p>
                <p className="font-medium">
                  {new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          )}

          {profile.gender && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Giới tính</p>
                <p className="font-medium">
                  {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Quản lý</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onViewOrders}
          >
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <span>Đơn hàng của tôi</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onViewReturns}
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <span>Trả hàng/Hoàn tiền</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onViewReviews}
          >
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>Đánh giá của tôi</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onViewChat}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <span>Tin nhắn</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onViewNotifications}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <span>Thông báo</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Bảo mật</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            <Lock className="h-4 w-4 mr-2" />
            Đổi mật khẩu
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
            <DialogDescription>Cập nhật thông tin cá nhân của bạn</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveProfile}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
