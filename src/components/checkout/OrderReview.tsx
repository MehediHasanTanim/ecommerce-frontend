'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { OrderSummary } from './OrderSummary';
import { Loader } from '@/components/ui/Loader';
import { useCheckoutSummary } from '@/hooks/useCheckout';
import { useCheckoutStore } from '@/store/checkout-store';
import { useAddressesForCheckout } from './useAddressesForCheckout';

function parseDec(val: string): number {
  return parseFloat(val) || 0;
}

interface OrderReviewProps {
  onValidationError: (message: string) => void;
}

/**
 * Display-only component for the order review step.
 * Shows items, selected address, payment method, and order totals.
 * The Place Order action is handled by the parent CheckoutPage.
 */
export const OrderReview = React.memo(function OrderReview({
  onValidationError: _onValidationError,
}: OrderReviewProps) {
  const { data: summary, isLoading, isError } = useCheckoutSummary();
  const { selectedAddressId, paymentMethod } = useCheckoutStore();
  const { addresses } = useAddressesForCheckout();

  const selectedAddress = addresses?.find((a) => a.id === selectedAddressId) ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-sm">
          Failed to load checkout summary. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Items + Address + Payment */}
      <div className="lg:col-span-2 space-y-6">
        {/* Items */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Items ({summary.item_count})
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-2 border-b border-[var(--border)] last:border-0"
              >
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product_name}</p>
                  {item.variant_name && (
                    <p className="text-xs text-gray-500">{item.variant_name}</p>
                  )}
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm">
                    ৳{parseDec(item.line_total).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    ৳{parseDec(item.unit_price).toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Shipping Address</h3>
          </CardHeader>
          <CardContent>
            {selectedAddress ? (
              <div className="text-sm space-y-0.5">
                <p className="font-medium">{selectedAddress.name}</p>
                <p className="text-gray-500">{selectedAddress.phone}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedAddress.address_line}, {selectedAddress.city},{' '}
                  {selectedAddress.postal_code}
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-500">No address selected</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Payment Method</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">Cash on Delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <h2 className="text-lg font-semibold">Order Summary</h2>
          </CardHeader>
          <CardContent>
            <OrderSummary summary={summary} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
