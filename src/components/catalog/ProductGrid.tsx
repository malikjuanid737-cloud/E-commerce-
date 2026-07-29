import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles, PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  onSelectProduct,
  onResetFilters
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="h-96 rounded-2xl bg-slate-200/50 dark:bg-slate-800/40 animate-pulse border border-slate-300/30 dark:border-white/5 p-4 flex flex-col justify-between"
          >
            <div className="w-full h-48 rounded-xl bg-slate-300/40 dark:bg-slate-700/40" />
            <div className="space-y-3 mt-4">
              <div className="h-4 w-3/4 bg-slate-300/40 dark:bg-slate-700/40 rounded" />
              <div className="h-3 w-1/2 bg-slate-300/40 dark:bg-slate-700/40 rounded" />
            </div>
            <div className="h-10 w-full bg-slate-300/40 dark:bg-slate-700/40 rounded-xl mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/60 dark:border-white/10 my-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No matching products found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          Try adjusting your search query or selecting a different category filter.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-md"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
};
