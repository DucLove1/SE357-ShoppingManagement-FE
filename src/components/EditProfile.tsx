import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EditProfileProps {
  onBack: () => void;
  onSave: (profile: { name: string; email: string; phone: string; avatar?: string }) => void;
  currentProfile: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
}

export function EditProfile({ onBack, onSave, currentProfile }: EditProfileProps) {
  const [name, setName] = useState(currentProfile.name);
  const [email, setEmail] = useState(currentProfile.email);
  const [phone, setPhone] = useState(currentProfile.phone);
  const [avatar, setAvatar] = useState(currentProfile.avatar);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload - in real app, upload to server
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success('Ảnh đã được tải lên');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ name, email, phone, avatar });
    toast.success('Cập nhật thông tin thành công');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-semibold">Chỉnh sửa thông tin</h1>
            </div>
            <Button onClick={handleSave} size="sm">
              Lưu
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-2xl space-y-6">
        {/* Avatar Upload */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-3">Nhấn để thay đổi ảnh đại diện</p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
