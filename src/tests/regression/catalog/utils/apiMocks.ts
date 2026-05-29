import { Page, Route } from '@playwright/test';
import { catalogBrands } from '../fixtures/brands.fixture';
import { catalogCategories } from '../fixtures/categories.fixture';
import { activeCatalogProducts, catalogProducts, CatalogProduct } from '../fixtures/products.fixture';

type ProductParams = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

function paginate(products: CatalogProduct[], params: ProductParams) {
  const page = Number(params.page || 1);
  const limit = Number(params.limit || 12);
  const start = (page - 1) * limit;
  const results = products.slice(start, start + limit);

  return {
    results,
    count: products.length,
    page,
    totalPages: Math.ceil(products.length / limit),
    next: start + limit < products.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
  };
}

function sortProducts(products: CatalogProduct[], sort = 'newest') {
  const next = [...products];

  switch (sort) {
    case 'oldest':
      return next.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    case 'price_asc':
      return next.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    case 'price_desc':
      return next.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    case 'name_asc':
      return next.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return next.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
    default:
      return next.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
}

function filterProducts(params: ProductParams) {
  let products = [...activeCatalogProducts];

  if (params.search) {
    const query = params.search.toLowerCase();
    products = products.filter((product) => {
      return product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    });
  }

  if (params.category) {
    products = products.filter((product) => product.category?.slug === params.category);
  }

  if (params.brand) {
    products = products.filter((product) => product.brand?.slug === params.brand);
  }

  if (params.minPrice) {
    products = products.filter((product) => (product.discountPrice ?? product.price) >= Number(params.minPrice));
  }

  if (params.maxPrice) {
    products = products.filter((product) => (product.discountPrice ?? product.price) <= Number(params.maxPrice));
  }

  if (params.availability) {
    products = products.filter((product) => product.availability.toLowerCase() === params.availability?.toLowerCase());
  }

  return sortProducts(products, params.sort);
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

function paramsFromRoute(route: Route): ProductParams {
  const url = new URL(route.request().url());

  return {
    search: url.searchParams.get('search') || url.searchParams.get('q') || undefined,
    category: url.searchParams.get('category') || undefined,
    brand: url.searchParams.get('brand') || undefined,
    minPrice: url.searchParams.get('minPrice') || undefined,
    maxPrice: url.searchParams.get('maxPrice') || undefined,
    availability: url.searchParams.get('availability') || undefined,
    sort: url.searchParams.get('sort') || undefined,
    page: url.searchParams.get('page') || undefined,
    limit: url.searchParams.get('limit') || undefined,
  };
}

export async function mockCatalogAPIs(page: Page) {
  await page.route('**/api/v1/categories**', async (route) => {
    await fulfillJson(route, catalogCategories);
  });

  await page.route('**/api/v1/brands**', async (route) => {
    await fulfillJson(route, catalogBrands);
  });

  await page.route('**/api/v1/products/search**', async (route) => {
    const params = paramsFromRoute(route);
    await fulfillJson(route, paginate(filterProducts(params), params));
  });

  await page.route('**/api/v1/products**', async (route) => {
    const url = new URL(route.request().url());
    const slug = url.pathname.split('/').filter(Boolean).pop();

    if (slug && slug !== 'products') {
      const product = catalogProducts.find((item) => item.slug === slug);

      if (!product || product.status !== 'ACTIVE') {
        await fulfillJson(route, { detail: 'Product not found' }, 404);
        return;
      }

      await fulfillJson(route, product);
      return;
    }

    const params = paramsFromRoute(route);
    await fulfillJson(route, paginate(filterProducts(params), params));
  });
}
