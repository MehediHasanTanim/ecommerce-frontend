'use client';

import React from 'react';
import { useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { Category, Brand } from '../types/catalog.types';
import { buildPathWithParams } from '../utils/queryParams';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pendingParamsRef = useRef<string | null>(null);

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentAvailability = searchParams.get('availability') || '';
  const currentSearch = searchParams.get('q') || '';

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(pendingParamsRef.current ?? window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    pendingParamsRef.current = params.toString();
    router.replace(buildPathWithParams(pathname, params), { scroll: false });
  }

  function clearFilters() {
    const params = new URLSearchParams();
    if (currentSearch) params.set('q', currentSearch);
    pendingParamsRef.current = params.toString();
    router.replace(buildPathWithParams(pathname, params), { scroll: false });
  }

  const hasAnyFilter = currentCategory || currentBrand || currentMinPrice || currentMaxPrice || currentAvailability;

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasAnyFilter && (
          <button
            data-testid="filters-clear-all"
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
              data-testid={`filter-category-${cat.slug}`}
              defaultChecked={currentCategory === cat.slug}
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
              data-testid={`filter-brand-${brand.slug}`}
              defaultChecked={currentBrand === brand.slug}
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
            data-testid="filter-min-price"
            placeholder="Min"
            value={currentMinPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <input
            type="number"
            data-testid="filter-max-price"
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
            data-testid="filter-availability-in_stock"
            defaultChecked={currentAvailability === 'in_stock'}
            onChange={() =>
              updateParam('availability', currentAvailability === 'in_stock' ? '' : 'in_stock')
            }
          />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            data-testid="filter-availability-LOW_STOCK"
            defaultChecked={currentAvailability === 'LOW_STOCK'}
            onChange={() =>
              updateParam('availability', currentAvailability === 'LOW_STOCK' ? '' : 'LOW_STOCK')
            }
          />
          Low Stock
        </label>
      </fieldset>
    </aside>
  );
}
