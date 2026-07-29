import { Product } from '../types';

export const SEED_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Aura Sound Pro Noise-Canceling Headphones',
    description: 'Immersive spatial audio headphones with active hybrid noise cancellation, 40-hour battery life, and plush memory foam glassmorphic earcups.',
    price: 299.99,
    originalPrice: 349.99,
    currency: 'USD',
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v1', name: 'Color', value: 'Matte Onyx', priceModifier: 0 },
      { id: 'v2', name: 'Color', value: 'Frosted Silver', priceModifier: 0 },
      { id: 'v3', name: 'Color', value: 'Cyber Cyan', priceModifier: 15 }
    ],
    stockQuantity: 45,
    isActive: true,
    rating: 4.9,
    reviewCount: 128,
    tags: ['Best Seller', 'Wireless', 'Noise Canceling'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Lumina Vision Curved OLED Monitor 34"',
    description: 'Ultra-wide 175Hz 0.03ms gaming & productivity monitor with quantum dot technology, HDR1000, and ambient lighting.',
    price: 899.00,
    originalPrice: 999.00,
    currency: 'USD',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v4', name: 'Refresh Rate', value: '175Hz Stand', priceModifier: 0 },
      { id: 'v5', name: 'Refresh Rate', value: '240Hz Pro Arm', priceModifier: 120 }
    ],
    stockQuantity: 18,
    isActive: true,
    rating: 4.8,
    reviewCount: 94,
    tags: ['Gaming', 'OLED', '4K'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Nebula Horizon Smartwatch Ultra',
    description: 'Titanium aerospace-grade smartwatch with dual-frequency GPS, biometric health tracking, ECG monitoring, and 7-day battery.',
    price: 379.50,
    originalPrice: 429.00,
    currency: 'USD',
    category: 'Wearables',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v6', name: 'Strap', value: 'Midnight Ocean Band', priceModifier: 0 },
      { id: 'v7', name: 'Strap', value: 'Titanium Link Bracelet', priceModifier: 50 }
    ],
    stockQuantity: 32,
    isActive: true,
    rating: 4.7,
    reviewCount: 86,
    tags: ['Fitness', 'GPS', 'Waterproof'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Zenith Mechanical Wireless Keyboard',
    description: 'Custom hot-swappable RGB mechanical keyboard featuring lubricated tactile switches, sound-dampening foam, and a clear acrylic chassis.',
    price: 159.99,
    originalPrice: 189.99,
    currency: 'USD',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v8', name: 'Switch Type', value: 'Tactile Purple', priceModifier: 0 },
      { id: 'v9', name: 'Switch Type', value: 'Linear Silent Blue', priceModifier: 10 }
    ],
    stockQuantity: 50,
    isActive: true,
    rating: 4.9,
    reviewCount: 210,
    tags: ['Mechanical', 'RGB', 'Wireless'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Pulse Go Portable Speaker',
    description: '360-degree high fidelity waterproof Bluetooth speaker with dynamic LED pulse visualizer and 24-hour play time.',
    price: 119.00,
    originalPrice: 149.00,
    currency: 'USD',
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v10', name: 'Color', value: 'Neon Pulse', priceModifier: 0 },
      { id: 'v11', name: 'Color', value: 'Graphite Black', priceModifier: 0 }
    ],
    stockQuantity: 60,
    isActive: true,
    rating: 4.6,
    reviewCount: 75,
    tags: ['Portable', 'IP67', 'Bass Boost'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Optima Mirrorless Digital Camera 4K',
    description: 'Compact full-frame mirrorless camera with 33MP sensor, AI subject tracking auto-focus, and cinematic 4K 60fps video capability.',
    price: 1399.00,
    originalPrice: 1599.00,
    currency: 'USD',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v12', name: 'Kit', value: 'Body Only', priceModifier: 0 },
      { id: 'v13', name: 'Kit', value: '24-70mm f/2.8 Lens Kit', priceModifier: 600 }
    ],
    stockQuantity: 12,
    isActive: true,
    rating: 4.95,
    reviewCount: 64,
    tags: ['Photography', '4K Video', 'Professional'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Solace Smart Ambient Lamp',
    description: 'App-controlled minimalist desk lamp with circadian lighting support, wireless smartphone fast-charging base, and touch slider controls.',
    price: 89.00,
    originalPrice: 109.00,
    currency: 'USD',
    category: 'Smart Home',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v14', name: 'Finish', value: 'Brushed Brass', priceModifier: 0 },
      { id: 'v15', name: 'Finish', value: 'Matte White', priceModifier: 0 }
    ],
    stockQuantity: 3, // Low stock for testing low stock badge!
    isActive: true,
    rating: 4.5,
    reviewCount: 42,
    tags: ['Smart Home', 'Wireless Charging', 'Minimal'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Vortex Precision Gaming Mouse',
    description: 'Ergonomic 49g ultra-lightweight gaming mouse with 30K optical sensor, optical switches, and zero-friction PTFE skates.',
    price: 79.99,
    originalPrice: 99.99,
    currency: 'USD',
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'v16', name: 'Color', value: 'Chrono White', priceModifier: 0 },
      { id: 'v17', name: 'Color', value: 'Stealth Black', priceModifier: 0 }
    ],
    stockQuantity: 40,
    isActive: true,
    rating: 4.8,
    reviewCount: 153,
    tags: ['Gaming', 'Ultra-light', 'Wireless'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'Grid', description: 'Explore our full catalog' },
  { id: 'Electronics', name: 'Electronics', icon: 'Tv', description: 'Monitors, cameras & display tech' },
  { id: 'Audio', name: 'Audio', icon: 'Headphones', description: 'Headphones, speakers & earbuds' },
  { id: 'Wearables', name: 'Wearables', icon: 'Watch', description: 'Smartwatches & fitness trackers' },
  { id: 'Accessories', name: 'Accessories', icon: 'Keyboard', description: 'Keyboards, mice & desk accessories' },
  { id: 'Smart Home', name: 'Smart Home', icon: 'Lamp', description: 'Lighting & smart home devices' }
];
