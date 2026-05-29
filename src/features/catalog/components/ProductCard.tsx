import React from 'react';
import Link from 'next/link';
import type { Product } from '@/test/mocks/catalog.mock';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
        <img
          src={product.imageUrl || '/images/placeholder.png'}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        {product.availability === 'OUT_OF_STOCK' && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
        {product.availability === 'LOW_STOCK' && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Low Stock
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
      </div>
      <div className="p-4 space-y-1">
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category.name}</p>
        )}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{product.name}</h3>
        {product.brand && (
          <p className="text-sm text-gray-500">{product.brand.name}</p>
        )}
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-[var(--color-primary)]">
                ${product.discountPrice!.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
