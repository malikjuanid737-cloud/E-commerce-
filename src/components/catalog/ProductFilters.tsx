import React from 'react';
import { CATEGORIES } from '../../data/seedProducts';
import { 
  Grid, 
  Tv, 
  Headphones, 
  Watch, 
  Keyboard, 
  Lamp, 
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle
} from 'lucide-react';

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  totalProductsCount: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Grid: <Grid className="w-4 h-4" />,
  Tv: <Tv className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Watch: <Watch className="w-4 h-4" />,
  Keyboard: <Keyboard className="w-4 h-4" />,
  Lamp: <Lamp className="w-4 h-4" />
};

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  totalProductsCount
}) => {
  return (
    <div className="space-y-4 mb-8">
      
      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200
                backdrop-blur-md border shadow-sm
                ${isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white/60 dark:bg-slate-900/60 border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-800/80'
                }
              `}
            >
              {CATEGORY_ICONS[cat.icon] || <Grid className="w-4 h-4" />}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sorting & Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-xs">
        
        {/* Count Label */}
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          <span>Showing <strong className="text-slate-900 dark:text-white font-bold">{totalProductsCount}</strong> products</span>
        </div>

        {/* Controls right */}
        <div className="flex items-center gap-3">
          
          {/* In stock toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span className="font-medium">In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="dark:bg-slate-900">Featured First</option>
              <option value="price-asc" className="dark:bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="dark:bg-slate-900">Price: High to Low</option>
              <option value="rating" className="dark:bg-slate-900">Highest Rated</option>
              <option value="newest" className="dark:bg-slate-900">Newest Arrivals</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};
