import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sun, 
  Moon, 
  User, 
  PackageCheck, 
  Store, 
  LogOut, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { GlassButton } from '../ui/GlassButton';
import { Badge } from '../ui/Badge';

interface NavbarProps {
  activeTab: 'store' | 'orders';
  setActiveTab: (tab: 'store' | 'orders') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAuth
}) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('store')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 dark:from-white dark:via-cyan-200 dark:to-blue-300 bg-clip-text text-transparent">
                AuraGlass
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                Storefront
              </span>
            </div>
          </button>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'store'
                  ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
            >
              <Store className="w-4 h-4" />
              Store
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              My Orders
            </button>
          </nav>
        </div>

        {/* Search Bar Desktop */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audio, watches, display..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-white bg-blue-600 rounded-full border-2 border-slate-900 shadow-md animate-scale">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account Button / Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
              >
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Avatar" className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/40" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/40">
                    {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                  {userProfile?.displayName || 'Account'}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl p-2 z-50 text-xs"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-200/60 dark:border-white/10 mb-1">
                    <p className="font-semibold text-slate-800 dark:text-white truncate">{userProfile?.displayName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant="primary">
                        Customer Account
                      </Badge>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4 text-blue-400" />
                    Order History & Status
                  </button>

                  <div className="border-t border-slate-200/60 dark:border-white/10 my-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <GlassButton
              variant="outline"
              size="sm"
              onClick={onOpenAuth}
              className="gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </GlassButton>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl flex flex-col gap-3">
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-slate-100"
            />
          </div>

          <button
            onClick={() => { setActiveTab('store'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
              activeTab === 'store' ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            Store Catalog
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
              activeTab === 'orders' ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            My Orders & Tracking
          </button>
        </div>
      )}
    </header>
  );
};
