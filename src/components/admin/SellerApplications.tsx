import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { User } from "../../types";
import { mockUsers } from "../../data/mockData";

export function SellerApplications() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] =
    useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingUser, setRejectingUser] =
    useState<User | null>(null);

  const pendingSellers = users.filter(
    (user) =>
      user.role === "seller" && user.status === "pending",
  );

  const filteredApplications = pendingSellers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.businessName?.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleApprove = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: "active" as const,
              approvedAt: new Date().toISOString(),
              approvedBy: "1", // Admin ID
            }
          : u,
      ),
    );
    toast.success("Đã duyệt tài khoản chủ cửa hàng");
    setIsDetailOpen(false);
  };

  const handleReject = (user: User) => {
    setRejectingUser(user);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (!rejectingUser || !rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setUsers(
      users.map((u) =>
        u.id === rejectingUser.id
          ? {
              ...u,
              status: "inactive" as const,
              rejectedAt: new Date().toISOString(),
              rejectedBy: "1", // Admin ID
              rejectionReason,
            }
          : u,
      ),
    );
    toast.success("Đã từ chối tài khoản chủ cửa hàng");
    setIsRejectDialogOpen(false);
    setIsDetailOpen(false);
  };

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
          {pendingSellers.length} chờ duyệt
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, email, tên cửa hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchTerm
                ? "Không tìm thấy đơn đăng ký nào"
                : "Không có đơn đăng ký nào đang chờ duyệt"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((user) => (
            <Card
              key={user.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Store className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                          {user.businessName ||
                            "Chưa có tên cửa hàng"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {user.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </div>
                      {user.businessAddress && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {user.businessAddress}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(
                          user.createdAt,
                        ).toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    {user.businessDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {user.businessDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(user)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Chi tiết
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Duyệt
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(user)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

          {selectedUser && (
            <div className="space-y-6">
              {/* Business Info */}
              <div>
                <h3 className="font-semibold mb-3">
                  Thông tin cửa hàng
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Tên cửa hàng</Label>
                    <p className="text-sm mt-1">
                      {selectedUser.businessName ||
                        "Chưa cung cấp"}
                    </p>
                  </div>
                  {selectedUser.businessDescription && (
                    <div>
                      <Label>Mô tả</Label>
                      <p className="text-sm mt-1">
                        {selectedUser.businessDescription}
                      </p>
                    </div>
                  )}
                  {selectedUser.businessAddress && (
                    <div>
                      <Label>Địa chỉ</Label>
                      <p className="text-sm mt-1">
                        {selectedUser.businessAddress}
                      </p>
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
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm mt-1">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <p className="text-sm mt-1">
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div>
                    <Label>Ngày đăng ký</Label>
                    <p className="text-sm mt-1">
                      {new Date(
                        selectedUser.createdAt,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Đóng
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleReject(selectedUser);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
                <Button
                  onClick={() => handleApprove(selectedUser.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Phê duyệt
                </Button>
              </div>
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