import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { Category, Brand } from '@/test/mocks/catalog.mock';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentAvailability = searchParams.get('availability') || '';
  const currentSearch = searchParams.get('q') || '';

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    const params = new URLSearchParams();
    if (currentSearch) params.set('q', currentSearch);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const hasAnyFilter = currentCategory || currentBrand || currentMinPrice || currentMaxPrice || currentAvailability;

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasAnyFilter && (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Categories</legend>
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={currentCategory === cat.slug}
              onChange={() =>
                updateParam('category', currentCategory === cat.slug ? '' : cat.slug)
              }
            />
            {cat.name}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Brands</legend>
        {brands.map((brand) => (
          <label key={brand.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={currentBrand === brand.slug}
              onChange={() =>
                updateParam('brand', currentBrand === brand.slug ? '' : brand.slug)
              }
            />
            {brand.name}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Price Range</legend>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={currentMinPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={currentMaxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium mb-2">Availability</legend>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={currentAvailability === 'in_stock'}
            onChange={() =>
              updateParam('availability', currentAvailability === 'in_stock' ? '' : 'in_stock')
            }
          />
          In Stock
        </label>
      </fieldset>
    </aside>
  );
}
