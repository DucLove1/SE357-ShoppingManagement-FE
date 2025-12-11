import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

const revenueData = [
  { month: 'T1', revenue: 45000000, orders: 234, customers: 145 },
  { month: 'T2', revenue: 52000000, orders: 267, customers: 189 },
  { month: 'T3', revenue: 48000000, orders: 245, customers: 167 },
  { month: 'T4', revenue: 61000000, orders: 312, customers: 223 },
  { month: 'T5', revenue: 55000000, orders: 289, customers: 198 },
  { month: 'T6', revenue: 67000000, orders: 356, customers: 267 },
];

const categoryData = [
  { name: 'Thời trang', value: 45, revenue: 45000000 },
  { name: 'Giày dép', value: 25, revenue: 25000000 },
  { name: 'Phụ kiện', value: 20, revenue: 20000000 },
  { name: 'Khác', value: 10, revenue: 10000000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

const topCustomers = [
  { name: 'Nguyễn Văn A', orders: 24, spent: 12500000 },
  { name: 'Trần Thị B', orders: 18, spent: 9800000 },
  { name: 'Lê Văn C', orders: 15, spent: 8200000 },
  { name: 'Phạm Thị D', orders: 12, spent: 6700000 },
  { name: 'Hoàng Văn E', orders: 10, spent: 5400000 },
];

export function SellerAnalytics() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mb-1 sm:mb-2">Thống kê & Báo cáo</h1>
        <p className="text-gray-500 text-sm">Phân tích hiệu quả kinh doanh</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Doanh thu tháng này</p>
                <p className="text-xl sm:text-2xl mt-1">67tr</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +21.8%
                </p>
              </div>
              <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Đơn hàng tháng này</p>
                <p className="text-xl sm:text-2xl mt-1">356</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +23.2%
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Sản phẩm bán ra</p>
                <p className="text-xl sm:text-2xl mt-1">1,234</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +15.3%
                </p>
              </div>
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Khách hàng mới</p>
                <p className="text-xl sm:text-2xl mt-1">267</p>
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" />
                  -5.4%
                </p>
              </div>
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue" className="text-xs sm:text-sm">Doanh thu</TabsTrigger>
          <TabsTrigger value="orders" className="text-xs sm:text-sm">Đơn hàng</TabsTrigger>
          <TabsTrigger value="customers" className="text-xs sm:text-sm">Khách hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Doanh thu 6 tháng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')} ₫`} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Số đơn hàng 6 tháng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Khách hàng mới 6 tháng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Distribution & Top Customers */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Phân bổ theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${props.payload.revenue.toLocaleString('vi-VN')} ₫`,
                  props.payload.name
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Top khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.orders} đơn hàng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{customer.spent.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
