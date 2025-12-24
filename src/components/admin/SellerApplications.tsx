import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import {
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function SellerApplications() {
  interface Category {
    id: string;
    parent_id?: string;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  }

  interface ImageData {
    url: string;
    public_id: string;
    uploaded_at: string;
  }

  interface PickupAddress {
    ID?: string;
    ProvinceID?: string;
    WardID?: string;
    detail: string;
    phone_number?: string;
  }

  interface SellerContent {
    categories?: Category[];
    pickup_address?: PickupAddress;
    phone_number: string;
    identity_card: string;
    id_front_image?: ImageData;
    id_back_image?: ImageData;
    selfie_with_id?: ImageData;
    seller_status: 'pending' | 'active' | 'rejected';
  }

  interface SellerUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_verified: boolean;
    role_content: {
      seller: SellerContent;
    };
    created_at?: string;
  }

  interface Seller {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    identity_card: string;
    categories?: Category[];
    pickup_address?: PickupAddress;
    id_front_image?: ImageData;
    id_back_image?: ImageData;
    selfie_with_id?: ImageData;
    status: 'pending' | 'active' | 'rejected';
    created_at: string;
  }

  interface ListResponse {
    success: boolean;
    message: string;
    data: {
      users: SellerUser[];
      pagination: {
        page: number;
        page_size: number;
        total: number;
      };
    };
  }

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingUser, setRejectingUser] = useState<Seller | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSellers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        pageSize,
        seller_status: statusFilter,
      };
      if (searchKeyword) {
        (params as any).keyword = searchKeyword;
      }

      const res = await axios.get<ListResponse>('/api/admin/users/sellers', {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map API response to Seller interface
      const { users = [], pagination = {} } = res.data?.data || { users: [], pagination: {} };

      const sellerList: Seller[] = users.map((user: SellerUser) => {
        const sellerInfo = user.role_content?.seller || {};
        return {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone_number: sellerInfo.phone_number || '',
          identity_card: sellerInfo.identity_card || '',
          categories: sellerInfo.categories,
          pickup_address: sellerInfo.pickup_address,
          id_front_image: sellerInfo.id_front_image,
          id_back_image: sellerInfo.id_back_image,
          selfie_with_id: sellerInfo.selfie_with_id,
          status: sellerInfo.seller_status || 'pending',
          created_at: user.created_at || new Date().toISOString(),
        };
      });

      setSellers(sellerList);
      setTotal((pagination as any).total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người bán');
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchSellers();
  };

  const handleViewDetail = (seller: Seller) => {
    setSelectedSeller(seller);
    setIsDetailOpen(true);
  };

  const handleApprove = async (sellerId: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setActionLoading(true);
    try {
      await axios.post(`/api/admin/${sellerId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Đã duyệt tài khoản chủ cửa hàng');
      setIsDetailOpen(false);
      fetchSellers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể duyệt tài khoản');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (seller: Seller) => {
    setRejectingUser(seller);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectingUser || !rejectionReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) return;
    setActionLoading(true);
    try {
      await axios.post(`/api/admin/${rejectingUser.id}/reject`, {
        reason: rejectionReason,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Đã từ chối tài khoản chủ cửa hàng');
      setIsRejectDialogOpen(false);
      setIsDetailOpen(false);
      fetchSellers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể từ chối tài khoản');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = sellers.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="mb-2">Duyệt tài khoản chủ cửa hàng</h1>
          <p className="text-gray-500">
            Quản lý và phê duyệt đăng ký chủ cửa hàng mới
          </p>
        </div>
        <Badge
          variant="secondary"
          className="text-base px-4 py-2"
        >
          {pendingCount} chờ duyệt
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, tên cửa hàng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Tìm
            </Button>
          </div>
          <div className="flex gap-2">
            <Label className="flex items-center">Trạng thái:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="active">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Đang tải...</p>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      {!loading && sellers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchKeyword
                ? "Không tìm thấy đơn đăng ký nào"
                : "Không có đơn đăng ký nào"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sellers.map((seller) => (
            <Card
              key={seller.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Store className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                          {seller.shop_name || "Chưa có tên cửa hàng"}
                        </h3>
                        <Badge className={seller.status === 'pending' ? 'bg-yellow-500' : seller.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                          {seller.status === 'pending' ? 'Chờ duyệt' : seller.status === 'active' ? 'Đã duyệt' : 'Đã từ chối'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {seller.full_name}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        {seller.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        {seller.phone_number}
                      </div>
                      {seller.pickup_address && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {seller.pickup_address.detail || 'Địa chỉ không xác định'}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(seller.created_at).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(seller)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Chi tiết
                    </Button>
                    {seller.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(seller.id)}
                          disabled={actionLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Duyệt
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(seller)}
                          disabled={actionLoading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > pageSize && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Trang trước
          </Button>
          <span className="flex items-center px-4">Trang {page}</span>
          <Button
            variant="outline"
            disabled={page * pageSize >= total}
            onClick={() => setPage(page + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn đăng ký</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết và quyết định phê duyệt
            </DialogDescription>
          </DialogHeader>

          {selectedSeller && (
            <div className="space-y-6">
              {/* Business Info / Pickup Address */}
              <div>
                <h3 className="font-semibold mb-3">
                  Thông tin lấy hàng
                </h3>
                <div className="space-y-3">
                  {selectedSeller.pickup_address && (
                    <div>
                      <Label>Địa chỉ lấy hàng</Label>
                      <p className="text-sm mt-1">
                        {selectedSeller.pickup_address.detail || 'Địa chỉ không xác định'}
                      </p>
                      {selectedSeller.pickup_address.phone_number && (
                        <p className="text-xs text-gray-600 mt-1">
                          Số điện thoại: {selectedSeller.pickup_address.phone_number}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Personal Info */}
              <div>
                <h3 className="font-semibold mb-3">
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Họ tên</Label>
                    <p className="text-sm mt-1">
                      {selectedSeller.full_name}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm mt-1">
                      {selectedSeller.email}
                    </p>
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <p className="text-sm mt-1">
                      {selectedSeller.phone_number}
                    </p>
                  </div>
                  <div>
                    <Label>CMND/Căn cước</Label>
                    <p className="text-sm mt-1">
                      {selectedSeller.identity_card}
                    </p>
                  </div>
                  <div>
                    <Label>Ngày đăng ký</Label>
                    <p className="text-sm mt-1">
                      {new Date(
                        selectedSeller.created_at,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              {selectedSeller.categories && selectedSeller.categories.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3">
                      Danh mục
                    </h3>
                    <div className="space-y-2">
                      {selectedSeller.categories.map((category: Category) => (
                        <div key={category.id} className="p-2 border rounded bg-gray-50">
                          <p className="font-medium text-sm">{category.name}</p>
                          {category.description && (
                            <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Identity Images */}
              <div>
                <h3 className="font-semibold mb-3">
                  Ảnh xác minh
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedSeller.id_front_image && (
                    <div>
                      <Label className="text-xs">Mặt trước</Label>
                      <img
                        src={selectedSeller.id_front_image.url}
                        alt="ID front"
                        className="w-full h-auto rounded border mt-2 max-h-40 object-cover"
                      />
                    </div>
                  )}
                  {selectedSeller.id_back_image && (
                    <div>
                      <Label className="text-xs">Mặt sau</Label>
                      <img
                        src={selectedSeller.id_back_image.url}
                        alt="ID back"
                        className="w-full h-auto rounded border mt-2 max-h-40 object-cover"
                      />
                    </div>
                  )}
                  {selectedSeller.selfie_with_id && (
                    <div>
                      <Label className="text-xs">Ảnh selfie</Label>
                      <img
                        src={selectedSeller.selfie_with_id.url}
                        alt="Selfie"
                        className="w-full h-auto rounded border mt-2 max-h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              {selectedSeller.status === 'pending' && (
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                    disabled={actionLoading}
                  >
                    Đóng
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedSeller);
                    }}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Từ chối
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedSeller.id)}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Phê duyệt
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối đơn đăng ký</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối để thông báo cho người
              đăng ký
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Lý do từ chối *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(e.target.value)
                }
                placeholder="Nhập lý do từ chối..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}