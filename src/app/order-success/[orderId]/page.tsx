'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { ProtectedRoute } from '@/lib/guards/ProtectedRoute';
import { useOrderDetails } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';

function parseDec(val: string): number {
  return parseFloat(val) || 0;
}

function OrderSuccessContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { data: order, isLoading, isError } = useOrderDetails(orderId);

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  // Error or no order
  if (isError || !order) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">
          Your order has been placed successfully. We are unable to load order details
          right now, but you can view it in your orders page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push('/orders')} variant="outline">
            My Orders
          </Button>
          <Button onClick={() => router.push('/products')}>
            <ShoppingBag size={16} className="mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-8 sm:py-16">
      {/* Success icon */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Order placed successfully!
      </h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. Your order has been received and is being
        processed.
      </p>

      {/* Order info card */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8 text-left">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Order Number</span>
            <span className="font-semibold text-sm">{order.order_number}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
            <span className="text-sm text-gray-500">Grand Total</span>
            <span className="font-bold text-lg">
              ৳{parseDec(order.grand_total).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push(`/orders/${orderId}`)}
          className="inline-flex items-center"
        >
          View Order
          <ArrowRight size={16} className="ml-2" />
        </Button>
        <Button onClick={() => router.push('/products')}>
          <ShoppingBag size={16} className="mr-2" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <ProtectedRoute>
      <OrderSuccessContent />
    </ProtectedRoute>
  );
}
