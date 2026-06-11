'use client';

import React from 'react';
import type { CheckoutSummary } from '@/types/order';

interface OrderSummaryProps {
  summary: CheckoutSummary;
  className?: string;
}

function parseDec(val: string): number {
  return parseFloat(val) || 0;
}

export const OrderSummary = React.memo(function OrderSummary({
  summary,
  className = '',
}: OrderSummaryProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold">Order Summary</h3>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal ({summary.item_count} items)</span>
          <span>৳{parseDec(summary.subtotal).toLocaleString()}</span>
        </div>
        {parseDec(summary.discount) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-৳{parseDec(summary.discount).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span>
            {parseDec(summary.shipping_fee) > 0
              ? `৳${parseDec(summary.shipping_fee).toLocaleString()}`
              : 'Free'}
          </span>
        </div>
        {parseDec(summary.tax) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Tax</span>
            <span>৳{parseDec(summary.tax).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-3 border-t border-[var(--border)]">
          <span>Grand Total</span>
          <span>৳{parseDec(summary.grand_total).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
});
