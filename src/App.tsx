import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { Dashboard } from './components/Dashboard';
import { ProductsManager } from './components/ProductsManager';
import { OrdersManager } from './components/OrdersManager';
import { CustomersManager } from './components/CustomersManager';
import { SellerApplications } from './components/admin/SellerApplications';
import { AdminNotifications } from './components/admin/AdminNotifications';
import { AdminProfile } from './components/admin/AdminProfile';
import { SellerDashboard } from './components/SellerDashboard';
import { SellerOrdersView } from './components/SellerOrdersView';
import { SellerSidebar } from './components/SellerSidebar';
import { SellerAnalytics } from './components/SellerAnalytics';
import { SellerReturns } from './components/SellerReturns';
import { SellerPayouts } from './components/SellerPayouts';
import { SellerOrdersByCustomer } from './components/SellerOrdersByCustomer';
import { SellerNotifications } from './components/SellerNotifications';
import { SellerSettings } from './components/SellerSettings';
import { SellerReviews } from './components/SellerReviews';
import { SellerChat } from './components/SellerChat';
import { SellerChatDetail } from './components/SellerChatDetail';
import { CustomerShop } from './components/CustomerShop';
import { CustomerCart } from './components/CustomerCart';
import { CustomerOrders } from './components/CustomerOrders';
import { CustomerChat } from './components/CustomerChat';
import { CustomerChatDetail } from './components/CustomerChatDetail';
import { CustomerNotifications } from './components/CustomerNotifications';
import { CustomerReviews } from './components/CustomerReviews';
import { CustomerProfile } from './components/CustomerProfile';
import { ProductDetail } from './components/ProductDetail';
import { CustomerSearch } from './components/CustomerSearch';
import { CustomerCheckout } from './components/CustomerCheckout';
import { AddressMapPicker } from './components/AddressMapPicker';
import { EditProfile } from './components/EditProfile';
import { OrderDetail } from './components/OrderDetail';
import { InvoiceView } from './components/InvoiceView';
import { ReviewsDetail } from './components/ReviewsDetail';
import { OrderTracking } from './components/OrderTracking';
import { WriteReview } from './components/WriteReview';
import { ReturnOrder } from './components/ReturnOrder';
import { CustomerReturns } from './components/CustomerReturns';
import { ReturnRequestDetail } from './components/ReturnRequestDetail';
import { Button } from './components/ui/button';
import { LogOut, ShoppingCart, Package, Home, MessageCircle, Bell, Star, User, ArrowLeft, Search, BarChart3, Wallet, RotateCcw } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { mockUsers } from './data/mockData';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  stock?: number;
  description?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  storeName?: string;
  sellerId?: string;
  sellerName?: string;
  salePrice?: number;
  originalPrice?: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Áo thun nam cổ tròn', category: 'Thời trang', price: 199000, image: '👕', inStock: true, storeName: 'Fashion Store A', rating: 4.5 },
  { id: '2', name: 'Quần jean nữ skinny', category: 'Thời trang', price: 450000, image: '👖', inStock: true, storeName: 'Denim Shop', rating: 4.8 },
  { id: '3', name: 'Giày thể thao nam', category: 'Giày dép', price: 890000, image: '👟', inStock: false, storeName: 'Sport Shoes Pro', rating: 4.3 },
  { id: '4', name: 'Túi xách nữ da PU', category: 'Phụ kiện', price: 320000, image: '👜', inStock: true, storeName: 'Bags & More', rating: 4.7 },
  { id: '5', name: 'Áo khoác hoodie', category: 'Thời trang', price: 550000, image: '🧥', inStock: true, storeName: 'Fashion Store A', rating: 4.9 },
  { id: '6', name: 'Mũ lưỡi trai', category: 'Phụ kiện', price: 120000, image: '🧢', inStock: true, storeName: 'Accessories Hub', rating: 4.2 },
  { id: '7', name: 'Váy midi nữ', category: 'Thời trang', price: 380000, image: '👗', inStock: true, storeName: 'Fashion Store A', rating: 4.6 },
  { id: '8', name: 'Kính mát thời trang', category: 'Phụ kiện', price: 250000, image: '🕶️', inStock: true, storeName: 'Accessories Hub', rating: 4.4 },
];

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [showRegister, setShowRegister] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartProducts, setCartProducts] = useState<Record<string, Product>>({});
  const [chatDetail, setChatDetail] = useState<{ conversationId: string; sellerName: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAddressMap, setShowAddressMap] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState<string | null>(null);
  const [showReviewsDetail, setShowReviewsDetail] = useState(false);
  const [reviewsProductId, setReviewsProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [writeReviewData, setWriteReviewData] = useState<{
    productName: string;
    productImage: string;
    orderId: string;
    productId?: string;
    existingReview?: {
      id: string;
      rating: number;
      comment: string;
      images?: string[];
    };
  } | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [showReturns, setShowReturns] = useState(false);
  const [returnDetailId, setReturnDetailId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  }>({
    name: user?.name || 'User',
    email: user?.email || 'customer@example.com',
    phone: '0901234567',
    avatar: undefined,
  });

  useEffect(() => {
    if (!user || user.role !== 'customer') return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No access token found');
      return;
    }

    const fetchCart = async () => {
      try {
        console.log('Fetching cart...');
        const res = await axios.get('/api/cart/refresh', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Cart response:', res.data);

        const items = res.data?.data?.items || [];
        const quantities: Record<string, number> = {};
        const products: Record<string, Product> = {};

        items.forEach((item: any) => {
          const pid = item.product_id as string;
          const snap = item.snapshot || {};
          if (!pid) return;

          quantities[pid] = item.quantity ?? 0;
          products[pid] = {
            id: pid,
            name: snap.product_name || 'Sản phẩm',
            category: '',
            sellerId: item.seller_id || 'unknown',
            sellerName: snap.seller_name || 'Cửa hàng',
            storeName: snap.seller_name || 'Cửa hàng',
            price: (snap.sale_price ?? snap.price ?? 0) as number,
            salePrice: (snap.sale_price ?? snap.price ?? 0) as number,
            originalPrice: (snap.price ?? snap.sale_price ?? 0) as number,
            image: snap.image?.url || 'https://via.placeholder.com/100',
            inStock: Boolean(snap.is_available ?? true),
            stock: snap.stock ?? undefined,
            reviewCount: 0,
            soldCount: 0,
            rating: 0,
            description: '',
          };
        });

        console.log('Setting cart with', Object.keys(quantities).length, 'items');
        setCart(quantities);
        setCartProducts(products);
      } catch (err) {
        console.error('Failed to load cart:', err);
        // Don't let cart fetch error break the app - just use empty cart
        setCart({});
        setCartProducts({});
      }
    };

    fetchCart();
  }, [user]);

  if (!user) {
    if (showRegister) {
      return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return (
      <LoginPage
        onSwitchToRegister={() => setShowRegister(true)}
        onLoginSuccess={(role) => {
          // Set landing view by role
          switch (role) {
            case 'admin':
              setCurrentView('dashboard');
              break;
            case 'seller':
              setCurrentView('home');
              break;
            case 'customer':
              setCurrentView('home');
              break;
            default:
              setCurrentView('home');
          }
        }}
      />
    );
  }

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    }
  };

  const clearCart = () => {
    setCart({});
  };

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Admin view
  if (user.role === 'admin') {
    const pendingSellerCount = mockUsers.filter(u => u.role === 'seller' && u.status === 'pending').length;
    const adminNotificationCount = 8; // Mock notification count

    const renderView = () => {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard />;
        case 'products':
          return <ProductsManager />;
        case 'orders':
          return <OrdersManager />;
        case 'customers':
          return <CustomersManager />;
        case 'seller-applications':
          return <SellerApplications />;
        case 'notifications':
          return <AdminNotifications onNavigate={setCurrentView} />;
        case 'profile':
          return <AdminProfile />;
        default:
          return <Dashboard />;
      }
    };

    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            pendingCount={pendingSellerCount}
            notificationCount={adminNotificationCount}
          />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500">Xin chào, {user.name}</p>
                  <p className="text-xs text-gray-400">Quản trị viên</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
              {renderView()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Seller view
  if (user.role === 'seller') {
    const renderView = () => {
      // Handle chat detail view
      if (chatDetail) {
        return (
          <SellerChatDetail
            conversationId={chatDetail.conversationId}
            customerName={chatDetail.sellerName}
            onBack={() => {
              setChatDetail(null);
            }}
          />
        );
      }

      switch (currentView) {
        case 'home':
          return <SellerDashboard />;
        case 'orders':
          return <SellerOrdersView />;
        case 'orders-by-customer':
          return <SellerOrdersByCustomer />;
        case 'products':
          return <ProductsManager />;
        case 'reviews':
          return <SellerReviews />;
        case 'analytics':
          return <SellerAnalytics />;
        case 'returns':
          return <SellerReturns />;
        case 'payouts':
          return <SellerPayouts />;
        case 'chat':
          return (
            <SellerChat
              onSelectConversation={(id, name) => setChatDetail({ conversationId: id, sellerName: name })}
            />
          );
        case 'notifications':
          return <SellerNotifications />;
        case 'settings':
          return <SellerSettings />;
        default:
          return <SellerDashboard />;
      }
    };

    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <SellerSidebar
              currentView={currentView}
              onNavigate={setCurrentView}
              userName={user.name}
              onLogout={logout}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Mobile Header */}
            <header className="bg-white border-b sticky top-0 z-10 md:hidden">
              <div className="px-3 py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">Seller Dashboard</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="container mx-auto p-3 sm:p-6 pb-20 md:pb-6">
              {renderView()}
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-20">
            <div className="grid grid-cols-5 h-16">
              <button
                onClick={() => setCurrentView('home')}
                className={`flex flex-col items-center justify-center gap-1 ${currentView === 'home' ? 'text-blue-600' : 'text-gray-600'
                  }`}
              >
                <Home className="h-5 w-5" />
                <span className="text-[10px]">Tổng quan</span>
              </button>
              <button
                onClick={() => setCurrentView('orders')}
                className={`flex flex-col items-center justify-center gap-1 relative ${currentView === 'orders' ? 'text-blue-600' : 'text-gray-600'
                  }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[10px]">Đơn hàng</span>
                <Badge variant="destructive" className="absolute top-1 right-4 h-4 min-w-[16px] rounded-full px-1 text-[9px]">
                  5
                </Badge>
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`flex flex-col items-center justify-center gap-1 ${currentView === 'analytics' ? 'text-blue-600' : 'text-gray-600'
                  }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-[10px]">Thống kê</span>
              </button>
              <button
                onClick={() => setCurrentView('returns')}
                className={`flex flex-col items-center justify-center gap-1 relative ${currentView === 'returns' ? 'text-blue-600' : 'text-gray-600'
                  }`}
              >
                <RotateCcw className="h-5 w-5" />
                <span className="text-[10px]">Trả hàng</span>
                <Badge variant="destructive" className="absolute top-1 right-4 h-4 min-w-[16px] rounded-full px-1 text-[9px]">
                  2
                </Badge>
              </button>
              <button
                onClick={() => setCurrentView('payouts')}
                className={`flex flex-col items-center justify-center gap-1 ${currentView === 'payouts' ? 'text-blue-600' : 'text-gray-600'
                  }`}
              >
                <Wallet className="h-5 w-5" />
                <span className="text-[10px]">Thu nhập</span>
              </button>
            </div>
          </nav>
        </div>
      </SidebarProvider>
    );
  }

  // Customer view
  if (user.role === 'customer') {
    // Show Search Screen
    if (showSearch) {
      return (
        <CustomerSearch
          onSelectProduct={(product) => {
            setSelectedProduct(product);
            setShowSearch(false);
          }}
          onBack={() => setShowSearch(false)}
          products={mockProducts}
        />
      );
    }

    // Show Address Map Picker
    if (showAddressMap) {
      return (
        <AddressMapPicker
          onBack={() => setShowAddressMap(false)}
          onSelectAddress={(address, lat, lng) => {
            console.log('Selected address:', address, lat, lng);
            setShowAddressMap(false);
          }}
        />
      );
    }

    // Show Edit Profile
    if (showEditProfile) {
      return (
        <EditProfile
          onBack={() => setShowEditProfile(false)}
          currentProfile={userProfile}
          onSave={(profile) => setUserProfile(profile)}
        />
      );
    }

    // Show Order Detail
    if (selectedOrderId) {
      const mockOrder = {
        id: selectedOrderId,
        orderNumber: 'DH012',
        date: '2025-11-08',
        total: 670000,
        status: 'delivered' as const,
        sellerName: 'Nhân viên bán hàng A',
        trackingNumber: 'VN123456789',
        items: [
          { name: 'Áo thun nam cổ tròn', quantity: 2, price: 199000, image: '👕' },
          { name: 'Mũ lưỡi trai', quantity: 1, price: 120000, image: '🧢' },
        ],
      };
      return (
        <OrderDetail
          order={mockOrder}
          onBack={() => setSelectedOrderId(null)}
          onViewInvoice={(orderId) => {
            setSelectedOrderId(null);
            setShowInvoice(orderId);
          }}
          onChatWithSeller={() => {
            setSelectedOrderId(null);
            setCurrentView('chat');
          }}
          onReturnOrder={() => {
            setReturnOrderId(selectedOrderId);
            setSelectedOrderId(null);
          }}
        />
      );
    }

    // Show Return Order
    if (returnOrderId) {
      const mockOrder = {
        id: returnOrderId,
        orderNumber: 'DH012',
        date: '2025-11-08',
        total: 670000,
        items: [
          { id: '1', name: 'Áo thun nam cổ tròn', quantity: 2, price: 199000, image: '👕' },
          { id: '2', name: 'Mũ lưỡi trai', quantity: 1, price: 120000, image: '🧢' },
        ],
      };
      return (
        <ReturnOrder
          order={mockOrder}
          onBack={() => setReturnOrderId(null)}
        />
      );
    }

    // Show Order Tracking
    if (trackingOrderId) {
      return (
        <OrderTracking
          orderId={trackingOrderId}
          onBack={() => setTrackingOrderId(null)}
        />
      );
    }

    // Show Invoice
    if (showInvoice) {
      return (
        <InvoiceView
          orderId={showInvoice}
          onBack={() => setShowInvoice(null)}
        />
      );
    }

    // Show Reviews Detail
    if (showReviewsDetail || reviewsProductId) {
      return (
        <ReviewsDetail
          onBack={() => {
            setShowReviewsDetail(false);
            setReviewsProductId(null);
          }}
          productId={reviewsProductId || undefined}
        />
      );
    }

    // Show Return Request Detail
    if (returnDetailId) {
      return (
        <ReturnRequestDetail
          returnId={returnDetailId}
          onBack={() => setReturnDetailId(null)}
        />
      );
    }

    // Show Returns List
    if (showReturns) {
      return (
        <CustomerReturns
          onViewDetail={(returnId) => {
            setReturnDetailId(returnId);
            setShowReturns(false);
          }}
          onBack={() => setShowReturns(false)}
        />
      );
    }

    // Show Write/Edit Review Screen
    if (writeReviewData) {
      return (
        <WriteReview
          productName={writeReviewData.productName}
          productImage={writeReviewData.productImage}
          orderId={writeReviewData.orderId}
          productId={writeReviewData.productId}
          existingReview={writeReviewData.existingReview}
          onBack={() => setWriteReviewData(null)}
        />
      );
    }

    // Show Checkout Screen
    if (showCheckout) {
      return (
        <div>
          <CustomerCheckout
            cart={cart}
            products={mockProducts}
            onBack={() => setShowCheckout(false)}
            onCheckoutSuccess={() => {
              setShowCheckout(false);
              setCurrentView('orders');
            }}
            onAddAddress={() => setShowAddressMap(true)}
            clearCart={clearCart}
          />
        </div>
      );
    }

    const renderView = () => {
      switch (currentView) {
        case 'home':
          if (selectedProduct) {
            return (
              <ProductDetail
                product={{ ...selectedProduct, stock: selectedProduct.stock || 50 }}
                onBack={() => setSelectedProduct(null)}
                addToCart={addToCart}
                onViewReviews={(productId) => {
                  setReviewsProductId(productId);
                }}
              />
            );
          }
          return (
            <CustomerShop
              cart={cart}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
              onSelectProduct={(product) => setSelectedProduct(product)}
            />
          );
        case 'cart':
          return (
            <CustomerCart
              cart={cart}
              products={cartProducts}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
              onCheckout={() => setShowCheckout(true)}
              onBack={() => setCurrentView('home')}
            />
          );
        case 'orders':
          return (
            <CustomerOrders
              onViewOrderDetail={(orderId) => setSelectedOrderId(orderId)}
              onViewTracking={(orderId) => setTrackingOrderId(orderId)}
              onViewReturns={() => setShowReturns(true)}
            />
          );
        case 'reviews':
          return (
            <CustomerReviews
              onViewReviewsDetail={() => setShowReviewsDetail(true)}
              onWriteReview={(data) => setWriteReviewData(data)}
              onEditReview={(data) => setWriteReviewData({
                productName: data.productName,
                productImage: data.productImage,
                orderId: data.orderId,
                existingReview: {
                  id: data.reviewId,
                  rating: data.rating,
                  comment: data.comment,
                  images: data.images,
                },
              })}
            />
          );
        case 'chat':
          if (chatDetail) {
            return (
              <CustomerChatDetail
                conversationId={chatDetail.conversationId}
                sellerName={chatDetail.sellerName}
                onBack={() => {
                  setChatDetail(null);
                  setCurrentView('chat');
                }}
              />
            );
          }
          return (
            <CustomerChat
              onSelectConversation={(id, name) => setChatDetail({ conversationId: id, sellerName: name })}
            />
          );
        case 'notifications':
          return <CustomerNotifications />;
        case 'profile':
          return (
            <CustomerProfile
              onEditProfile={() => setShowEditProfile(true)}
              onViewOrders={() => setCurrentView('orders')}
              onViewReturns={() => setShowReturns(true)}
              onViewReviews={() => setCurrentView('reviews')}
              onViewChat={() => setCurrentView('chat')}
              onViewNotifications={() => setCurrentView('notifications')}
              profile={userProfile}
            />
          );
        default:
          return (
            <CustomerShop
              cart={cart}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                setCurrentView('product-detail');
              }}
            />
          );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile-friendly header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex justify-between items-center">
              {selectedProduct ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProduct(null)}
                  className="-ml-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearch(true)}
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Tìm kiếm</span>
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                {currentView !== 'cart' && !selectedProduct && !showCheckout && (
                  <>
                    <button
                      onClick={() => setCurrentView('notifications')}
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                      >
                        3
                      </Badge>
                    </button>
                    <button
                      onClick={() => setCurrentView('cart')}
                      className="relative"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                        >
                          {cartItemCount}
                        </Badge>
                      )}
                    </button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 pb-24">
          {renderView()}
        </main>

        {/* Bottom navigation for mobile */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
          <div className="grid grid-cols-5">
            <button
              onClick={() => {
                setCurrentView('home');
                setChatDetail(null);
                setSelectedProduct(null);
              }}
              className={`flex flex-col items-center py-2 ${currentView === 'home' ? 'text-blue-600' : 'text-gray-600'
                }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Trang chủ</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('orders');
                setChatDetail(null);
              }}
              className={`flex flex-col items-center py-2 ${currentView === 'orders' ? 'text-blue-600' : 'text-gray-600'
                }`}
            >
              <Package className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Đơn hàng</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('reviews');
                setChatDetail(null);
                setSelectedProduct(null);
              }}
              className={`flex flex-col items-center py-2 ${currentView === 'reviews' ? 'text-blue-600' : 'text-gray-600'
                }`}
            >
              <Star className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Đánh giá</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('chat');
                setChatDetail(null);
                setSelectedProduct(null);
              }}
              className={`flex flex-col items-center py-2 ${currentView === 'chat' ? 'text-blue-600' : 'text-gray-600'
                }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Tin nhắn</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('profile');
                setChatDetail(null);
                setSelectedProduct(null);
              }}
              className={`flex flex-col items-center py-2 ${currentView === 'profile' ? 'text-blue-600' : 'text-gray-600'
                }`}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Cá nhân</span>
            </button>
          </div>
        </nav>

        {/* Desktop sidebar */}
        <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r p-4">
          <nav className="space-y-2">
            <Button
              variant={currentView === 'home' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentView('home')}
            >
              <Home className="h-4 w-4 mr-2" />
              Cửa hàng
            </Button>
            <Button
              variant={currentView === 'cart' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentView('cart')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Giỏ hàng
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={currentView === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('orders');
                setChatDetail(null);
              }}
            >
              <Package className="h-4 w-4 mr-2" />
              Đơn hàng của tôi
            </Button>
            <Button
              variant={currentView === 'notifications' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('notifications');
                setChatDetail(null);
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Thông báo
            </Button>
            <Button
              variant={currentView === 'chat' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('chat');
                setChatDetail(null);
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Tin nhắn
            </Button>
            <Button
              variant={currentView === 'reviews' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('reviews');
                setChatDetail(null);
                setSelectedProduct(null);
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Đánh giá
            </Button>
            <Button
              variant={currentView === 'profile' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setCurrentView('profile');
                setChatDetail(null);
                setSelectedProduct(null);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Thông tin cá nhân
            </Button>
          </nav>
        </div>
      </div>
    );
  }

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}