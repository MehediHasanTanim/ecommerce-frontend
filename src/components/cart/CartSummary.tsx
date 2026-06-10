'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  grandTotal: number;
  itemCount: number;
  couponCode?: string | null;
  isLoading?: boolean;
}

export function CartSummary({
  subtotal,
  discount,
  grandTotal,
  itemCount,
  couponCode,
  isLoading = false,
}: CartSummaryProps) {
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Order Summary
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-medium tabular-nums">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Discount {couponCode && `(${couponCode})`}</span>
            <span className="font-medium tabular-nums">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>

        <hr className="border-[var(--border)]" />

        <div className="flex justify-between text-base font-bold text-gray-900 dark:text-gray-100">
          <span>Total</span>
          <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={itemCount === 0 || isLoading}
        className="w-full"
        size="lg"
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </Button>

      <p className="text-xs text-center text-gray-500">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
}
