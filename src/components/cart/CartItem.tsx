'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { QuantitySelector } from './QuantitySelector';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating?: boolean;
}

const placeholderImg = '/placeholder-product.png';

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemProps) {
  const handleIncrease = () => {
    if (item.quantity < item.stock_quantity) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const unitPrice = parseFloat(item.unit_price) || 0;
  const lineTotal = parseFloat(item.line_total) || 0;

  return (
    <div
      className="flex flex-col sm:flex-row gap-4 p-4 border border-[var(--border)] rounded-xl bg-[var(--background)]"
      data-testid={`cart-item-${item.id}`}
    >
      {/* Product Image – placeholder since CartItem has no image_url */}
      <Link
        href={`/products/${item.product_slug}`}
        className="relative w-full sm:w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
        aria-label={`View ${item.product_name}`}
      >
        <Image
          src={placeholderImg}
          alt={item.product_name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      {/* Item Details */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${item.product_slug}`}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {item.product_name}
          </Link>

          {item.variant_name && (
            <p className="text-xs text-gray-500 mt-0.5">{item.variant_name}</p>
          )}

          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
            ${unitPrice.toFixed(2)}
          </p>
        </div>

        {/* Quantity & Total */}
        <div className="flex items-center gap-4 sm:gap-6">
          <QuantitySelector
            quantity={item.quantity}
            maxStock={item.stock_quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            isLoading={isUpdating}
            size="sm"
          />

          <div className="text-right min-w-[80px]">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ${lineTotal.toFixed(2)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={isUpdating}
            className="p-2 text-gray-400 hover:text-[var(--color-danger)] disabled:opacity-40 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-950"
            aria-label={`Remove ${item.product_name} from cart`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
