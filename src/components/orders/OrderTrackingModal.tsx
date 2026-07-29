import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  CheckCheck, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  Hash,
  ExternalLink
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { GlassModal } from '../ui/GlassModal';
import { Badge } from '../ui/Badge';
import { GlassButton } from '../ui/GlassButton';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'paid', label: 'Payment Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
  { status: 'processing', label: 'Processing Order', icon: <Package className="w-4 h-4" /> },
  { status: 'shipped', label: 'In Transit / Shipped', icon: <Truck className="w-4 h-4" /> },
  { status: 'delivered', label: 'Delivered', icon: <CheckCheck className="w-4 h-4" /> }
];

const getStatusStepIndex = (status: OrderStatus): number => {
  switch (status) {
    case 'pending_payment': return 0;
    case 'paid': return 1;
    case 'processing': return 2;
    case 'shipped': return 3;
    case 'delivered': return 4;
    case 'cancelled': return -1;
    default: return 1;
  }
};

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!order) return null;

  const currentStepIndex = getStatusStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order Tracking</h3>
              <Badge variant={
                order.status === 'delivered' ? 'success' :
                order.status === 'shipped' ? 'secondary' :
                order.status === 'cancelled' ? 'danger' : 'info'
              }>
                {order.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-blue-500" /> ID: {order.id}
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <Calendar className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Tracking Number</span>
            <span className="font-mono text-sm font-bold text-blue-600 dark:text-cyan-400">
              {order.trackingNumber || 'TRK-982341'}
            </span>
          </div>
        </div>

        {/* Live Progress Timeline Bar */}
        {!isCancelled ? (
          <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span>Fulfillment Lifecycle</span>
              <span className="text-cyan-600 dark:text-cyan-400">Est. Delivery: {order.estimatedDelivery || '3-5 Business Days'}</span>
            </div>

            <div className="relative flex items-center justify-between">
              {/* Line background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
              {/* Line active fill */}
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIndex - 1) / 3) * 100}%` }}
              />

              {/* Step Nodes */}
              {STATUS_STEPS.map((stepItem, idx) => {
                const stepNum = idx + 1;
                const isPassed = currentStepIndex >= stepNum;
                const isCurrent = currentStepIndex === stepNum;

                return (
                  <div key={stepItem.status} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-white/10'
                      } ${isCurrent ? 'ring-4 ring-cyan-500/30 scale-110' : ''}`}
                    >
                      {stepItem.icon}
                    </div>
                    <span className={`text-[11px] font-medium mt-2 text-center max-w-[80px] leading-tight ${
                      isPassed ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'
                    }`}>
                      {stepItem.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>This order was cancelled. If you have questions, please contact support.</p>
          </div>
        )}

        {/* Detailed Status Logs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Real-Time Audit History
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {order.statusHistory?.map((log, index) => (
              <div
                key={index}
                className="flex items-start justify-between text-xs p-2.5 rounded-xl bg-slate-100/40 dark:bg-slate-800/30 border border-slate-200/40 dark:border-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{log.status.replace('_', ' ')}</span>
                    {log.note && <p className="text-[11px] text-slate-500">{log.note}</p>}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
                  {new Date(log.changedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ordered Items ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    {item.variant && <p className="text-[11px] text-cyan-500">{item.variant.name}: {item.variant.value}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-slate-200">${item.price.toFixed(2)} x {item.quantity}</p>
                  <p className="text-[11px] text-slate-400">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs pt-2">
          <div className="text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.country}</span>
          </div>
          <GlassButton variant="outline" size="sm" onClick={onClose}>
            Close Tracker
          </GlassButton>
        </div>

      </div>
    </GlassModal>
  );
};
