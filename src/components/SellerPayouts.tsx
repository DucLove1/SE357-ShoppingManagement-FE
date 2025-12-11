import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Payout {
  id: string;
  period: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  date: string;
}

const mockPayouts: Payout[] = [
  {
    id: '1',
    period: 'Tháng 11/2025',
    amount: 67000000,
    status: 'processing',
    date: '2025-11-15',
  },
  {
    id: '2',
    period: 'Tháng 10/2025',
    amount: 55000000,
    status: 'completed',
    date: '2025-10-15',
  },
  {
    id: '3',
    period: 'Tháng 9/2025',
    amount: 61000000,
    status: 'completed',
    date: '2025-09-15',
  },
  {
    id: '4',
    period: 'Tháng 8/2025',
    amount: 48000000,
    status: 'completed',
    date: '2025-08-15',
  },
];

export function SellerPayouts() {
  const getStatusBadge = (status: Payout['status']) => {
    const config = {
      pending: { variant: 'secondary' as const, label: 'Chờ xử lý', icon: Clock },
      processing: { variant: 'default' as const, label: 'Đang xử lý', icon: AlertCircle },
      completed: { variant: 'outline' as const, label: 'Đã thanh toán', icon: CheckCircle2 },
    };
    const { variant, label, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const totalEarnings = mockPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = mockPayouts
    .filter((p) => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mb-1 sm:mb-2">Thanh toán</h1>
        <p className="text-gray-500 text-sm">Quản lý thu nhập và thanh toán</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Tổng thu nhập</p>
                <p className="text-xl sm:text-2xl mt-1">{(totalEarnings / 1000000).toFixed(1)}tr</p>
                <p className="text-xs text-gray-500 mt-1">Tất cả thời gian</p>
              </div>
              <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Chờ thanh toán</p>
                <p className="text-xl sm:text-2xl mt-1">{(pendingAmount / 1000000).toFixed(1)}tr</p>
                <p className="text-xs text-gray-500 mt-1">Sẽ được chuyển sớm</p>
              </div>
              <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Thu nhập tháng này</p>
                <p className="text-xl sm:text-2xl mt-1">67tr</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +21.8%
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Lịch sử thanh toán</CardTitle>
          <Button variant="outline" size="sm" className="text-xs">
            Xuất báo cáo
          </Button>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kỳ thanh toán</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.period}</TableCell>
                    <TableCell>{payout.amount.toLocaleString('vi-VN')} ₫</TableCell>
                    <TableCell>{new Date(payout.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {mockPayouts.map((payout) => (
              <Card key={payout.id} className="p-3">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm">{payout.period}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payout.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {getStatusBadge(payout.status)}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-500">Số tiền:</span>
                  <span className="text-sm">{payout.amount.toLocaleString('vi-VN')} ₫</span>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Thông tin thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p>Chu kỳ thanh toán: <span className="font-semibold">Hàng tháng</span></p>
                <p className="text-xs text-gray-500 mt-1">
                  Thanh toán vào ngày 15 hàng tháng cho doanh thu tháng trước
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p>Phương thức thanh toán: <span className="font-semibold">Chuyển khoản ngân hàng</span></p>
                <p className="text-xs text-gray-500 mt-1">
                  Kiểm tra thông tin tài khoản trong phần Cài đặt
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}