'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Zap,
  Menu,
  Search,
  ChevronDown,
  Check,
  Loader2,
  Eye,
  Star,
  CreditCard,
} from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore, type CartItem } from '@/store/cart-store';
import { useToast } from '@/hooks/use-toast';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string;
  colors: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
}

type View = 'shop' | 'checkout' | 'confirmation';

const CATEGORIES = ['All', 'Tops', 'Hoodies', 'Bottoms', 'Outerwear', 'Accessories'];

/* ------------------------------------------------------------------ */
/*  Embedded Product Data (works without database)                      */
/* ------------------------------------------------------------------ */

const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Essential Oversized Tee',
    description: 'Premium heavyweight cotton tee with a relaxed oversized fit. Perfect for layering or wearing solo. Pre-shrunk fabric with dropped shoulders for that effortless look.',
    price: 449, category: 'Tops', sizes: 'XS,S,M,L,XL,XXL', colors: 'Black,White,Cream,Olive',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop',
    inStock: true, featured: true,
  },
  {
    id: 'prod-2',
    name: 'Steeze Signature Hoodie',
    description: 'Our flagship hoodie crafted from 400gsm French terry. Features a kangaroo pocket, ribbed cuffs, and embroidered Steeze logo on the chest. Built to last.',
    price: 999, category: 'Hoodies', sizes: 'S,M,L,XL,XXL', colors: 'Black,Charcoal,Navy',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop',
    inStock: true, featured: true,
  },
  {
    id: 'prod-3',
    name: 'Wide Leg Cargo Pants',
    description: 'Relaxed wide-leg silhouette with functional cargo pockets. Adjustable drawstring waist and ankle cuffs. Made from durable ripstop cotton.',
    price: 899, category: 'Bottoms', sizes: 'S,M,L,XL', colors: 'Black,Khaki,Olive',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop',
    inStock: true, featured: true,
  },
  {
    id: 'prod-4',
    name: 'Minimalist Bomber Jacket',
    description: 'Lightweight bomber with a clean minimalist design. Water-resistant nylon shell, ribbed collar and cuffs, and interior pockets. Transition seamlessly between seasons.',
    price: 1499, category: 'Outerwear', sizes: 'S,M,L,XL', colors: 'Black,Dark Green',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop',
    inStock: true, featured: true,
  },
  {
    id: 'prod-5',
    name: 'Classic Fit Graphic Tee',
    description: 'Midweight cotton tee with original Steeze graphic print on the back. Regular fit with a crew neckline. A wardrobe staple with personality.',
    price: 399, category: 'Tops', sizes: 'XS,S,M,L,XL', colors: 'Black,White,Grey',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
  {
    id: 'prod-6',
    name: 'Relaxed Fit Joggers',
    description: 'Ultra-soft fleece joggers with a tapered leg. Elastic waistband with drawcord and side pockets. The ultimate comfort piece for everyday wear.',
    price: 749, category: 'Bottoms', sizes: 'S,M,L,XL,XXL', colors: 'Black,Charcoal,Navy',
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
  {
    id: 'prod-7',
    name: 'Heavyweight Crewneck',
    description: 'Thick 450gsm crewneck sweatshirt with a boxy fit. Features subtle embroidered logo and reinforced ribbing. Your go-to layering piece.',
    price: 849, category: 'Hoodies', sizes: 'S,M,L,XL', colors: 'Black,Cream,Grey',
    imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
  {
    id: 'prod-8',
    name: 'Utility Vest',
    description: 'Multi-pocket utility vest with adjustable straps. Lightweight and packable, perfect for adding an extra layer of style to any outfit.',
    price: 699, category: 'Outerwear', sizes: 'S,M,L,XL', colors: 'Black,Khaki',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
  {
    id: 'prod-9',
    name: 'Linen Blend Shirt',
    description: 'Breathable linen-cotton blend shirt with a relaxed camp collar. Perfect for warm days and easy evenings. Natural texture with a lived-in feel.',
    price: 649, category: 'Tops', sizes: 'S,M,L,XL', colors: 'White,Sand,Light Blue',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
  {
    id: 'prod-10',
    name: 'Structured Cap',
    description: 'Six-panel structured cap with curved brim. Adjustable snapback closure and embroidered Steeze logo. One size fits all.',
    price: 299, category: 'Accessories', sizes: 'One Size', colors: 'Black,White,Navy,Cream',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
  {
    id: 'prod-11',
    name: 'Puffer Gilet',
    description: 'Lightweight puffer gilet with recycled padding. Zip front with standing collar and side pockets. Ideal layering piece for transitional weather.',
    price: 1199, category: 'Outerwear', sizes: 'S,M,L,XL', colors: 'Black,Olive',
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
  {
    id: 'prod-12',
    name: 'Structured Tote Bag',
    description: 'Heavy-duty canvas tote with leather handles and interior pocket. Embossed Steeze logo. Spacious enough for daily essentials.',
    price: 449, category: 'Accessories', sizes: 'One Size', colors: 'Black,Natural,Cream',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=750&fit=crop',
    inStock: true, featured: false,
  },
];

const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Shipping',
    description: '3–5 business days',
    price: 49,
    icon: Truck,
  },
  {
    id: 'express',
    label: 'Express Shipping',
    description: '1–2 business days',
    price: 129,
    icon: Zap,
  },
];

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function SteezePage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [featuredProducts] = useState<Product[]>(() => PRODUCTS.filter((p) => p.featured));
  const [loading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addToCartSize, setAddToCartSize] = useState('');
  const [addToCartColor, setAddToCartColor] = useState('');

  // Checkout state
  const [view, setView] = useState<View>('shop');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paypalOrderCreated, setPaypalOrderCreated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form state
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingZip: '',
    shippingCountry: 'Sweden',
  });

  const { items, addItem, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } =
    useCartStore();
  const { toast } = useToast();
  const productsRef = useRef<HTMLDivElement>(null);

  /* ---- Filter products ---- */
  useEffect(() => {
    let filtered = PRODUCTS;
    if (activeCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    setFilteredProducts(filtered);
  }, [activeCategory, searchQuery]);

  /* ---- Add to cart handler ---- */
  const handleAddToCart = useCallback(
    (product: Product, size: string, color: string) => {
      if (!size || !color) {
        toast({ title: 'Please select size and color', variant: 'destructive' });
        return;
      }
      addItem({
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size,
        color,
      });
      toast({ title: `${product.name} added to cart` });
      setSelectedProduct(null);
    },
    [addItem, toast]
  );

  /* ---- Save order (called after PayPal approval) ---- */
  const saveOrder = async (paypalOrderId?: string) => {
    setSubmitting(true);
    try {
      // Generate a local order ID (no database needed)
      const newOrderId = 'STZ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      setOrderId(newOrderId);
      clearCart();
      setView('confirmation');
      toast({ title: 'Order placed successfully!' });

      // Optionally send order details via email (future enhancement)
      const shippingCost =
        shippingMethod === 'express'
          ? SHIPPING_OPTIONS[1].price
          : SHIPPING_OPTIONS[0].price;
      const total = getTotalPrice() + shippingCost;

      console.log('Order placed:', {
        orderId: newOrderId,
        paypalOrderId,
        customer: form.customerName,
        email: form.customerEmail,
        items: items,
        total,
      });
    } catch {
      toast({
        title: 'Order failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Validate checkout form ---- */
  const isFormValid = () => {
    return (
      form.customerName.trim() !== '' &&
      form.customerEmail.trim() !== '' &&
      form.customerPhone.trim() !== '' &&
      form.shippingAddress.trim() !== '' &&
      form.shippingCity.trim() !== '' &&
      form.shippingZip.trim() !== ''
    );
  };

  const formValid = isFormValid();

  const shippingCost =
    shippingMethod === 'express'
      ? SHIPPING_OPTIONS[1].price
      : SHIPPING_OPTIONS[0].price;

  /* ---- Render helpers ---- */

  function renderHeader() {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => {
              setView('shop');
              setMobileMenuOpen(false);
            }}
            className="text-2xl font-black tracking-[0.25em] uppercase"
          >
            STEEZE
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setView('shop');
                  productsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-sm tracking-wider uppercase transition-colors hover:text-primary ${
                  activeCategory === cat
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 rounded-full bg-secondary pl-9 text-sm"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                if (items.length > 0) setView('checkout');
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background p-0">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50 md:hidden"
            >
              <div className="space-y-1 px-4 py-3">
                {/* Mobile search */}
                <div className="relative mb-3 sm:hidden">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full bg-secondary pl-9 text-sm"
                  />
                </div>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setMobileMenuOpen(false);
                      setView('shop');
                      productsRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm tracking-wider uppercase transition-colors ${
                      activeCategory === cat
                        ? 'bg-secondary text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {items.length > 0 && (
                  <Button
                    className="mt-2 w-full"
                    onClick={() => {
                      setView('checkout');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Cart ({getTotalItems()})
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  }

  function renderHero() {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/80 to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="mb-4 text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground">
              New Season — New Drops
            </p>
            <h1 className="text-5xl font-black tracking-[0.15em] uppercase sm:text-6xl lg:text-8xl">
              STEEZE
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Premium streetwear for those who move different. Built on quality,
              driven by culture.
            </p>
            <Button
              size="lg"
              className="mt-8 rounded-full px-8 tracking-wider uppercase"
              onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>
    );
  }

  function renderFeatured() {
    if (featuredProducts.length === 0) return null;
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-wider uppercase sm:text-3xl">
            Featured Drops
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedProduct}
            />
          ))}
        </div>
      </section>
    );
  }

  function renderProductGrid() {
    return (
      <section ref={productsRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-wider uppercase sm:text-3xl">
            {activeCategory === 'All' ? 'All Products' : activeCategory}
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                className="rounded-full text-xs tracking-wider uppercase"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  function renderProductDetail() {
    if (!selectedProduct) return null;
    const sizes = selectedProduct.sizes.split(',');
    const colors = selectedProduct.colors.split(',');

    return (
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-left text-xl font-bold tracking-wider uppercase">
              {selectedProduct.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-bold">{selectedProduct.price} SEK</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {selectedProduct.description}
              </p>
              <Separator />

              {/* Size selector */}
              <div>
                <Label className="mb-2 block text-xs font-semibold tracking-wider uppercase">
                  Size
                </Label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={addToCartSize === size ? 'default' : 'outline'}
                      size="sm"
                      className="min-w-[3rem] rounded-md text-xs"
                      onClick={() => setAddToCartSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color selector */}
              <div>
                <Label className="mb-2 block text-xs font-semibold tracking-wider uppercase">
                  Color
                </Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant={addToCartColor === color ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-md text-xs"
                      onClick={() => setAddToCartColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="mt-2 w-full rounded-full tracking-wider uppercase"
                onClick={() =>
                  handleAddToCart(selectedProduct, addToCartSize, addToCartColor)
                }
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function renderCheckout() {
    if (items.length === 0) {
      return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold tracking-wider uppercase">
              Your Cart is Empty
            </h2>
            <p className="mb-6 text-muted-foreground">
              Discover our latest collection and find something you love.
            </p>
            <Button
              className="rounded-full tracking-wider uppercase"
              onClick={() => setView('shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold tracking-wider uppercase sm:text-3xl">
          Checkout
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Cart + Shipping + Payment */}
          <div className="space-y-8 lg:col-span-2">
            {/* Cart Items */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Your Items ({getTotalItems()})
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size} / {item.color}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold">
                            {item.price * item.quantity} SEK
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeItem(item.productId, item.size, item.color)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Shipping Method */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Shipping Method
              </h3>
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="space-y-3"
              >
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      shippingMethod === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value={option.id} />
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <p className="text-sm font-bold">{option.price} SEK</p>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Payment Method */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Payment Method
              </h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {/* Swish - Coming Soon */}
                <div
                  className="relative flex items-center gap-4 rounded-xl border border-border p-4 opacity-60"
                >
                  <RadioGroupItem value="swish" disabled />
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00b0f0]/10">
                    <span className="text-lg font-bold text-[#00b0f0]">S</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">Swish</p>
                      <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pay instantly with your phone number
                    </p>
                  </div>
                </div>

                {/* PayPal - Active */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <RadioGroupItem value="paypal" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070ba]/10">
                    <span className="text-lg font-bold text-[#0070ba]">P</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">PayPal</p>
                      <Badge className="bg-[#0070ba] text-white text-[10px]">Recommended</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pay securely with your PayPal account or card
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Shipping Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name" className="mb-1.5 block text-xs tracking-wider uppercase">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block text-xs tracking-wider uppercase">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm({ ...form, customerEmail: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-1.5 block text-xs tracking-wider uppercase">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+46 70 123 4567"
                    value={form.customerPhone}
                    onChange={(e) =>
                      setForm({ ...form, customerPhone: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address" className="mb-1.5 block text-xs tracking-wider uppercase">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Street name 12"
                    value={form.shippingAddress}
                    onChange={(e) =>
                      setForm({ ...form, shippingAddress: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="mb-1.5 block text-xs tracking-wider uppercase">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Stockholm"
                    value={form.shippingCity}
                    onChange={(e) =>
                      setForm({ ...form, shippingCity: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="zip" className="mb-1.5 block text-xs tracking-wider uppercase">
                    Postal Code
                  </Label>
                  <Input
                    id="zip"
                    placeholder="111 22"
                    value={form.shippingZip}
                    onChange={(e) =>
                      setForm({ ...form, shippingZip: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="mb-1.5 block text-xs tracking-wider uppercase">
                    Country
                  </Label>
                  <Select
                    value={form.shippingCountry}
                    onValueChange={(v) =>
                      setForm({ ...form, shippingCountry: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                      <SelectItem value="Norway">Norway</SelectItem>
                      <SelectItem value="Denmark">Denmark</SelectItem>
                      <SelectItem value="Finland">Finland</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Order Summary
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {item.price * item.quantity} SEK
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{getTotalPrice()} SEK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost} SEK</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{getTotalPrice() + shippingCost} SEK</span>
                </div>
              </div>

              {/* PayPal Buttons - real payment */}
              {paymentMethod === 'paypal' && (
                <div className="mt-4">
                  {!formValid ? (
                    <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        <CreditCard className="mr-1.5 inline-block h-4 w-4" />
                        Fill in your shipping details above to enable PayPal payment
                      </p>
                    </div>
                  ) : (
                    <PayPalButtons
                      style={{
                        layout: 'vertical',
                        color: 'white',
                        shape: 'pill',
                        label: 'paypal',
                        height: 45,
                      }}
                      disabled={submitting}
                      createOrder={(data, actions) => {
                        const total = getTotalPrice() + shippingCost;
                        setPaypalOrderCreated(true);
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                currency_code: 'SEK',
                                value: total.toFixed(2),
                                breakdown: {
                                  item_total: {
                                    currency_code: 'SEK',
                                    value: getTotalPrice().toFixed(2),
                                  },
                                  shipping: {
                                    currency_code: 'SEK',
                                    value: shippingCost.toFixed(2),
                                  },
                                },
                              },
                              description: `Steeze Order - ${items.length} item(s)`,
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (!actions.order) return;
                        try {
                          const details = await actions.order.capture();
                          if (details.status === 'COMPLETED') {
                            await saveOrder(data.orderID);
                          } else {
                            toast({
                              title: 'Payment not completed',
                              variant: 'destructive',
                            });
                          }
                        } catch {
                          toast({
                            title: 'Payment capture failed',
                            variant: 'destructive',
                          });
                        }
                      }}
                      onError={() => {
                        toast({
                          title: 'PayPal Error',
                          description: 'Something went wrong with the PayPal payment. Please try again.',
                          variant: 'destructive',
                        });
                        setPaypalOrderCreated(false);
                      }}
                      onCancel={() => {
                        toast({
                          title: 'Payment Cancelled',
                          description: 'You cancelled the PayPal payment.',
                        });
                        setPaypalOrderCreated(false);
                      }}
                    />
                  )}
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Securely processed by PayPal. Your card details are never stored.
                  </p>
                </div>
              )}

              <Button
                variant="ghost"
                className="mt-2 w-full text-xs text-muted-foreground"
                onClick={() => setView('shop')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderConfirmation() {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-wider uppercase">
            Order Confirmed
          </h2>
          <p className="mb-2 text-muted-foreground">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
          {orderId && (
            <p className="mb-6 text-sm text-muted-foreground">
              Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span>
            </p>
          )}
          <div className="mb-8 rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              A confirmation email will be sent to{' '}
              <span className="font-semibold text-foreground">{form.customerEmail}</span>
            </p>
          </div>
          <Button
            className="rounded-full tracking-wider uppercase"
            onClick={() => {
              setView('shop');
              setForm({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                shippingAddress: '',
                shippingCity: '',
                shippingZip: '',
                shippingCountry: 'Sweden',
              });
            }}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </section>
    );
  }

  function renderFooter() {
    return (
      <footer className="border-t border-border/50 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-3 text-lg font-black tracking-[0.2em] uppercase">
                STEEZE
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Premium streetwear for those who move different. Built on quality,
                driven by culture.
              </p>
            </div>
            <div>
              <h5 className="mb-3 text-xs font-semibold tracking-wider uppercase">
                Shop
              </h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tops</li>
                <li>Hoodies</li>
                <li>Bottoms</li>
                <li>Outerwear</li>
                <li>Accessories</li>
              </ul>
            </div>
            <div>
              <h5 className="mb-3 text-xs font-semibold tracking-wider uppercase">
                Help
              </h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Shipping Info</li>
                <li>Returns & Exchanges</li>
                <li>Size Guide</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h5 className="mb-3 text-xs font-semibold tracking-wider uppercase">
                Company
              </h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Sustainability</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Steeze. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  /* ---- Main render ---- */
  return (
    <PayPalScriptProvider
      options={{
        clientId: 'BTK7EXBUDQU7E',
        currency: 'SEK',
        intent: 'capture',
      }}
    >
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {renderHeader()}

        <main className="flex-1">
          {view === 'shop' && (
            <>
              {renderHero()}
              {renderFeatured()}
              {renderProductGrid()}
            </>
          )}
          {view === 'checkout' && renderCheckout()}
          {view === 'confirmation' && renderConfirmation()}
        </main>

        {renderProductDetail()}
        {renderFooter()}
      </div>
    </PayPalScriptProvider>
  );
}

/* ------------------------------------------------------------------ */
/*  Product Card Component                                             */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
}) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const sizes = product.sizes.split(',');
  const colors = product.colors.split(',');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
    });
    toast({ title: `${product.name} added to cart` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="sm"
            className="rounded-full text-xs tracking-wider uppercase"
            onClick={handleAdd}
          >
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Add
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full text-xs"
            onClick={() => onQuickView(product)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
        {product.featured && (
          <Badge className="absolute left-3 top-3 bg-primary text-background text-[10px] tracking-wider uppercase">
            Featured
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="mt-0.5 font-semibold tracking-wide">{product.name}</h3>
        <p className="mt-1 text-sm font-bold">{product.price} SEK</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {color}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}