import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Plus, Pencil, Trash2, Search, Upload, Download, FileSpreadsheet, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const mockProducts: Product[] = [
  { id: '1', name: 'Áo thun nam cổ tròn', sku: 'AT001', category: 'Thời trang', price: 199000, stock: 150, status: 'in-stock' },
  { id: '2', name: 'Quần jean nữ skinny', sku: 'QJ002', category: 'Thời trang', price: 450000, stock: 8, status: 'low-stock' },
  { id: '3', name: 'Giày thể thao nam', sku: 'GT003', category: 'Giày dép', price: 890000, stock: 0, status: 'out-of-stock' },
  { id: '4', name: 'Túi xách nữ da PU', sku: 'TX004', category: 'Phụ kiện', price: 320000, stock: 45, status: 'in-stock' },
  { id: '5', name: 'Áo khoác hoodie', sku: 'AK005', category: 'Thời trang', price: 550000, stock: 25, status: 'in-stock' },
];

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
  });

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    }
  );

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', sku: '', category: '', price: '', stock: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Đã xóa sản phẩm');
  };

  const handleSave = () => {
    const stock = parseInt(formData.stock);
    const status: Product['status'] = 
      stock === 0 ? 'out-of-stock' : stock < 10 ? 'low-stock' : 'in-stock';

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                sku: formData.sku,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: stock,
                status: status,
              }
            : p
        )
      );
      toast.success('Đã cập nhật sản phẩm');
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: stock,
        status: status,
      };
      setProducts([...products, newProduct]);
      toast.success('Đã thêm sản phẩm mới');
    }
    setIsDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV');
      return;
    }

    // Simulate file processing (in real app, parse Excel file)
    toast.loading('Đang xử lý file...');
    
    setTimeout(() => {
      // Mock imported products
      const importedProducts: Product[] = [
        { id: Date.now().toString(), name: 'Sản phẩm import 1', sku: 'IMP001', category: 'Thời trang', price: 299000, stock: 100, status: 'in-stock' },
        { id: (Date.now() + 1).toString(), name: 'Sản phẩm import 2', sku: 'IMP002', category: 'Giày dép', price: 599000, stock: 50, status: 'in-stock' },
        { id: (Date.now() + 2).toString(), name: 'Sản phẩm import 3', sku: 'IMP003', category: 'Phụ kiện', price: 150000, stock: 5, status: 'low-stock' },
      ];
      
      setProducts([...products, ...importedProducts]);
      toast.success(`Đã import thành công ${importedProducts.length} sản phẩm từ file ${file.name}`);
      setIsUploadDialogOpen(false);
    }, 1500);
  };

  const handleExportTemplate = () => {
    // In real app, generate and download Excel template
    toast.success('Đã tải xuống mẫu file Excel');
  };

  const handleExportProducts = () => {
    // In real app, export products to Excel
    toast.success(`Đã xuất ${products.length} sản phẩm ra file Excel`);
  };

  const getStatusBadge = (status: Product['status']) => {
    const variants: Record<Product['status'], { variant: 'default' | 'destructive' | 'secondary'; label: string }> = {
      'in-stock': { variant: 'default', label: 'Còn hàng' },
      'low-stock': { variant: 'secondary', label: 'Sắp hết' },
      'out-of-stock': { variant: 'destructive', label: 'Hết hàng' },
    };
    return <Badge variant={variants[status].variant}>{variants[status].label}</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="mb-1 sm:mb-2">Quản lý sản phẩm</h1>
          <p className="text-gray-500 text-sm">Danh sách {filteredProducts.length} sản phẩm</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsUploadDialogOpen(true)} variant="outline" className="flex-1 sm:flex-none">
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Import Excel</span>
            <span className="sm:hidden">Import</span>
          </Button>
          <Button onClick={handleAdd} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Thêm sản phẩm</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>
      </div>

      {/* Action Cards - Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Tổng sản phẩm</p>
              <p className="text-xl sm:text-2xl mt-1">{products.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Còn hàng</p>
              <p className="text-xl sm:text-2xl mt-1 text-green-600">
                {products.filter(p => p.status === 'in-stock').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Sắp hết</p>
              <p className="text-xl sm:text-2xl mt-1 text-orange-600">
                {products.filter(p => p.status === 'low-stock').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Hết hàng</p>
              <p className="text-xl sm:text-2xl mt-1 text-red-600">
                {products.filter(p => p.status === 'out-of-stock').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="in-stock">Còn hàng</SelectItem>
                    <SelectItem value="low-stock">Sắp hết</SelectItem>
                    <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                onClick={handleExportProducts}
                className="h-9"
              >
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã sản phẩm</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price.toLocaleString('vi-VN')} ₫</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                  {getStatusBadge(product.status)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Danh mục</p>
                    <p className="text-xs">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tồn kho</p>
                    <p className="text-xs">{product.stock}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Giá</p>
                    <p>{product.price.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-3 w-3 mr-1.5" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1.5" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500 text-sm">
              Không tìm thấy sản phẩm nào
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Cập nhật thông tin sản phẩm'
                : 'Điền thông tin sản phẩm mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">Mã sản phẩm</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Nhập mã sản phẩm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Danh mục</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Nhập danh mục"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Giá (₫)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Excel Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import sản phẩm từ Excel</DialogTitle>
            <DialogDescription>
              Tải lên file Excel để thêm nhiều sản phẩm cùng lúc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <p className="text-sm mb-2">Chọn file Excel hoặc CSV</p>
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500">
                Hỗ trợ: .xlsx, .xls, .csv (tối đa 5MB)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm mb-2">📋 Định dạng file Excel:</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Cột 1: Tên sản phẩm</li>
                <li>Cột 2: Mã SKU</li>
                <li>Cột 3: Danh mục</li>
                <li>Cột 4: Giá (số)</li>
                <li>Cột 5: Tồn kho (số)</li>
              </ul>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleExportTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Tải file mẫu Excel
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}