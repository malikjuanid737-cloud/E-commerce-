import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { GlassButton } from '../ui/GlassButton';
import { useToast } from '../../context/ToastContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal,
    promoCode,
    applyPromoCode,
    discountAmount,
    total
  } = useCart();

  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      showToast(`Promo code "${promoInput.toUpperCase()}" applied! (20% OFF)`, 'success');
      setPromoInput('');
    } else {
      showToast('Invalid promo code. Try "GLASS20"', 'error');
    }
  };

  const tax = total * 0.08; // 8% estimated tax
  const grandTotal = total + tax;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer Slide Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 right-0 max-w-full flex pl-10"
          >
            <div className="w-screen max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-white/60 dark:border-white/10 shadow-2xl flex flex-col justify-between text-slate-800 dark:text-slate-100">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shopping Cart</h2>
                    <p className="text-xs text-slate-500">{cartItems.length} unique items</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-slate-400 hover:text-rose-500 transition-colors mr-2"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 text-base mb-1">Your cart is empty</p>
                    <p className="text-xs text-slate-500 max-w-xs mb-6">Explore our futuristic glassmorphic collection and add items to your cart.</p>
                    <GlassButton variant="primary" size="sm" onClick={() => setIsCartOpen(false)}>
                      Browse Catalog
                    </GlassButton>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 relative group"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                              {item.variant.name}: {item.variant.value}
                            </p>
                          )}
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-lg bg-slate-200/80 dark:bg-slate-700/80 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-slate-600 dark:text-slate-300 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-slate-600 dark:text-slate-300 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary & Checkout CTA */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-slate-200/60 dark:border-white/10 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                  
                  {/* Promo code form */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo code (e.g. GLASS20)"
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 uppercase"
                      />
                    </div>
                    <GlassButton type="submit" variant="outline" size="sm">
                      Apply
                    </GlassButton>
                  </form>

                  {promoCode && (
                    <div className="flex items-center justify-between text-xs text-emerald-500 font-medium bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Promo "{promoCode}" applied (20% OFF)
                      </span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Summary Breakdown */}
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-500">
                        <span>Discount</span>
                        <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-semibold text-emerald-500">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-semibold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200/60 dark:border-white/10">
                      <span>Total</span>
                      <span className="text-blue-600 dark:text-blue-400">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <GlassButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      setIsCartOpen(false);
                      onProceedToCheckout();
                    }}
                    className="w-full justify-between"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
