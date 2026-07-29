import React, { useState } from 'react';
import { Star, ShoppingBag, Truck, ShieldCheck, Check, Minus, Plus, AlertCircle } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { GlassModal } from '../ui/GlassModal';
import { GlassButton } from '../ui/GlassButton';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onBuyNow
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const unitPrice = product.price + (selectedVariant?.priceModifier || 0);
  const totalPrice = unitPrice * quantity;
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    showToast(`Added ${quantity}x "${product.name}" to cart`, 'success');
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-white/50 dark:border-white/10 shadow-lg">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isFeatured && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary">Featured Product</Badge>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-blue-500 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{product.category}</span>
              <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800 dark:text-amber-200">{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-2">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                ${totalPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ${(product.originalPrice * quantity).toFixed(2)}
                </span>
              )}
              {selectedVariant?.priceModifier ? (
                <span className="text-xs text-emerald-500 font-medium">
                  (+${selectedVariant.priceModifier} variant offset)
                </span>
              ) : null}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Variants Picker */}
            {product.variants.length > 0 && (
              <div className="mb-4 space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Variant:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {variant.name}: {variant.value}
                      {variant.priceModifier ? ` (+$${variant.priceModifier})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quantity:
              </label>
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-white/10 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-slate-500">
                {product.stockQuantity > 0 ? `${product.stockQuantity} items in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Free Insured Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2 Year Manufacturer Warranty</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/60 dark:border-white/10">
            <GlassButton
              variant="outline"
              size="lg"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="w-full"
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </>
              )}
            </GlassButton>

            <GlassButton
              variant="primary"
              size="lg"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="w-full"
            >
              Buy Now
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
