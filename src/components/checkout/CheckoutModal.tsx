import React, { useState } from 'react';
import { 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { GlassModal } from '../ui/GlassModal';
import { GlassButton } from '../ui/GlassButton';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../services/orderService';
import { Order, ShippingAddress } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
  directBuyItem?: {
    product: any;
    variant?: any;
    quantity: number;
  } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderComplete,
  directBuyItem
}) => {
  const { cartItems, subtotal, discountAmount, total, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();

  // Step state: 1 = Shipping, 2 = Payment, 3 = Review
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    id: 'addr-1',
    label: 'Home',
    fullName: userProfile?.displayName || '',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: userProfile?.displayName || 'Jane Doe',
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888'
  });

  // Calculate items and total based on direct buy vs cart
  const checkoutItems = directBuyItem ? [
    {
      id: `${directBuyItem.product.id}-direct`,
      productId: directBuyItem.product.id,
      name: directBuyItem.product.name,
      price: directBuyItem.product.price + (directBuyItem.variant?.priceModifier || 0),
      quantity: directBuyItem.quantity,
      variant: directBuyItem.variant,
      imageUrl: directBuyItem.product.images[0] || '',
      stockQuantity: directBuyItem.product.stockQuantity
    }
  ] : cartItems;

  const checkoutSubtotal = directBuyItem 
    ? (directBuyItem.product.price + (directBuyItem.variant?.priceModifier || 0)) * directBuyItem.quantity
    : subtotal;

  const checkoutDiscount = directBuyItem ? 0 : discountAmount;
  const checkoutTotal = Math.max(0, checkoutSubtotal - checkoutDiscount);
  const tax = checkoutTotal * 0.08;
  const grandTotal = checkoutTotal + tax;

  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) return;
    setLoading(true);

    try {
      const order = await createOrder(
        currentUser?.uid || 'guest-user',
        currentUser?.email || 'customer@aura.com',
        shippingAddress.fullName || userProfile?.displayName || 'Customer',
        checkoutItems,
        checkoutSubtotal,
        checkoutDiscount,
        0, // shipping free
        tax,
        grandTotal,
        shippingAddress,
        'Stripe Encrypted Card'
      );

      if (!directBuyItem) {
        await clearCart();
      }

      showToast('Order placed successfully!', 'success');
      onOrderComplete(order);
      onClose();
    } catch (err: any) {
      console.error('Error creating order:', err);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              1
            </span>
            <span className={`text-xs font-semibold ${step === 1 ? 'text-blue-500' : 'text-slate-400'}`}>
              Shipping
            </span>
          </div>
          <div className="w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              2
            </span>
            <span className={`text-xs font-semibold ${step === 2 ? 'text-blue-500' : 'text-slate-400'}`}>
              Payment
            </span>
          </div>
          <div className="w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              3
            </span>
            <span className={`text-xs font-semibold ${step === 3 ? 'text-blue-500' : 'text-slate-400'}`}>
              Review
            </span>
          </div>
        </div>

        {/* STEP 1: Shipping Address Form */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" /> Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="123 Tech Boulevard, Apt 4B"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  placeholder="San Francisco"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">State / Province</label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  placeholder="CA"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Postal Code</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  placeholder="94107"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  placeholder="United States"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <GlassButton variant="primary" onClick={() => setStep(2)}>
                Continue to Payment <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" /> Payment Information
              </h3>
              <Badge variant="success" className="gap-1">
                <Lock className="w-3 h-3" /> 256-bit SSL Encrypted
              </Badge>
            </div>

            {/* Credit Card Graphic Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-800 text-white border border-white/20 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Aura Pass Card</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <p className="font-mono text-lg tracking-widest">{paymentInfo.cardNumber}</p>
              <div className="flex justify-between text-xs text-slate-300 pt-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</p>
                  <p className="font-semibold">{paymentInfo.cardholderName}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Expires</p>
                  <p className="font-semibold">{paymentInfo.expiry}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Name on Card</label>
                <input
                  type="text"
                  value={paymentInfo.cardholderName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={paymentInfo.expiry}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">CVV Code</label>
                <input
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                  placeholder="123"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <GlassButton variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </GlassButton>
              <GlassButton variant="primary" onClick={() => setStep(3)}>
                Review Order <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Place Order */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" /> Order Review
            </h3>

            {/* Address & Payment summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <div>
                <p className="font-bold text-slate-800 dark:text-white mb-0.5">Ship To:</p>
                <p className="text-slate-600 dark:text-slate-300">{shippingAddress.fullName}</p>
                <p className="text-slate-500">{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white mb-0.5">Payment Method:</p>
                <p className="text-slate-600 dark:text-slate-300">Stripe Encrypted Card (••4242)</p>
                <p className="text-emerald-500 font-medium">Verified Authorization</p>
              </div>
            </div>

            {/* Items summary */}
            <div className="max-h-44 overflow-y-auto space-y-2 border-y border-slate-200/60 dark:border-white/10 py-3">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} {item.variant ? `(${item.variant.value})` : ''}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total price calculation */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">${checkoutSubtotal.toFixed(2)}</span>
              </div>
              {checkoutDiscount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount</span>
                  <span className="font-semibold">-${checkoutDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200/60 dark:border-white/10">
                <span>Grand Total</span>
                <span className="text-blue-600 dark:text-blue-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-between">
              <GlassButton variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </GlassButton>
              <GlassButton
                variant="primary"
                size="lg"
                disabled={loading}
                onClick={handlePlaceOrder}
                className="gap-2"
              >
                {loading ? 'Processing Payment...' : `Confirm & Pay $${grandTotal.toFixed(2)}`}
              </GlassButton>
            </div>
          </div>
        )}

      </div>
    </GlassModal>
  );
};
