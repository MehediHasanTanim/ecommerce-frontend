'use client';

import React, { useEffect } from 'react';
import type { ProductVariant } from '../types/catalog.types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export function ProductVariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
}: ProductVariantSelectorProps) {
  useEffect(() => {
    if (!selectedVariantId && variants.length > 0) {
      onVariantChange(variants[0]);
    }
  }, [selectedVariantId, variants, onVariantChange]);

  if (variants.length <= 1) return null;

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isOutOfStock = variant.stockQuantity === 0;
          const isSelected = variant.id === selectedVariant.id;

          return (
            <button
              key={variant.id}
              data-testid="product-variant-option"
              type="button"
              disabled={isOutOfStock}
              onClick={() => onVariantChange(variant)}
              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white selected'
                  : 'border-gray-300 hover:border-gray-400'
              } ${isOutOfStock ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
            >
              {variant.name}
              {isOutOfStock && ' (Out of Stock)'}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-gray-500" data-testid={`variant-stock-${selectedVariant.id}`}>
        SKU: {selectedVariant.sku} — Stock: {selectedVariant.stockQuantity}
      </div>
    </div>
  );
}
