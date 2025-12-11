import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ShoppingCart, Package, Clock, TrendingUp, DollarSign, Users, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { Button } from './ui/button';

const ordersData = [
  { day: 'T2', orders: 12, revenue: 2400000 },
  { day: 'T3', orders: 18, revenue: 3600000 },
  { day: 'T4', orders: 15, revenue: 3000000 },
  { day: 'T5', orders: 22, revenue: 4400000 },
  { day: 'T6', orders: 19, revenue: 3800000 },
  { day: 'T7', orders: 24, revenue: 4800000 },
  { day: 'CN', orders: 16, revenue: 3200000 },
];

const topProducts = [
  { name: 'Áo thun nam cổ tròn', sold: 145, revenue: 28855000 },
  { name: 'Quần jean nữ skinny', sold: 98, revenue: 44100000 },
  { name: 'Túi xách nữ da PU', sold: 87, revenue: 27840000 },
  { name: 'Áo khoác hoodie', sold: 76, revenue: 41800000 },
];

export function SellerDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mb-1 sm:mb-2">Tổng quan</h1>
        <p className="text-gray-500 text-sm">Thống kê bán hàng của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl">4.2tr</div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span> so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">Đơn hôm nay</CardTitle>
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl">24</div>
            <p className="text-xs text-gray-500">Cần xử lý: 5 đơn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">Chờ xử lý</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl">5</div>
            <p className="text-xs text-gray-500">Đơn chờ xác nhận</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm">Sản phẩm</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl">342</div>
            <p className="text-xs text-gray-500">Sắp hết: 12 SP</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Đơn hàng 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Doanh thu 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')} ₫`} />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Sản phẩm bán chạy</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">Xem tất cả</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Đã bán: {product.sold} sản phẩm</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs sm:text-sm">{product.revenue.toLocaleString('vi-VN')} ₫</p>
                  <p className="text-xs text-green-600 flex items-center justify-end gap-0.5 mt-0.5">
                    <TrendingUp className="h-3 w-3" />
                    +8%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Khách hàng</p>
                <p className="text-xl sm:text-2xl mt-1">1,234</p>
                <p className="text-xs text-gray-500 mt-1">+45 tuần này</p>
              </div>
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Đánh giá TB</p>
                <p className="text-xl sm:text-2xl mt-1">4.8 ⭐</p>
                <p className="text-xs text-gray-500 mt-1">156 đánh giá</p>
              </div>
              <Star className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Tỷ lệ hoàn hàng</p>
                <p className="text-xl sm:text-2xl mt-1">2.4%</p>
                <p className="text-xs text-green-600 flex items-center gap-0.5 mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  -0.5% so với tháng trước
                </p>
              </div>
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}