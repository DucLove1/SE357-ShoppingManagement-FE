import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Store, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');

  // Common fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  // Details: shared
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Details: seller-specific
  const [phoneNumber, setPhoneNumber] = useState('');
  const [identityCard, setIdentityCard] = useState('');
  const [pickupProvinceId, setPickupProvinceId] = useState('');
  const [pickupWardId, setPickupWardId] = useState('');
  const [pickupDetail, setPickupDetail] = useState('');
  const [categoriesJson, setCategoriesJson] = useState('');
  const [idFrontUrl, setIdFrontUrl] = useState('');
  const [idFrontPublicId, setIdFrontPublicId] = useState('');
  const [idBackUrl, setIdBackUrl] = useState('');
  const [idBackPublicId, setIdBackPublicId] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [selfiePublicId, setSelfiePublicId] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');
  const [provinces, setProvinces] = useState<Array<{ id: string; name: string }>>([]);
  const [provLoading, setProvLoading] = useState(false);
  const [provError, setProvError] = useState('');
  const [wards, setWards] = useState<Array<{ id: string; name: string }>>([]);
  const [wardLoading, setWardLoading] = useState(false);
  const [wardError, setWardError] = useState('');
  const [frontUploading, setFrontUploading] = useState(false);
  const [backUploading, setBackUploading] = useState(false);
  const [selfieUploading, setSelfieUploading] = useState(false);

  const fetchCategories = async () => {
    setCatError('');
    setCatLoading(true);
    try {
      const res = await axios.get('/api/categories');
      const raw = res.data?.data ?? res.data ?? [];
      const list = Array.isArray(raw) ? raw : raw?.categories ?? [];
      const mapped = (Array.isArray(list) ? list : []).map((c: any) => ({
        id: c.id || c._id || c.code,
        name: c.name || c.title || String(c.name ?? c.title ?? ''),
      })).filter((c: any) => c.id && c.name);
      setCategories(mapped);
    } catch (err: any) {
      setCatError(err.response?.data?.message || 'Không thể tải danh mục.');
    } finally {
      setCatLoading(false);
    }
  };

  const fetchProvinces = async () => {
    setProvError('');
    setProvLoading(true);
    try {
      const res = await axios.get('/api/provinces');
      const raw = res.data?.data ?? res.data ?? [];
      const list = Array.isArray(raw) ? raw : raw?.provinces ?? [];
      const mapped = (Array.isArray(list) ? list : []).map((p: any) => ({
        id: p.id || p._id || p.code || p.value,
        name: p.name || p.label || p.title || String(p.name ?? p.label ?? p.title ?? p.code ?? p.value ?? ''),
      })).filter((p: any) => p.id && p.name);
      setProvinces(mapped);
    } catch (err: any) {
      setProvError(err.response?.data?.message || 'Không thể tải danh sách tỉnh/thành.');
    } finally {
      setProvLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'details' && role === 'seller') {
      if (provinces.length === 0) fetchProvinces();
      if (categories.length === 0) fetchCategories();
    }
  }, [step, role]);

  const fetchWards = async (provinceId: string) => {
    setWardError('');
    setWardLoading(true);
    try {
      const res = await axios.get(`/api/provinces/${provinceId}/wards`);
      const raw = res.data?.data ?? res.data ?? [];
      const list = Array.isArray(raw) ? raw : raw?.wards ?? [];
      const mapped = (Array.isArray(list) ? list : []).map((w: any) => ({
        id: w.id || w._id || w.code || w.value,
        name: w.name || w.label || w.title || String(w.name ?? w.label ?? w.title ?? w.code ?? w.value ?? ''),
      })).filter((w: any) => w.id && w.name);
      setWards(mapped);
    } catch (err: any) {
      setWardError(err.response?.data?.message || 'Không thể tải phường/xã.');
    } finally {
      setWardLoading(false);
    }
  };

  useEffect(() => {
    if (pickupProvinceId) {
      setPickupWardId('');
      fetchWards(pickupProvinceId);
    } else {
      setWards([]);
    }
  }, [pickupProvinceId]);

  const uploadImage = async (file: File) => {
    const form = new FormData();
    // Assuming server expects field name 'image'
    form.append('image', file);
    const res = await axios.post('/api/media/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.status === 200 && res.data?.success && res.data?.data?.url) {
      return {
        url: res.data.data.url as string,
        public_id: res.data.data.public_id as string,
      };
    }
    throw new Error(res.data?.message || 'Tải ảnh thất bại');
  };

  const handleSendVerification = async () => {
    setError('');
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/local/send-verification', { email });
      if (res.status === 200) {
        toast.success('Đã gửi mã OTP đến email');
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setError('');
    if (!otp || otp.length < 4) {
      setError('Vui lòng nhập mã OTP hợp lệ');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/local/verify-email', { email, otp });
      if (res.status === 200 && res.data?.success && res.data?.data?.verification_token) {
        setVerificationToken(res.data.data.verification_token);
        toast.success('Xác thực email thành công');
        setStep('details');
      } else {
        setError('Phản hồi xác thực không hợp lệ');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã OTP không đúng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!verificationToken) {
      setError('Thiếu verification token. Vui lòng xác thực email.');
      return;
    }

    setIsLoading(true);
    try {
      if (role === 'customer') {
        const res = await axios.post('/api/auth/local/complete-buyer-registration', {
          verification_token: verificationToken,
          name,
          password,
        });
        if (res.status === 200) {
          toast.success('Đăng ký khách hàng thành công! Đang chuyển đến trang đăng nhập...');
          setTimeout(() => {
            onSwitchToLogin();
          }, 1500);
        }
      } else {
        const selectedCats = categories.filter((c) => selectedCategories.includes(c.id));

        const body: any = {
          verification_token: verificationToken,
          name,
          password,
          phone_number: phoneNumber,
          categories: selectedCats,
          pickup_address: {
            province_id: pickupProvinceId,
            ward_id: pickupWardId,
            detail: pickupDetail,
          },
          identity_card: identityCard,
          id_front_image: idFrontUrl
            ? {
              url: idFrontUrl,
              public_id: idFrontPublicId || undefined,
            }
            : undefined,
          id_back_image: idBackUrl
            ? {
              url: idBackUrl,
              public_id: idBackPublicId || undefined,
            }
            : undefined,
          selfie_with_id_image: selfieUrl
            ? {
              url: selfieUrl,
              public_id: selfiePublicId || undefined,
            }
            : undefined,
        };

        const res = await axios.post('/api/auth/local/complete-seller-registration', body);
        if (res.status === 200) {
          toast.success('Đăng ký người bán thành công! Đang chuyển đến trang đăng nhập...');
          setTimeout(() => {
            onSwitchToLogin();
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle>Tạo tài khoản mới</CardTitle>
            <CardDescription className="mt-2">
              Bước {step === 'email' ? '1/3: Xác thực email' : step === 'otp' ? '2/3: Nhập OTP' : '3/3: Thông tin chi tiết'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step-based form */}
          {step === 'email' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Loại tài khoản</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'customer' | 'seller')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer" className="cursor-pointer">Khách hàng - Mua sắm</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="seller" id="seller" />
                    <Label htmlFor="seller" className="cursor-pointer">Người bán - Kinh doanh</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleSendVerification} className="w-full" disabled={isLoading || !email}>
                {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực (OTP)'}
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep('email')} disabled={isLoading}>
                  Quay lại
                </Button>
                <Button className="flex-1" onClick={handleVerifyEmail} disabled={isLoading || !otp}>
                  {isLoading ? 'Đang xác nhận...' : 'Xác nhận OTP'}
                </Button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {role === 'seller' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Số điện thoại</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="0912345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identity_card">Số CCCD/CMND</Label>
                    <Input
                      id="identity_card"
                      type="text"
                      placeholder="001234567890"
                      value={identityCard}
                      onChange={(e) => setIdentityCard(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Địa chỉ lấy hàng</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <Select value={pickupProvinceId} onValueChange={setPickupProvinceId}>
                          <SelectTrigger>
                            <SelectValue placeholder={provLoading ? 'Đang tải...' : 'Chọn tỉnh/thành'} />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {provError && (
                          <p className="text-xs text-red-600 mt-1">{provError}</p>
                        )}
                      </div>
                      <div>
                        <Select value={pickupWardId} onValueChange={setPickupWardId} disabled={!pickupProvinceId || wardLoading}>
                          <SelectTrigger>
                            <SelectValue placeholder={!pickupProvinceId ? 'Chọn tỉnh trước' : wardLoading ? 'Đang tải...' : 'Chọn phường/xã'} />
                          </SelectTrigger>
                          <SelectContent>
                            {wards.map((w) => (
                              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {wardError && (
                          <p className="text-xs text-red-600 mt-1">{wardError}</p>
                        )}
                      </div>
                      <Input
                        placeholder="Chi tiết"
                        value={pickupDetail}
                        onChange={(e) => setPickupDetail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Danh mục bán hàng</Label>
                    {catError && <p className="text-xs text-red-600">{catError}</p>}
                    {catLoading && <p className="text-xs text-gray-500">Đang tải danh mục...</p>}
                    <div className="space-y-2 border rounded p-3 max-h-48 overflow-y-auto">
                      {categories.length === 0 && !catLoading && (
                        <p className="text-sm text-gray-500">Chưa có danh mục</p>
                      )}
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`cat-${cat.id}`}
                            checked={selectedCategories.includes(cat.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, cat.id]);
                              } else {
                                setSelectedCategories(selectedCategories.filter((id) => id !== cat.id));
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">{cat.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ảnh mặt trước CCCD</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input type="file" accept="image/*" disabled={frontUploading} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setFrontUploading(true);
                        try {
                          const uploaded = await uploadImage(file);
                          setIdFrontUrl(uploaded.url);
                          setIdFrontPublicId(uploaded.public_id);
                          toast.success('Tải ảnh mặt trước thành công');
                        } catch (err: any) {
                          toast.error(err.message || 'Không thể tải ảnh mặt trước');
                        } finally {
                          setFrontUploading(false);
                        }
                      }} />
                      <span className="text-xs text-gray-500">{frontUploading ? 'Đang tải...' : idFrontUrl ? 'Đã chọn' : 'Chọn ảnh'}</span>
                    </div>
                    {idFrontUrl && (
                      <img src={idFrontUrl} alt="Mặt trước" className="mt-2 h-24 w-24 object-cover rounded border" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Ảnh mặt sau CCCD</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input type="file" accept="image/*" disabled={backUploading} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setBackUploading(true);
                        try {
                          const uploaded = await uploadImage(file);
                          setIdBackUrl(uploaded.url);
                          setIdBackPublicId(uploaded.public_id);
                          toast.success('Tải ảnh mặt sau thành công');
                        } catch (err: any) {
                          toast.error(err.message || 'Không thể tải ảnh mặt sau');
                        } finally {
                          setBackUploading(false);
                        }
                      }} />
                      <span className="text-xs text-gray-500">{backUploading ? 'Đang tải...' : idBackUrl ? 'Đã chọn' : 'Chọn ảnh'}</span>
                    </div>
                    {idBackUrl && (
                      <img src={idBackUrl} alt="Mặt sau" className="mt-2 h-24 w-24 object-cover rounded border" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Ảnh selfie kèm CCCD</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input type="file" accept="image/*" disabled={selfieUploading} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSelfieUploading(true);
                        try {
                          const uploaded = await uploadImage(file);
                          setSelfieUrl(uploaded.url);
                          setSelfiePublicId(uploaded.public_id);
                          toast.success('Tải ảnh selfie thành công');
                        } catch (err: any) {
                          toast.error(err.message || 'Không thể tải ảnh selfie');
                        } finally {
                          setSelfieUploading(false);
                        }
                      }} />
                      <span className="text-xs text-gray-500">{selfieUploading ? 'Đang tải...' : selfieUrl ? 'Đã chọn' : 'Chọn ảnh'}</span>
                    </div>
                    {selfieUrl && (
                      <img src={selfieUrl} alt="Selfie" className="mt-2 h-24 w-24 object-cover rounded border" />
                    )}
                  </div>
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('otp')} disabled={isLoading}>
                  Quay lại
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading || frontUploading || backUploading || selfieUploading}>
                  {isLoading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline font-medium"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
