export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  sizes?: string[];
  colors?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Iconic Leather Jacket',
    price: 299,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    category: 'Outerwear',
    description: 'Premium leather jacket with a timeless design. Crafted from genuine leather with a silk lining.',
    isNew: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
  },
  {
    id: '2',
    name: 'Minimalist Watch',
    price: 189,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    category: 'Accessories',
    description: 'Elegant minimalist watch with Swiss movement. Stainless steel case with genuine leather strap.',
    isSale: true,
    colors: ['Silver', 'Gold', 'Rose Gold'],
  },
  {
    id: '3',
    name: 'Premium Sneakers',
    price: 159,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    category: 'Footwear',
    description: 'Handcrafted premium sneakers with memory foam insoles for all-day comfort.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Navy'],
  },
  {
    id: '4',
    name: 'Cashmere Sweater',
    price: 199,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600',
    category: 'Knitwear',
    description: '100% pure cashmere sweater. Incredibly soft and warm for the colder months.',
    isNew: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Gray', 'Navy', 'Burgundy'],
  },
  {
    id: '5',
    name: 'Designer Sunglasses',
    price: 129,
    originalPrice: 179,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
    category: 'Accessories',
    description: 'UV400 protection with polarized lenses. Acetate frame with titanium temples.',
    isSale: true,
    colors: ['Black', 'Tortoise', 'Clear'],
  },
  {
    id: '6',
    name: 'Silk Scarf',
    price: 89,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
    category: 'Accessories',
    description: 'Hand-rolled silk scarf with exclusive print. Made in Italy.',
    colors: ['Floral', 'Geometric', 'Abstract'],
  },
  {
    id: '7',
    name: 'Tailored Blazer',
    price: 349,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
    category: 'Outerwear',
    description: 'Impeccably tailored blazer in premium wool blend. Perfect for any occasion.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Charcoal', 'Black'],
  },
  {
    id: '8',
    name: 'Leather Tote Bag',
    price: 249,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    category: 'Bags',
    description: 'Spacious leather tote with laptop compartment. Full-grain leather with brass hardware.',
    isNew: true,
    colors: ['Tan', 'Black', 'Burgundy'],
  },
];

