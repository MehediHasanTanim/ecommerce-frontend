'use client';

import Link from 'next/link';
import { ProductGrid } from './ProductGrid';
import { useBrands, useCategories } from '../hooks/useProducts';

export function HomeCatalogSections() {
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();

  return (
    <div className="mt-12 space-y-12">
      <section data-testid="home-featured-products" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid params={{ isFeatured: true, limit: 4 }} />
      </section>

      <section data-testid="home-categories" className="space-y-4">
        <h2 className="text-2xl font-bold">Shop By Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(categoriesQuery.data || []).map((category) => (
            <Link
              key={category.id}
              data-testid={`category-link-${category.slug}`}
              href={`/categories/${category.slug}`}
              className="rounded-xl border border-[var(--border)] p-4 hover:shadow-sm"
            >
              <span className="font-semibold">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section data-testid="home-brands" className="space-y-4">
        <h2 className="text-2xl font-bold">Popular Brands</h2>
        <div className="flex flex-wrap gap-2">
          {(brandsQuery.data || []).map((brand) => (
            <Link key={brand.id} href={`/products?brand=${brand.slug}`} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">
              {brand.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
