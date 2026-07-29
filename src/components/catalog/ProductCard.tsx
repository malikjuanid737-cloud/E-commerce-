import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    setIsAdded(true);
    showToast(`Added "${product.name}" to cart`, 'success');

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <GlassCard 
      hoverEffect 
      className="group relative flex flex-col justify-between overflow-hidden cursor-pointer p-4 h-full"
      onClick={() => onSelectProduct(product)}
    >
      {/* Top Image Box */}
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 mb-4">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges on top of image */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <Badge variant="danger">-{discountPercent}% OFF</Badge>
            )}
            {product.isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            {isOutOfStock ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="warning">{product.stockQuantity} Left</Badge>
            ) : (
              <Badge variant="success">In Stock</Badge>
            )}
          </div>

          {/* Quick View overlay hover button */}
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-800 dark:text-white shadow-lg backdrop-blur-md">
              <Eye className="w-4 h-4 text-blue-500" /> Quick View
            </span>
          </div>
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="font-medium text-cyan-600 dark:text-cyan-400">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-500 transition-colors">
          {product.name}
        </h3>

        {/* Variants Preview if present */}
        {product.variants.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3" onClick={(e) => e.stopPropagation()}>
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`px-2 py-0.5 text-[11px] rounded-md font-medium border transition-all ${
                  selectedVariant?.id === v.id
                    ? 'bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-300'
                    : 'bg-slate-100/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                {v.value}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Price & Add Button */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2 mt-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              ${(product.price + (selectedVariant?.priceModifier || 0)).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <GlassButton
          variant={isAdded ? 'secondary' : 'primary'}
          size="sm"
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          className="shrink-0"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add
            </>
          )}
        </GlassButton>
      </div>
    </GlassCard>
  );
};
