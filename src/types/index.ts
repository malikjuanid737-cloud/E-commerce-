export type UserRole = 'customer';

export interface ShippingAddress {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  shippingAddresses: ShippingAddress[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Color", "Size", "Storage"
  value: string; // e.g. "Space Gray", "128GB", "XL"
  priceModifier?: number; // e.g. +50
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  stockQuantity: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: ProductVariant;
  imageUrl: string;
  stockQuantity: number;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: ProductVariant;
  imageUrl: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  changedAt: string;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}
