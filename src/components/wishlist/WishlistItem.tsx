'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { WishlistItem as WishlistItemType } from '@/types/wishlist';
import { Button } from '@/components/ui/Button';

interface WishlistItemProps {
  item: WishlistItemType;
  onMoveToCart: (variantId: number) => void;
  onRemove: (productId: number) => void;
  isMovingToCart?: boolean;
  isRemoving?: boolean;
}

export function WishlistItemCard({
  item,
  onMoveToCart,
  onRemove,
  isMovingToCart = false,
  isRemoving = false,
}: WishlistItemProps) {
  const imageUrl = item.image_url || '/placeholder-product.png';
  const price = parseFloat(item.price) || 0;

  return (
    <div
      className="group border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--background)] hover:shadow-md transition-shadow"
      data-testid={`wishlist-item-${item.product_id}`}
    >
      {/* Product Image */}
      <Link
        href={`/products/${item.product_slug}`}
        className="relative block w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800"
      >
        <Image
          src={imageUrl}
          alt={item.product_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-gray-900/80">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link
          href={`/products/${item.product_slug}`}
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[var(--color-primary)] line-clamp-2 transition-colors"
        >
          {item.product_name}
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${price.toFixed(2)}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              item.in_stock
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
            }`}
          >
            {item.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onMoveToCart(item.product_id)}
            isLoading={isMovingToCart}
            disabled={!item.in_stock || isRemoving}
            aria-label={`Move ${item.product_name} to cart`}
          >
            <ShoppingCart size={14} className="mr-1" />
            Move to Cart
          </Button>
          <button
            onClick={() => onRemove(item.product_id)}
            disabled={isRemoving || isMovingToCart}
            className="p-2 text-gray-400 hover:text-[var(--color-danger)] hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors border border-[var(--border)] disabled:opacity-40"
            aria-label={`Remove ${item.product_name} from wishlist`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
