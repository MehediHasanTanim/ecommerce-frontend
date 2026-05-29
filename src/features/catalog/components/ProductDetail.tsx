'use client';

import { useState } from 'react';
import { AlertCircle, Package } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { useProductDetails } from '../hooks/useProducts';
import { ProductVariantSelector } from './ProductVariantSelector';
import type { ProductVariant } from '../types/catalog.types';

export function ProductDetail({ slug }: { slug: string }) {
  const query = useProductDetails(slug);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (query.isLoading) return <Loader size="lg" />;

  if (query.isError || !query.data) {
    return (
      <EmptyState
        testId="product-detail-error-state"
        icon={AlertCircle}
        title="Product not found"
        description="The product you are looking for does not exist or has been removed."
      />
    );
  }

  const product = query.data;

  if (product.status !== 'ACTIVE') {
    return (
      <EmptyState
        testId="product-detail-error-state"
        icon={Package}
        title="Product unavailable"
        description="This product is currently unavailable."
      />
    );
  }

  const effectivePrice = selectedVariant?.salePrice ?? selectedVariant?.price ?? product.discountPrice ?? product.price;
  const images = product.images?.length ? product.images : [{ id: product.id, url: product.imageUrl || '/images/placeholder.png', altText: product.name }];

  return (
    <article className="grid gap-8 lg:grid-cols-2">
      <div data-testid="product-image-gallery" className="space-y-3">
        <img src={images[0].url} alt={images[0].altText || product.name} className="aspect-square w-full rounded-2xl object-cover bg-gray-100" />
      </div>

      <div className="space-y-5">
        <div>
          <h1 data-testid="product-detail-title" className="text-3xl font-bold">{product.name}</h1>
          <p data-testid="product-detail-price" className="mt-2 text-2xl font-bold text-[var(--color-primary)]">
            ${effectivePrice.toFixed(2)}
          </p>
        </div>

        <p data-testid="product-detail-description" className="text-gray-600 dark:text-gray-300">
          {product.description || product.shortDescription || 'No description available.'}
        </p>

        {product.brand && <p data-testid="product-detail-brand" className="text-sm">Brand: {product.brand.name}</p>}
        {product.category && <p data-testid="product-detail-category" className="text-sm">Category: {product.category.name}</p>}
        <p data-testid="product-detail-stock-status" className="text-sm">Availability: {product.availability.replaceAll('_', ' ')}</p>

        <ProductVariantSelector
          variants={product.variants || []}
          selectedVariantId={selectedVariant?.id || null}
          onVariantChange={setSelectedVariant}
        />
      </div>
    </article>
  );
}
