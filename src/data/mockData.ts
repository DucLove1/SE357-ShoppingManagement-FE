import { User, Category, Product, Order, Coupon, ShippingPolicy, Review, ActivityLog, ErrorLog, Notification, Conversation, Payout, ReturnRequest } from '../types';

// Users
export const mockUsers: User[] = [
  { id: '1', name: 'Quản trị viên', email: 'admin@shop.com', phone: '0901234567', role: 'admin', status: 'active', createdAt: '2025-01-01' },
  { id: '2', name: 'Nhân viên bán hàng A', email: 'seller@shop.com', phone: '0912345678', role: 'seller', status: 'active', createdAt: '2025-02-01' },
  { id: '3', name: 'Nhân viên bán hàng B', email: 'seller2@shop.com', phone: '0923456789', role: 'seller', status: 'active', createdAt: '2025-03-01' },
  { id: '4', name: 'Nguyễn Văn A', email: 'customer@shop.com', phone: '0934567890', role: 'customer', status: 'active', createdAt: '2025-04-01' },
  { id: '5', name: 'Trần Thị B', email: 'customer2@shop.com', phone: '0945678901', role: 'customer', status: 'active', createdAt: '2025-05-01' },
];

// Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Thời trang nam', description: 'Quần áo, phụ kiện nam', status: 'active', createdAt: '2025-01-01' },
  { id: '2', name: 'Thời trang nữ', description: 'Quần áo, phụ kiện nữ', status: 'active', createdAt: '2025-01-01' },
  { id: '3', name: 'Giày dép', description: 'Giày, dép các loại', status: 'active', createdAt: '2025-01-01' },
  { id: '4', name: 'Phụ kiện', description: 'Túi xách, ví, mũ', status: 'active', createdAt: '2025-01-01' },
  { id: '5', name: 'Điện tử', description: 'Thiết bị điện tử', status: 'active', createdAt: '2025-01-01' },
];

// Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Áo thun nam cổ tròn',
    sku: 'AT001',
    description: 'Áo thun cotton cao cấp, thoáng mát',
    category: 'Thời trang nam',
    categoryId: '1',
    price: 199000,
    compareAtPrice: 250000,
    cost: 120000,
    stock: 150,
    images: ['👕'],
    status: 'active',
    sellerId: '2',
    sellerName: 'Nhân viên bán hàng A',
    rating: 4.5,
    reviewCount: 28,
    tags: ['nam', 'áo', 'cotton'],
    createdAt: '2025-01-15',
    updatedAt: '2025-11-08',
  },
  {
    id: '2',
    name: 'Quần jean nữ skinny',
    sku: 'QJ002',
    description: 'Quần jean co giãn, form dáng đẹp',
    category: 'Thời trang nữ',
    categoryId: '2',
    price: 450000,
    compareAtPrice: 550000,
    cost: 280000,
    stock: 8,
    images: ['👖'],
    status: 'active',
    sellerId: '2',
    sellerName: 'Nhân viên bán hàng A',
    rating: 4.8,
    reviewCount: 45,
    tags: ['nữ', 'quần', 'jean'],
    createdAt: '2025-02-10',
    updatedAt: '2025-11-07',
  },
  {
    id: '3',
    name: 'Giày thể thao nam',
    sku: 'GT003',
    description: 'Giày thể thao êm chân, phù hợp chạy bộ',
    category: 'Giày dép',
    categoryId: '3',
    price: 890000,
    compareAtPrice: 1200000,
    cost: 550000,
    stock: 0,
    images: ['👟'],
    status: 'active',
    sellerId: '3',
    sellerName: 'Nhân viên bán hàng B',
    rating: 4.7,
    reviewCount: 67,
    tags: ['giày', 'thể thao', 'nam'],
    createdAt: '2025-03-05',
    updatedAt: '2025-11-06',
  },
  {
    id: '4',
    name: 'Túi xách nữ da PU',
    sku: 'TX004',
    description: 'Túi xách thời trang, nhiều ngăn tiện dụng',
    category: 'Phụ kiện',
    categoryId: '4',
    price: 320000,
    cost: 180000,
    stock: 45,
    images: ['👜'],
    status: 'active',
    sellerId: '2',
    sellerName: 'Nhân viên bán hàng A',
    rating: 4.6,
    reviewCount: 32,
    tags: ['túi', 'nữ', 'phụ kiện'],
    createdAt: '2025-04-12',
    updatedAt: '2025-11-05',
  },
];

// Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'DH001',
    customerId: '4',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'customer@shop.com',
    customerPhone: '0934567890',
    items: [
      { id: '1', productId: '1', productName: 'Áo thun nam cổ tròn', productImage: '👕', sku: 'AT001', price: 199000, quantity: 2, sellerId: '2' },
      { id: '2', productId: '4', productName: 'Túi xách nữ da PU', productImage: '👜', sku: 'TX004', price: 320000, quantity: 1, sellerId: '2' },
    ],
    subtotal: 718000,
    discount: 50000,
    discountCode: 'SALE50K',
    shippingFee: 30000,
    tax: 0,
    total: 698000,
    status: 'delivered',
    paymentMethod: 'COD',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'Nguyễn Văn A',
      phone: '0934567890',
      street: '123 Đường ABC',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
    },
    trackingNumber: 'VN123456789',
    createdAt: '2025-11-01T10:30:00',
    updatedAt: '2025-11-05T15:20:00',
    deliveredAt: '2025-11-05T15:20:00',
  },
  {
    id: '2',
    orderNumber: 'DH002',
    customerId: '5',
    customerName: 'Trần Thị B',
    customerEmail: 'customer2@shop.com',
    customerPhone: '0945678901',
    items: [
      { id: '3', productId: '2', productName: 'Quần jean nữ skinny', productImage: '👖', sku: 'QJ002', price: 450000, quantity: 1, sellerId: '2' },
    ],
    subtotal: 450000,
    discount: 0,
    shippingFee: 30000,
    tax: 0,
    total: 480000,
    status: 'shipping',
    paymentMethod: 'Banking',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'Trần Thị B',
      phone: '0945678901',
      street: '456 Đường XYZ',
      city: 'Hà Nội',
      district: 'Quận Hoàn Kiếm',
      ward: 'Phường Hàng Bạc',
    },
    trackingNumber: 'VN987654321',
    createdAt: '2025-11-07T14:20:00',
    updatedAt: '2025-11-08T09:15:00',
  },
];

// Coupons
export const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'SALE50K',
    description: 'Giảm 50.000đ cho đơn từ 500.000đ',
    type: 'fixed',
    value: 50000,
    minOrderValue: 500000,
    usageLimit: 100,
    usedCount: 23,
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: 'active',
    createdAt: '2025-10-25',
  },
  {
    id: '2',
    code: 'DISCOUNT20',
    description: 'Giảm 20% tối đa 200.000đ',
    type: 'percentage',
    value: 20,
    minOrderValue: 300000,
    maxDiscount: 200000,
    usageLimit: 50,
    usedCount: 12,
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    status: 'active',
    createdAt: '2025-10-20',
  },
];

// Shipping Policies
export const mockShippingPolicies: ShippingPolicy[] = [
  {
    id: '1',
    name: 'Giao hàng nội thành',
    description: 'Giao hàng trong nội thành TP.HCM',
    regions: ['TP. Hồ Chí Minh'],
    baseFee: 30000,
    freeShippingThreshold: 500000,
    estimatedDays: '1-2 ngày',
    status: 'active',
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    name: 'Giao hàng toàn quốc',
    description: 'Giao hàng tất cả tỉnh thành',
    regions: ['Toàn quốc'],
    baseFee: 50000,
    freeShippingThreshold: 1000000,
    estimatedDays: '3-7 ngày',
    status: 'active',
    createdAt: '2025-01-01',
  },
];

// Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    orderId: '1',
    productId: '1',
    customerId: '4',
    customerName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sản phẩm chất lượng, giao hàng nhanh!',
    sellerId: '2',
    response: 'Cảm ơn bạn đã ủng hộ shop!',
    createdAt: '2025-11-06T10:00:00',
    updatedAt: '2025-11-06T11:00:00',
  },
];

// Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Quản trị viên',
    userRole: 'admin',
    action: 'Tạo sản phẩm',
    entity: 'Product',
    entityId: '1',
    details: 'Tạo sản phẩm: Áo thun nam cổ tròn',
    createdAt: '2025-11-08T08:30:00',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Nhân viên bán hàng A',
    userRole: 'seller',
    action: 'Cập nhật đơn hàng',
    entity: 'Order',
    entityId: '2',
    details: 'Đổi trạng thái đơn hàng DH002 sang "shipping"',
    createdAt: '2025-11-08T09:15:00',
  },
];

// Error Logs
export const mockErrorLogs: ErrorLog[] = [
  {
    id: '1',
    level: 'error',
    message: 'Failed to load product image',
    stack: 'Error at ProductImage.tsx:45',
    userId: '4',
    url: '/products/123',
    createdAt: '2025-11-07T14:20:00',
  },
  {
    id: '2',
    level: 'warning',
    message: 'Slow API response',
    userId: '2',
    url: '/api/orders',
    createdAt: '2025-11-08T10:00:00',
  },
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    type: 'order',
    title: 'Đơn hàng mới',
    message: 'Bạn có đơn hàng mới DH002',
    link: '/orders/2',
    read: false,
    createdAt: '2025-11-07T14:20:00',
  },
  {
    id: '2',
    userId: '4',
    type: 'order',
    title: 'Đơn hàng đang giao',
    message: 'Đơn hàng DH001 đang được giao đến bạn',
    link: '/my-orders/1',
    read: true,
    createdAt: '2025-11-05T09:00:00',
  },
];

// Conversations
export const mockConversations: Conversation[] = [
  {
    id: '1',
    customerId: '4',
    customerName: 'Nguyễn Văn A',
    sellerId: '2',
    sellerName: 'Nhân viên bán hàng A',
    orderId: '1',
    lastMessage: 'Sản phẩm rất tốt, cảm ơn shop!',
    lastMessageAt: '2025-11-06T10:30:00',
    unreadCount: 0,
    status: 'active',
  },
];

// Payouts
export const mockPayouts: Payout[] = [
  {
    id: '1',
    sellerId: '2',
    sellerName: 'Nhân viên bán hàng A',
    period: 'Tháng 10/2025',
    totalSales: 15000000,
    commission: 1500000,
    commissionRate: 10,
    netAmount: 13500000,
    status: 'paid',
    paidAt: '2025-11-05',
    createdAt: '2025-11-01',
  },
];

// Return Requests
export const mockReturnRequests: ReturnRequest[] = [
  {
    id: '1',
    orderId: '1',
    orderNumber: 'DH001',
    customerId: '4',
    customerName: 'Nguyễn Văn A',
    sellerId: '2',
    items: [
      { id: '1', productId: '1', productName: 'Áo thun nam cổ tròn', productImage: '👕', sku: 'AT001', price: 199000, quantity: 1, sellerId: '2' },
    ],
    reason: 'Sản phẩm lỗi',
    description: 'Áo bị rách ở phần vai',
    refundAmount: 199000,
    status: 'pending',
    createdAt: '2025-11-08T10:00:00',
  },
];
