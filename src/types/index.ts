// User & Auth
export type UserRole = 'admin' | 'seller' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'banned' | 'pending';
  // Additional fields for pending sellers
  businessName?: string;
  businessAddress?: string;
  businessLicense?: string;
  taxId?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Product
export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  stock: number;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Order
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  sellerId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  ward: string;
  postalCode?: string;
}

// Discount/Coupon
export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
}

// Shipping Policy
export interface ShippingPolicy {
  id: string;
  name: string;
  description: string;
  regions: string[];
  baseFee: number;
  feePerKm?: number;
  freeShippingThreshold?: number;
  estimatedDays: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Review
export interface Review {
  id: string;
  orderId: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  images?: string[];
  sellerId: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

// Stock Transaction
export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'import' | 'export' | 'adjustment';
  quantity: number;
  beforeStock: number;
  afterStock: number;
  cost?: number;
  reason: string;
  userId: string;
  userName: string;
  createdAt: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

// Error Log
export interface ErrorLog {
  id: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userId?: string;
  url?: string;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'product' | 'review' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// Message/Chat
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  sellerId: string;
  sellerName: string;
  orderId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'active' | 'closed';
}

// Seller Payout
export interface Payout {
  id: string;
  sellerId: string;
  sellerName: string;
  period: string;
  totalSales: number;
  commission: number;
  commissionRate: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  paidAt?: string;
  createdAt: string;
}

// Wishlist
export interface WishlistItem {
  id: string;
  customerId: string;
  productId: string;
  addedAt: string;
}

// Return Request
export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  sellerId: string;
  items: OrderItem[];
  reason: string;
  description: string;
  images?: string[];
  refundAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  processedAt?: string;
}

// Invoice
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
}