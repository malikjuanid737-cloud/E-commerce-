import React, { useEffect, useState } from 'react';
import { PackageCheck, ArrowUpRight, Calendar, Truck, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeToUserOrders } from '../../services/orderService';
import { Order } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { GlassButton } from '../ui/GlassButton';
import { OrderTrackingModal } from './OrderTrackingModal';

export const OrderHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserOrders(currentUser.uid, (userOrders) => {
      setOrders(userOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <GlassCard className="p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to view your order history</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your orders and live tracking updates are securely associated with your account.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <PackageCheck className="w-7 h-7 text-blue-500" /> My Orders & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time status updates synced live via Firestore.
          </p>
        </div>
        <Badge variant="primary" className="text-xs">
          {orders.length} Total Orders
        </Badge>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-slate-200/50 dark:bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <PackageCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our store catalog, add products to your cart, and place an order to test real-time tracking!
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <GlassCard key={order.id} className="p-5 sm:p-6 space-y-4">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/10 text-xs">
                <div className="flex items-center gap-3">
                  <Badge variant={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'shipped' ? 'secondary' :
                    order.status === 'cancelled' ? 'danger' : 'info'
                  }>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="font-mono text-slate-500">ID: {order.id.substring(0, 10)}...</span>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-100/60 dark:bg-slate-800/40 p-1.5 rounded-xl border border-slate-200/40 dark:border-white/5 shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div className="text-[11px] max-w-[120px]">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                        <p className="text-slate-400 font-mono">${item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-xs font-semibold text-slate-400">+{order.items.length - 4} more</span>
                  )}
                </div>

                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  className="gap-1.5 shrink-0"
                >
                  <Truck className="w-4 h-4 text-cyan-400" /> Track Package <ArrowUpRight className="w-3.5 h-3.5" />
                </GlassButton>
              </div>

            </GlassCard>
          ))}
        </div>
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};
