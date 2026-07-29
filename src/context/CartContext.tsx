import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, collection, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = 'glass_ecom_guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Load guest cart from localStorage or Firestore cart for authenticated users
  useEffect(() => {
    if (!currentUser) {
      // Unauthenticated: load local cart
      const localData = localStorage.getItem(LOCAL_CART_KEY);
      if (localData) {
        try {
          setCartItems(JSON.parse(localData));
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
      return;
    }

    // Authenticated: Listen to Firestore cart collection
    const cartColRef = collection(db, 'users', currentUser.uid, 'cart');
    
    // Check if we have guest items to merge on login
    const localData = localStorage.getItem(LOCAL_CART_KEY);
    if (localData) {
      try {
        const guestItems: CartItem[] = JSON.parse(localData);
        if (guestItems.length > 0) {
          // Merge to Firestore
          guestItems.forEach(async (item) => {
            const itemRef = doc(db, 'users', currentUser.uid, 'cart', item.id);
            await setDoc(itemRef, item, { merge: true });
          });
          localStorage.removeItem(LOCAL_CART_KEY);
        }
      } catch (err) {
        console.error("Error merging guest cart:", err);
      }
    }

    const unsubscribe = onSnapshot(cartColRef, (snapshot) => {
      const items: CartItem[] = snapshot.docs.map((doc) => doc.data() as CartItem);
      setCartItems(items);
    }, (err) => {
      console.error("Cart subscription error:", err);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Persist guest cart locally when unauthenticated
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  const addToCart = async (product: Product, variant?: ProductVariant, quantity = 1) => {
    const variantId = variant ? `${variant.id}-${variant.value}` : 'default';
    const cartItemId = `${product.id}-${variantId}`;
    const unitPrice = product.price + (variant?.priceModifier || 0);

    const existingIndex = cartItems.findIndex((item) => item.id === cartItemId);
    let updatedItems: CartItem[] = [...cartItems];

    if (existingIndex > -1) {
      const current = updatedItems[existingIndex];
      const newQty = current.quantity + quantity;
      updatedItems[existingIndex] = { ...current, quantity: newQty };
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: quantity,
        variant,
        imageUrl: product.images[0] || '',
        stockQuantity: product.stockQuantity
      };
      updatedItems.push(newItem);
    }

    setCartItems(updatedItems);
    setIsCartOpen(true);

    if (currentUser) {
      const targetItem = updatedItems.find((item) => item.id === cartItemId)!;
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', cartItemId);
      await setDoc(itemRef, targetItem);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const updated = cartItems.filter((i) => i.id !== cartItemId);
    setCartItems(updated);

    if (currentUser) {
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', cartItemId);
      await deleteDoc(itemRef);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    const updated = cartItems.map((item) => 
      item.id === cartItemId ? { ...item, quantity } : item
    );
    setCartItems(updated);

    if (currentUser) {
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', cartItemId);
      await setDoc(itemRef, { quantity }, { merge: true });
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (!currentUser) {
      localStorage.removeItem(LOCAL_CART_KEY);
    } else {
      const batch = writeBatch(db);
      cartItems.forEach((item) => {
        const itemRef = doc(db, 'users', currentUser.uid, 'cart', item.id);
        batch.delete(itemRef);
      });
      await batch.commit();
    }
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GLASS20' || cleanCode === 'PROMO20') {
      setPromoCode(cleanCode);
      setDiscountPercentage(20);
      return true;
    } else if (cleanCode === 'WELCOME10') {
      setPromoCode(cleanCode);
      setDiscountPercentage(10);
      return true;
    }
    return false;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      subtotal,
      promoCode,
      applyPromoCode,
      discountPercentage,
      discountAmount,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
