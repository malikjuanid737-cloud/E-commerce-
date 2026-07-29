import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus, ShippingAddress, CartItem } from '../types';
import { updateProduct } from './productService';

const ORDERS_COLLECTION = 'orders';

// Place new order
export const createOrder = async (
  userId: string,
  customerEmail: string,
  customerName: string,
  items: CartItem[],
  subtotal: number,
  discount: number,
  shippingCost: number,
  tax: number,
  total: number,
  shippingAddress: ShippingAddress,
  paymentMethod: string = 'Credit Card'
): Promise<Order> => {
  const colRef = collection(db, ORDERS_COLLECTION);
  const now = new Date().toISOString();
  
  // Format items
  const orderItems = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    variant: item.variant || undefined,
    imageUrl: item.imageUrl
  }));

  // Generate tracking number
  const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Calculate delivery estimate (5 business days)
  const delivDate = new Date();
  delivDate.setDate(delivDate.getDate() + 5);
  const estimatedDelivery = delivDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const newOrderData: Omit<Order, 'id'> = {
    userId,
    customerEmail,
    customerName,
    status: 'paid', // Instant confirmation upon successful checkout
    items: orderItems,
    subtotal,
    discount,
    shippingCost,
    tax,
    total,
    shippingAddress,
    paymentMethod,
    paymentStatus: 'paid',
    trackingNumber,
    estimatedDelivery,
    statusHistory: [
      { status: 'pending_payment', changedAt: now, note: 'Order placed by customer' },
      { status: 'paid', changedAt: now, note: 'Payment successfully processed' }
    ],
    createdAt: now,
    updatedAt: now
  };

  const docRef = await addDoc(colRef, newOrderData);
  
  // Update stock quantities for ordered items
  for (const item of items) {
    try {
      const prodRef = doc(db, 'products', item.productId);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const currentStock = prodSnap.data().stockQuantity || 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        await updateProduct(item.productId, { stockQuantity: newStock });
      }
    } catch (e) {
      console.warn('Stock update skipped or failed:', e);
    }
  }

  return { id: docRef.id, ...newOrderData };
};

// Subscribe to user's orders (customer view)
export const subscribeToUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const colRef = collection(db, ORDERS_COLLECTION);
  const q = query(colRef, where('userId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    // Sort client-side by createdAt descending
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(orders);
  }, (err) => {
    console.error('User orders subscription error:', err);
    callback([]);
  });
};

// Subscribe to ALL orders (admin view)
export const subscribeToAllOrders = (callback: (orders: Order[]) => void) => {
  const colRef = collection(db, ORDERS_COLLECTION);
  
  return onSnapshot(colRef, (snapshot) => {
    const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(orders);
  }, (err) => {
    console.error('All orders subscription error:', err);
    callback([]);
  });
};

// Admin: Update order status
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: OrderStatus, 
  note?: string
): Promise<void> => {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return;
  const currentOrder = docSnap.data() as Order;
  const now = new Date().toISOString();

  const newHistoryEntry = {
    status: newStatus,
    changedAt: now,
    note: note || `Status updated to ${newStatus}`
  };

  const updatedHistory = [...(currentOrder.statusHistory || []), newHistoryEntry];

  await updateDoc(docRef, {
    status: newStatus,
    statusHistory: updatedHistory,
    updatedAt: now
  });
};
