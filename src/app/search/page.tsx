import { Suspense } from 'react';
import Link from 'next/link';
import { CatalogPageContent } from '@/features/catalog/components/CatalogPageContent';

export default function SearchPage() {
  return (
    <div className="space-y-4">
      <Link data-testid="clear-search" href="/search" className="inline-flex text-sm text-[var(--color-primary)] hover:underline">
        Clear search
      </Link>
      <Suspense fallback={<div data-testid="product-loading-state">Loading search...</div>}>
        <CatalogPageContent searchOnly />
      </Suspense>
    </div>
  );
}
