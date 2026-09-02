import { NextResponse } from 'next/server';

// Static product data — no database needed on Vercel
const PRODUCTS = [
  { id: 'prod-1', name: 'Essential Oversized Tee', price: 449, category: 'Tops', inStock: true, featured: true },
  { id: 'prod-2', name: 'Steeze Signature Hoodie', price: 999, category: 'Hoodies', inStock: true, featured: true },
  { id: 'prod-3', name: 'Wide Leg Cargo Pants', price: 899, category: 'Bottoms', inStock: true, featured: true },
  { id: 'prod-4', name: 'Minimalist Bomber Jacket', price: 1499, category: 'Outerwear', inStock: true, featured: true },
  { id: 'prod-5', name: 'Classic Fit Graphic Tee', price: 399, category: 'Tops', inStock: true, featured: false },
  { id: 'prod-6', name: 'Relaxed Fit Joggers', price: 749, category: 'Bottoms', inStock: true, featured: false },
  { id: 'prod-7', name: 'Heavyweight Crewneck', price: 849, category: 'Hoodies', inStock: true, featured: false },
  { id: 'prod-8', name: 'Utility Vest', price: 699, category: 'Outerwear', inStock: true, featured: false },
  { id: 'prod-9', name: 'Linen Blend Shirt', price: 649, category: 'Tops', inStock: true, featured: false },
  { id: 'prod-10', name: 'Structured Cap', price: 299, category: 'Accessories', inStock: true, featured: false },
  { id: 'prod-11', name: 'Puffer Gilet', price: 1199, category: 'Outerwear', inStock: true, featured: false },
  { id: 'prod-12', name: 'Structured Tote Bag', price: 449, category: 'Accessories', inStock: true, featured: false },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  let filtered = PRODUCTS;
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (featured === 'true') {
    filtered = filtered.filter((p) => p.featured);
  }

  return NextResponse.json(filtered);
}
