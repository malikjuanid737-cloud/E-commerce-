import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProductFilters } from './components/catalog/ProductFilters';
import { ProductGrid } from './components/catalog/ProductGrid';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderHistory } from './components/orders/OrderHistory';
import { AuthModal } from './components/auth/AuthModal';
import { subscribeToProducts } from './services/productService';
import { Product, ProductVariant, Order } from './types';
import { Sparkles, ArrowRight, Zap, Star } from 'lucide-react';
import { GlassCard } from './components/ui/GlassCard';
import { Badge } from './components/ui/Badge';
import { GlassButton } from './components/ui/GlassButton';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'orders'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<{ product: Product; variant?: ProductVariant; quantity: number } | null>(null);

  // Subscribe to real-time Firestore products
  useEffect(() => {
    const unsubscribe = subscribeToProducts((realtimeProducts) => {
      setProducts(realtimeProducts);
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        const matchesCategory = 
          selectedCategory === 'all' || 
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        // Search query filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.tags && product.tags.some((t) => t.toLowerCase().includes(q)))
        );

        // Stock filter
        const matchesStock = !inStockOnly || product.stockQuantity > 0;

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default 'featured'
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  const handleBuyNow = (product: Product, variant?: ProductVariant, quantity = 1) => {
    setDirectBuyItem({ product, variant, quantity });
    setIsCheckoutModalOpen(true);
  };

  const handleOrderComplete = (order: Order) => {
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Top Glass Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        
        {/* VIEW 1: STORE FRONT & CATALOG */}
        {activeTab === 'store' && (
          <div className="space-y-8">
            
            {/* Hero Glass Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl text-white">
              {/* Decorative Glass Blur Bubbles */}
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Glassmorphic Next-Gen Collection</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Experience The Future Of <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Tech & Design</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Explore flagship spatial audio, OLED curved displays, aerospace smartwatches, and custom mechanical peripherals synced live with Firebase Firestore.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const catalogEl = document.getElementById('catalog-grid');
                      catalogEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="gap-2"
                  >
                    <span>Shop Catalog</span>
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>

                  <div className="flex items-center gap-2 text-xs text-slate-300 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Use promo code <strong className="text-white font-bold">GLASS20</strong> for 20% OFF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Grid Section */}
            <div id="catalog-grid" className="pt-4">
              <ProductFilters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                totalProductsCount={filteredProducts.length}
              />

              <ProductGrid
                products={filteredProducts}
                loading={loadingProducts}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onResetFilters={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSortBy('featured');
                  setInStockOnly(false);
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: ORDER HISTORY & REAL-TIME TRACKING */}
        {activeTab === 'orders' && (
          <OrderHistory />
        )}

      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        onProceedToCheckout={() => {
          setDirectBuyItem(null);
          setIsCheckoutModalOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderComplete={handleOrderComplete}
        directBuyItem={directBuyItem}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
