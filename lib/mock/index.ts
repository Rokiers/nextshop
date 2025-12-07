import { HIDDEN_PRODUCT_TAG, TAGS } from 'lib/constants';
import {
  revalidateTag,
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife
} from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Cart, CartItem, Collection, Menu, Page, Product } from './types';
import {
  MOCK_PRODUCTS,
  MOCK_COLLECTIONS,
  MOCK_MENUS,
  MOCK_PAGES,
  createMockCart,
  getMockCart,
  updateMockCart,
  calculateCartTotals,
  getProductsByCollection
} from './mock-data';

// 购物车相关函数 - 使用 Mock 数据
export async function createCart(): Promise<Cart> {
  return createMockCart();
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  let cart = getMockCart(cartId);

  if (!cart) {
    cart = createMockCart();
  }

  // 添加商品到购物车
  for (const line of lines) {
    // 查找对应的产品和变体
    const product = MOCK_PRODUCTS.find((p) =>
      p.variants.some((v) => v.id === line.merchandiseId)
    );
    const variant = product?.variants.find((v) => v.id === line.merchandiseId);

    if (product && variant) {
      // 检查是否已存在
      const existingLine = cart.lines.find(
        (l) => l.merchandise.id === line.merchandiseId
      );

      if (existingLine) {
        existingLine.quantity += line.quantity;
        existingLine.cost.totalAmount.amount = (
          parseFloat(variant.price.amount) * existingLine.quantity
        ).toFixed(2);
      } else {
        const newLine: CartItem = {
          id: `line-${Date.now()}-${Math.random()}`,
          quantity: line.quantity,
          cost: {
            totalAmount: {
              amount: (parseFloat(variant.price.amount) * line.quantity).toFixed(2),
              currencyCode: variant.price.currencyCode
            }
          },
          merchandise: {
            id: variant.id,
            title: variant.title,
            selectedOptions: variant.selectedOptions,
            product: {
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage
            }
          }
        };
        cart.lines.push(newLine);
      }
    }
  }

  cart = calculateCartTotals(cart);
  updateMockCart(cartId, cart);
  return cart;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  let cart = getMockCart(cartId);

  if (!cart) {
    return createMockCart();
  }

  // 移除指定的商品
  cart.lines = cart.lines.filter((line) => !lineIds.includes(line.id!));
  cart = calculateCartTotals(cart);
  updateMockCart(cartId, cart);
  return cart;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  let cart = getMockCart(cartId);

  if (!cart) {
    return createMockCart();
  }

  // 更新购物车中的商品
  for (const updateLine of lines) {
    const cartLine = cart.lines.find((l) => l.id === updateLine.id);
    if (cartLine) {
      cartLine.quantity = updateLine.quantity;
      const unitPrice = parseFloat(cartLine.cost.totalAmount.amount) / cartLine.quantity;
      cartLine.cost.totalAmount.amount = (unitPrice * updateLine.quantity).toFixed(2);
    }
  }

  cart = calculateCartTotals(cart);
  updateMockCart(cartId, cart);
  return cart;
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return undefined;
  }

  return getMockCart(cartId);
}

// 产品系列相关函数 - 使用 Mock 数据
export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  return MOCK_COLLECTIONS.find((c) => c.handle === handle);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife('days');

  let products = getProductsByCollection(collection);

  // 应用排序
  if (sortKey === 'PRICE') {
    products = [...products].sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? priceB - priceA : priceA - priceB;
    });
  } else if (sortKey === 'CREATED_AT') {
    products = [...products].sort((a, b) => {
      return reverse
        ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });
  }

  return products;
}

export async function getCollections(): Promise<Collection[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    ...MOCK_COLLECTIONS.filter((collection) => !collection.handle.startsWith('hidden'))
  ];

  return collections;
}

// 菜单相关函数 - 使用 Mock 数据
export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  return MOCK_MENUS[handle] || [];
}

// 页面相关函数 - 使用 Mock 数据
export async function getPage(handle: string): Promise<Page> {
  const page = MOCK_PAGES.find((p) => p.handle === handle);
  if (!page) {
    throw new Error(`Page not found: ${handle}`);
  }
  return page;
}

export async function getPages(): Promise<Page[]> {
  return MOCK_PAGES;
}

// 产品相关函数 - 使用 Mock 数据
export async function getProduct(handle: string): Promise<Product | undefined> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  return MOCK_PRODUCTS.find((p) => p.handle === handle);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  // 返回随机的其他产品作为推荐
  const currentProduct = MOCK_PRODUCTS.find((p) => p.id === productId);
  const otherProducts = MOCK_PRODUCTS.filter((p) => p.id !== productId);
  
  // 如果当前产品有标签，优先推荐相同标签的产品
  if (currentProduct && currentProduct.tags.length > 0) {
    const relatedProducts = otherProducts.filter((p) =>
      p.tags.some((tag) => currentProduct.tags.includes(tag))
    );
    if (relatedProducts.length >= 3) {
      return relatedProducts.slice(0, 3);
    }
  }
  
  return otherProducts.slice(0, 3);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  let products = [...MOCK_PRODUCTS];

  // 应用搜索过滤
  if (query) {
    const lowerQuery = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // 应用排序
  if (sortKey === 'PRICE') {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? priceB - priceA : priceA - priceB;
    });
  } else if (sortKey === 'CREATED_AT') {
    products.sort((a, b) => {
      return reverse
        ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });
  }

  return products;
}

// 重新验证函数 - Mock 实现
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const collectionUpdates = ['collections/create', 'collections/delete', 'collections/update'];
  const productUpdates = ['products/create', 'products/delete', 'products/update'];
  const topic = (await headers()).get('x-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionUpdates.includes(topic);
  const isProductUpdate = productUpdates.includes(topic);

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}