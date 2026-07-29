import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-20 px-4 sm:px-8 pb-8 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 p-8 sm:p-12 shadow-lg">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-200/60 dark:border-white/10 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Express Delivery</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Insured global shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Secure Payments</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Encrypted Firebase & Stripe checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">30-Day Returns</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Real-Time Sync</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live order status via Firestore</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">AuraGlass Store</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Next-generation glassmorphic e-commerce storefront powered by Firebase Auth, Firestore real-time data persistence, and React 19.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Products</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Audio & Headphones</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">OLED Displays & Monitors</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Aerospace Smartwatches</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Mechanical Keyboards</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Architecture</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-500 dark:text-slate-400">Firebase Firestore Real-time</span></li>
              <li><span className="text-slate-500 dark:text-slate-400">Google Auth & Password Auth</span></li>
              <li><span className="text-slate-500 dark:text-slate-400">Glassmorphism UI Engine</span></li>
              <li><span className="text-slate-500 dark:text-slate-400">Admin Role-Based Control</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Newsletter</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Subscribe for product drops & promo code (Try "GLASS20").</p>
            <div className="flex items-center gap-2">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-slate-100"
              />
              <button className="px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 dark:border-white/10 pt-6 gap-4">
          <p>© 2026 AuraGlass Storefront. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
