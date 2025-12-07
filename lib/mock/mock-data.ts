import Mock from 'mockjs';
import { Cart, Collection, Menu, Page, Product, ProductVariant, ProductOption } from './types';

// 产品分类配置
const CATEGORIES = [
  { handle: 'clothing', title: 'Clothing', tags: ['tshirt', 'hoodie', 'apparel', 'clothing'] },
  { handle: 'accessories', title: 'Accessories', tags: ['bag', 'hat', 'accessories'] },
  { handle: 'drinkware', title: 'Drinkware', tags: ['cup', 'mug', 'drinkware'] },
  { handle: 'footwear', title: 'Footwear', tags: ['shoes', 'sneakers', 'footwear'] }
];

// 产品图片池
const PRODUCT_IMAGES = {
  clothing: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'
  ],
  drinkware: [
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=800&q=80'
  ],
  footwear: [
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80'
  ]
};

// 生成产品变体
function generateVariants(productId: number, hasVariants: boolean): ProductVariant[] {
  if (!hasVariants) {
    return [{
      id: `gid://variant/${productId}`,
      title: 'Default',
      availableForSale: true,
      selectedOptions: [{ name: 'Title', value: 'Default' }],
      price: { amount: Mock.Random.float(10, 100, 2, 2).toFixed(2), currencyCode: 'USD' }
    }];
  }

  const colors = ['Black', 'White', 'Gray', 'Navy'];
  const sizes = ['S', 'M', 'L', 'XL'];
  const variants: ProductVariant[] = [];

  for (let i = 0; i < Mock.Random.integer(2, 4); i++) {
    const color = Mock.Random.pick(colors);
    const size = Mock.Random.pick(sizes);
    variants.push({
      id: `gid://variant/${productId}-${color.toLowerCase()}-${size.toLowerCase()}`,
      title: `${color} / ${size}`,
      availableForSale: Mock.Random.boolean(),
      selectedOptions: [{ name: 'Color', value: color }, { name: 'Size', value: size }],
      price: { amount: Mock.Random.float(20, 80, 2, 2).toFixed(2), currencyCode: 'USD' }
    });
  }

  return variants;
}

// 生成产品数据
function generateProducts(count: number = 20): Product[] {
  const products: Product[] = [];

  for (let i = 1; i <= count; i++) {
    const category = Mock.Random.pick(CATEGORIES);
    const hasVariants = Mock.Random.boolean();
    const productName = `${Mock.Random.word(3, 8)} ${category.title.slice(0, -1)}`;
    const handle = productName.toLowerCase().replace(/\s+/g, '-');
    const imageCategory = category.handle as keyof typeof PRODUCT_IMAGES;
    const imagePool = PRODUCT_IMAGES[imageCategory] || PRODUCT_IMAGES.clothing;
    const mainImage = Mock.Random.pick(imagePool);
    
    const variants = generateVariants(i, hasVariants);
    const prices = variants.map(v => parseFloat(v.price.amount));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const product: Product = {
      id: `gid://product/${i}`,
      handle,
      title: productName,
      description: Mock.Random.sentence(10, 20),
      descriptionHtml: `<p>${Mock.Random.sentence(10, 20)}</p>`,
      availableForSale: Mock.Random.boolean(8, 10, true),
      featuredImage: { url: mainImage, altText: productName, width: 800, height: 800 },
      images: [
        { url: mainImage, altText: `${productName} - Main`, width: 800, height: 800 },
        { url: Mock.Random.pick(imagePool), altText: `${productName} - Alt`, width: 800, height: 800 }
      ],
      priceRange: {
        maxVariantPrice: { amount: maxPrice.toFixed(2), currencyCode: 'USD' },
        minVariantPrice: { amount: minPrice.toFixed(2), currencyCode: 'USD' }
      },
      variants,
      options: hasVariants 
        ? [{ id: 'gid://option/color', name: 'Color', values: ['Black', 'White', 'Gray', 'Navy'] }, { id: 'gid://option/size', name: 'Size', values: ['S', 'M', 'L', 'XL'] }]
        : [{ id: 'gid://option/1', name: 'Title', values: ['Default'] }],
      seo: { title: `${productName} - Premium Quality`, description: Mock.Random.sentence(8, 15) },
      tags: [Mock.Random.pick(category.tags), Mock.Random.word()],
      updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    };

    products.push(product);
  }

  return products;
}

// 使用 Mock.js 生成产品数据
export const MOCK_PRODUCTS: Product[] = generateProducts(20);

// 使用 Mock.js 生成分类数据
export const MOCK_COLLECTIONS: Collection[] = CATEGORIES.map((cat) => ({
  handle: cat.handle,
  title: cat.title,
  description: Mock.Random.sentence(8, 15),
  seo: {
    title: `${cat.title} Collection`,
    description: Mock.Random.sentence(8, 15)
  },
  path: `/search/${cat.handle}`,
  updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
}));

// Mock 菜单数据
export const MOCK_MENUS: Record<string, Menu[]> = {
  'next-js-frontend': [
    { title: 'All', path: '/search' },
    ...MOCK_COLLECTIONS.map((c) => ({ title: c.title, path: c.path }))
  ],
  'next-js-frontend-footer-menu': [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Terms & Conditions', path: '/terms-conditions' },
    { title: 'Privacy Policy', path: '/privacy-policy' }
  ]
};

// 使用 Mock.js 生成页面数据
export const MOCK_PAGES: Page[] = [
  {
    id: 'gid://page/about',
    handle: 'about',
    title: 'About Us',
    body: Mock.Random.paragraph(8, 15),
    bodySummary: 'Learn more about our company and mission.',
    seo: { title: 'About Us - Acme Store', description: 'Learn more about Acme Store and our mission.' },
    createdAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'gid://page/terms',
    handle: 'terms-conditions',
    title: 'Terms & Conditions',
    body: Mock.Random.paragraph(10, 20),
    bodySummary: 'Read our terms and conditions.',
    seo: { title: 'Terms & Conditions - Acme Store', description: 'Read our terms and conditions.' },
    createdAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'gid://page/privacy',
    handle: 'privacy-policy',
    title: 'Privacy Policy',
    body: Mock.Random.paragraph(10, 20),
    bodySummary: 'Read our privacy policy.',
    seo: { title: 'Privacy Policy - Acme Store', description: 'Read our privacy policy.' },
    createdAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  }
];

// Mock 购物车数据存储
let mockCarts: Map<string, Cart> = new Map();
let cartIdCounter = 1;

export function createMockCart(): Cart {
  const cartId = `cart-${cartIdCounter++}`;
  const cart: Cart = {
    id: cartId,
    checkoutUrl: `https://checkout.acme.com/${cartId}`,
    cost: {
      subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
      totalAmount: { amount: '0.00', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0.00', currencyCode: 'USD' }
    },
    lines: [],
    totalQuantity: 0
  };
  mockCarts.set(cartId, cart);
  return cart;
}

export function getMockCart(cartId: string): Cart | undefined {
  return mockCarts.get(cartId);
}

export function updateMockCart(cartId: string, cart: Cart): void {
  mockCarts.set(cartId, cart);
}

export function calculateCartTotals(cart: Cart): Cart {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const line of cart.lines) {
    const amount = parseFloat(line.cost.totalAmount.amount);
    subtotal += amount;
    totalQuantity += line.quantity;
  }

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return {
    ...cart,
    cost: {
      subtotalAmount: {
        amount: subtotal.toFixed(2),
        currencyCode: 'USD'
      },
      totalAmount: {
        amount: total.toFixed(2),
        currencyCode: 'USD'
      },
      totalTaxAmount: {
        amount: tax.toFixed(2),
        currencyCode: 'USD'
      }
    },
    totalQuantity
  };
}

// 根据标签获取产品
export function getProductsByTags(tags: string[]): Product[] {
  if (tags.length === 0) return MOCK_PRODUCTS;
  
  return MOCK_PRODUCTS.filter((product) =>
    tags.some((tag) => product.tags.some((pTag) => pTag.toLowerCase().includes(tag.toLowerCase())))
  );
}

// 根据分类获取产品
export function getProductsByCollection(collectionHandle: string): Product[] {
  const category = CATEGORIES.find((c) => c.handle === collectionHandle);
  if (!category) return MOCK_PRODUCTS;

  return getProductsByTags(category.tags);
}
