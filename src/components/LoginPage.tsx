import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';

interface LoginPageProps {
  onSwitchToRegister?: () => void;
  onLoginSuccess?: (role: 'admin' | 'seller' | 'customer') => void;
}

export function LoginPage({ onSwitchToRegister, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp' | 'password'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to role landing once user becomes available
  useEffect(() => {
    if (user && !hasRedirected) {
      setHasRedirected(true);
      onLoginSuccess?.(user.role);
    }
  }, [user, hasRedirected, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    setForgotPasswordError('');
    try {
      const res = await axios.post('/api/auth/local/forgot-password', {
        email: forgotEmail,
      });

      if (res.status === 200) {
        toast.success('Mã OTP đã được gửi đến email của bạn');
        setForgotPasswordStep('otp');
      }
    } catch (err: any) {
      setForgotPasswordError(err.response?.data?.message || 'Không thể gửi OTP. Vui lòng kiểm tra email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setForgotPasswordError('');
    try {
      const res = await axios.post('/api/auth/local/verify-reset-otp', {
        email: forgotEmail,
        otp: otp,
      });

      if (res.status === 200 && res.data?.success && res.data?.data?.reset_token) {
        setResetToken(res.data.data.reset_token);
        toast.success('OTP xác thực thành công');
        setForgotPasswordStep('password');
      }
    } catch (err: any) {
      setForgotPasswordError(err.response?.data?.message || 'Mã OTP không đúng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setForgotPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setForgotPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    setForgotPasswordError('');
    try {
      const res = await axios.post('/api/auth/local/reset-password', {
        reset_token: resetToken,
        new_password: newPassword,
      });

      if (res.status === 200) {
        toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
        setShowForgotPassword(false);
        setForgotPasswordStep('email');
        setForgotEmail('');
        setOtp('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setForgotPasswordError(err.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
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
            <CardTitle>Hệ thống quản lý bán hàng</CardTitle>
            <CardDescription className="mt-2">
              Đăng nhập để tiếp tục
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setForgotPasswordStep('email');
                    setForgotEmail('');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setForgotPasswordError('');
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>

          {onSwitchToRegister && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quên mật khẩu</DialogTitle>
            <DialogDescription>
              {forgotPasswordStep === 'email' && 'Nhập email để nhận mã OTP'}
              {forgotPasswordStep === 'otp' && 'Nhập mã OTP đã được gửi đến email của bạn'}
              {forgotPasswordStep === 'password' && 'Đặt mật khẩu mới'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {forgotPasswordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{forgotPasswordError}</AlertDescription>
              </Alert>
            )}

            {forgotPasswordStep === 'email' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleSendOtp}
                  className="w-full"
                  disabled={isLoading || !forgotEmail}
                >
                  {isLoading ? 'Đang gửi...' : 'Gửi OTP'}
                </Button>
              </>
            )}

            {forgotPasswordStep === 'otp' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Mã OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full"
                  disabled={isLoading || !otp}
                >
                  {isLoading ? 'Đang xác nhận...' : 'Xác nhận'}
                </Button>
              </>
            )}

            {forgotPasswordStep === 'password' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleResetPassword}
                  className="w-full"
                  disabled={isLoading || !newPassword || !confirmPassword}
                >
                  {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}