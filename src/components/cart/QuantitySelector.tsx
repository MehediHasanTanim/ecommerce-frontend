'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md';
}

export function QuantitySelector({
  quantity,
  maxStock,
  onIncrease,
  onDecrease,
  isLoading = false,
  size = 'md',
}: QuantitySelectorProps) {
  const isAtMin = quantity <= 1;
  const isAtMax = quantity >= maxStock;

  const btnSize = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const textSize = size === 'sm' ? 'text-sm w-6' : 'text-base w-8';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className="inline-flex items-center border border-[var(--border)] rounded-md overflow-hidden"
        role="group"
        aria-label={`Quantity selector: ${quantity} of ${maxStock}`}
      >
        <button
          type="button"
          onClick={onDecrease}
          disabled={isAtMin || isLoading}
          className={`${btnSize} flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
          aria-label="Decrease quantity"
        >
          <Minus size={iconSize} />
        </button>

        <span
          className={`${textSize} flex items-center justify-center font-medium tabular-nums select-none`}
          aria-live="polite"
          aria-atomic="true"
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          disabled={isAtMax || isLoading}
          className={`${btnSize} flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
          aria-label="Increase quantity"
        >
          <Plus size={iconSize} />
        </button>
      </div>

      {isAtMax && (
        <span className="text-xs text-[var(--color-danger)]" role="alert">
          Maximum stock reached
        </span>
      )}
    </div>
  );
}
