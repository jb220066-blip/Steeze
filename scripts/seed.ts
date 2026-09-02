import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Essential Oversized Tee',
    description: 'Premium heavyweight cotton tee with a relaxed oversized fit. Perfect for layering or wearing solo. Pre-shrunk fabric with dropped shoulders for that effortless look.',
    price: 449,
    category: 'Tops',
    sizes: 'XS,S,M,L,XL,XXL',
    colors: 'Black,White,Cream,Olive',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    name: 'Steeze Signature Hoodie',
    description: 'Our flagship hoodie crafted from 400gsm French terry. Features a kangaroo pocket, ribbed cuffs, and embroidered Steeze logo on the chest. Built to last.',
    price: 999,
    category: 'Hoodies',
    sizes: 'S,M,L,XL,XXL',
    colors: 'Black,Charcoal,Navy',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    name: 'Wide Leg Cargo Pants',
    description: 'Relaxed wide-leg silhouette with functional cargo pockets. Adjustable drawstring waist and ankle cuffs. Made from durable ripstop cotton.',
    price: 899,
    category: 'Bottoms',
    sizes: 'S,M,L,XL',
    colors: 'Black,Khaki,Olive',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    name: 'Minimalist Bomber Jacket',
    description: 'Lightweight bomber with a clean minimalist design. Water-resistant nylon shell, ribbed collar and cuffs, and interior pockets. Transition seamlessly between seasons.',
    price: 1499,
    category: 'Outerwear',
    sizes: 'S,M,L,XL',
    colors: 'Black,Dark Green',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop',
    inStock: true,
    featured: true,
  },
  {
    name: 'Classic Fit Graphic Tee',
    description: 'Midweight cotton tee with original Steeze graphic print on the back. Regular fit with a crew neckline. A wardrobe staple with personality.',
    price: 399,
    category: 'Tops',
    sizes: 'XS,S,M,L,XL',
    colors: 'Black,White,Grey',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    name: 'Relaxed Fit Joggers',
    description: 'Ultra-soft fleece joggers with a tapered leg. Elastic waistband with drawcord and side pockets. The ultimate comfort piece for everyday wear.',
    price: 749,
    category: 'Bottoms',
    sizes: 'S,M,L,XL,XXL',
    colors: 'Black,Charcoal,Navy',
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    name: 'Heavyweight Crewneck',
    description: 'Thick 450gsm crewneck sweatshirt with a boxy fit. Features subtle embroidered logo and reinforced ribbing. Your go-to layering piece.',
    price: 849,
    category: 'Hoodies',
    sizes: 'S,M,L,XL',
    colors: 'Black,Cream,Grey',
    imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    name: 'Utility Vest',
    description: 'Multi-pocket utility vest with adjustable straps. Lightweight and packable, perfect for adding an extra layer of style to any outfit.',
    price: 699,
    category: 'Outerwear',
    sizes: 'S,M,L,XL',
    colors: 'Black,Khaki',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    name: 'Linen Blend Shirt',
    description: 'Breathable linen-cotton blend shirt with a relaxed camp collar. Perfect for warm days and easy evenings. Natural texture with a lived-in feel.',
    price: 649,
    category: 'Tops',
    sizes: 'S,M,L,XL',
    colors: 'White,Sand,Light Blue',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    name: 'Structured Cap',
    description: 'Six-panel structured cap with curved brim. Adjustable snapback closure and embroidered Steeze logo. One size fits all.',
    price: 299,
    category: 'Accessories',
    sizes: 'One Size',
    colors: 'Black,White,Navy,Cream',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    name: 'Puffer Gilet',
    description: 'Lightweight puffer gilet with recycled padding. Zip front with standing collar and side pockets. Ideal layering piece for transitional weather.',
    price: 1199,
    category: 'Outerwear',
    sizes: 'S,M,L,XL',
    colors: 'Black,Olive',
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
  {
    name: 'Structured Tote Bag',
    description: 'Heavy-duty canvas tote with leather handles and interior pocket. Embossed Steeze logo. Spacious enough for daily essentials.',
    price: 449,
    category: 'Accessories',
    sizes: 'One Size',
    colors: 'Black,Natural,Cream',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=750&fit=crop',
    inStock: true,
    featured: false,
  },
];

async function main() {
  console.log('Seeding products...');
  
  await prisma.product.deleteMany();
  
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  
  console.log(`Seeded ${products.length} products successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
