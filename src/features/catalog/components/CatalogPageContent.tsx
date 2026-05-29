'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductFilters } from './ProductFilters';
import { ProductGrid } from './ProductGrid';
import { SearchInput } from './SearchInput';
import { useBrands, useCategories } from '../hooks/useProducts';
import { buildPathWithParams, getCatalogParams } from '../utils/queryParams';

export function CatalogPageContent({ categorySlug, searchOnly = false }: { categorySlug?: string; searchOnly?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();
  const params = getCatalogParams(searchParams);

  if (categorySlug) params.category = categorySlug;

  const searchQuery = params.search;
  const category = categoriesQuery.data?.find((item) => item.slug === categorySlug);

  function updateSort(sort: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (sort) nextParams.set('sort', sort);
    else nextParams.delete('sort');
    nextParams.delete('page');
    router.replace(buildPathWithParams(pathname, nextParams), { scroll: false });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 data-testid={categorySlug ? 'category-title' : undefined} className="text-3xl font-bold">
            {categorySlug ? category?.name || 'Category' : searchOnly ? 'Search Products' : 'Products'}
          </h1>
          <p data-testid={categorySlug ? 'category-description' : undefined} className="mt-1 text-sm text-gray-500">
            {categorySlug ? category?.description || 'Products in this category.' : 'Browse the latest catalog from the live product API.'}
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchInput />
        </div>
      </div>

      <button
        type="button"
        data-testid="filters-mobile-open"
        className="inline-flex rounded-md border border-[var(--border)] px-3 py-2 text-sm md:hidden"
      >
        Filters
      </button>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-64 shrink-0">
          <ProductFilters categories={categoriesQuery.data || []} brands={brandsQuery.data || []} />
        </aside>

        <section className="min-w-0 flex-1 space-y-4">
          <div className="flex justify-end">
            <select
              data-testid="product-sort-select"
              value={params.sort || 'newest'}
              onChange={(event) => updateSort(event.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
          <ProductGrid searchQuery={searchQuery} params={params} emptyTestId={categorySlug ? 'category-empty-state' : undefined} />
        </section>
      </div>
    </div>
  );
}
