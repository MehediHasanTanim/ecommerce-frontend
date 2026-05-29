import { Suspense } from 'react';
import { CatalogPageContent } from '@/features/catalog/components/CatalogPageContent';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div data-testid="product-loading-state">Loading category...</div>}>
      <CatalogPageContent categorySlug={slug} />
    </Suspense>
  );
}
