'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { ProtectedRoute } from '@/lib/guards/ProtectedRoute';
import { useOrderDetails } from '@/hooks/useOrders';
import { OrderDetails as OrderDetailsComponent } from '@/components/orders/OrderDetails';
import { OrderDetailsSkeleton } from '@/components/checkout/CheckoutSkeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading, isError, refetch } = useOrderDetails(orderId);

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/orders')}
            aria-label="Back to orders"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>
        <OrderDetailsSkeleton />
      </div>
    );
  }

  // Error
  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/orders')}
          className="mb-6"
          aria-label="Back to orders"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Orders
        </Button>
        <EmptyState
          icon={Package}
          title="Order not found"
          description="We couldn't find this order. It may have been removed or the link is invalid."
          actionLabel="My Orders"
          onAction={() => router.push('/orders')}
        />
      </div>
    );
  }

  // Success
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/orders')}
          aria-label="Back to orders"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <OrderDetailsComponent order={order} />
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <ProtectedRoute>
      <OrderDetailsContent />
    </ProtectedRoute>
  );
}
