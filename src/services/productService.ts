import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { SEED_PRODUCTS } from '../data/seedProducts';

const PRODUCTS_COLLECTION = 'products';

// Seed initial products if collection is empty
export const initializeSeedProducts = async (): Promise<Product[]> => {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      console.log('Seeding initial product catalog to Firestore...');
      const batch = writeBatch(db);
      const newProducts: Product[] = [];

      SEED_PRODUCTS.forEach((prodData) => {
        const newDocRef = doc(colRef);
        const product: Product = {
          ...prodData,
          id: newDocRef.id
        };
        batch.set(newDocRef, product);
        newProducts.push(product);
      });

      await batch.commit();
      return newProducts;
    }

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch (err) {
    console.error('Error seeding products:', err);
    // Return fallback local seed products if Firestore fails
    return SEED_PRODUCTS.map((p, index) => ({ id: `seed-${index}`, ...p }));
  }
};

// Subscribe to products list with real-time updates
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      const seeded = await initializeSeedProducts();
      callback(seeded);
    } else {
      const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      callback(products);
    }
  }, (err) => {
    console.error('Product subscription error:', err);
    // Fallback to initial seeds
    callback(SEED_PRODUCTS.map((p, i) => ({ id: `seed-${i}`, ...p })));
  });
};

// Admin: Add new product
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const now = new Date().toISOString();
  const docRef = await addDoc(colRef, {
    ...productData,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

// Admin: Update existing product
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// Admin: Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
};

// Reset products to initial seeds (convenience feature for testing)
export const resetToSeedProducts = async (): Promise<void> => {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(colRef);
  const batch = writeBatch(db);

  snapshot.docs.forEach((d) => {
    batch.delete(d.ref);
  });

  SEED_PRODUCTS.forEach((prodData) => {
    const newDocRef = doc(colRef);
    batch.set(newDocRef, {
      ...prodData,
      id: newDocRef.id
    });
  });

  await batch.commit();
};
