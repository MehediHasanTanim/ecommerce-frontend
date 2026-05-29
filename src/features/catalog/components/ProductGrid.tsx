'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Package, SearchX, AlertCircle } from 'lucide-react';
import { useProducts, useSearchProducts, useProductDetails } from '../hooks/useProducts';
import type { Product, ProductListParams } from '../types/catalog.types';
import { buildPathWithParams } from '../utils/queryParams';

interface ProductGridProps {
  searchQuery?: string;
  detailSlug?: string;
  params?: ProductListParams;
  emptyTestId?: string;
}

function SkeletonCard() {
  return (
    <div data-testid="product-skeleton" className="rounded-xl border border-[var(--border)] p-4 space-y-3 animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
    </div>
  );
}

function LoadingGrid() {
  return (
    <div data-testid="product-loading-state" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ProductGrid({ searchQuery, detailSlug, params, emptyTestId }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productsQuery = useProducts(params || {});
  const searchQueryHook = useSearchProducts(searchQuery ? { search: searchQuery } : {});
  const detailQuery = useProductDetails(detailSlug || '');

  if (detailSlug) {
    if (detailQuery.isLoading) {
      return <Loader size="lg" />;
    }
    if (detailQuery.isError) {
      return (
        <EmptyState
          icon={AlertCircle}
          title="Product not found"
          description="The product you are looking for does not exist or has been removed."
          actionLabel="Try Again"
          onAction={() => detailQuery.refetch()}
        />
      );
    }
    const product = detailQuery.data as Product | undefined;
    if (!product || product.status !== 'ACTIVE') {
      return (
        <EmptyState
          icon={Package}
          title="Product unavailable"
          description="This product is currently unavailable."
        />
      );
    }
    return <ProductCard product={product} />;
  }

  const query = searchQuery ? searchQueryHook : productsQuery;
  const { data, isLoading, isError, error, refetch } = query;

  if (isLoading) return <LoadingGrid />;

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        description={error instanceof Error ? error.message : 'Failed to load products.'}
        actionLabel="Try Again"
        onAction={() => refetch()}
      />
    );
  }

  const results = (data as any)?.results || [];
  const activeProducts = results.filter(
    (p: Product) => p.status === 'ACTIVE'
  );

  if (activeProducts.length === 0) {
    const icon = searchQuery ? SearchX : Package;
    const title = searchQuery ? 'No results found' : 'No products found';
    return (
      <div data-testid="product-grid">
        <EmptyState
          icon={icon}
          testId={emptyTestId || (searchQuery ? 'search-empty-state' : 'product-empty-state')}
          title={title}
          description={
            searchQuery
              ? `No products match "${searchQuery}". Try a different search term.`
              : 'No products match your filters.'
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {data?.next && (
        <button
          type="button"
          data-testid="pagination-next"
          onClick={() => {
            const nextParams = new URLSearchParams(searchParams.toString());
            nextParams.set('page', String((data.page || 1) + 1));
            router.replace(buildPathWithParams(pathname, nextParams), { scroll: false });
          }}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Next Page
        </button>
      )}
    </div>
  );
}
