'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package } from 'lucide-react';
import { ProtectedRoute } from '@/lib/guards/ProtectedRoute';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrdersListSkeleton } from '@/components/checkout/CheckoutSkeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { OrderStatus, OrderFilters } from '@/types/order';

const STATUS_FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = (searchParams.get('status') as OrderStatus | 'all') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const filters: OrderFilters = {
    status: activeStatus,
    page,
    page_size: 10,
  };

  const { data, isLoading, isError } = useOrders(filters);

  const handleStatusChange = (status: OrderStatus | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    params.delete('page');
    router.push(`/orders?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/orders?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const orders = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / 10);
  const hasNext = Boolean(data?.next);
  const hasPrev = Boolean(data?.previous);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleStatusChange(f.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${
                activeStatus === f.value
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && <OrdersListSkeleton />}

      {/* Error */}
      {isError && (
        <EmptyState
          icon={Package}
          title="Failed to load orders"
          description="Something went wrong. Please try again."
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && orders.length === 0 && (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description={
            activeStatus !== 'all'
              ? `You don't have any ${activeStatus} orders.`
              : 'You haven\'t placed any orders yet.'
          }
          actionLabel="Start Shopping"
          onAction={() => router.push('/products')}
          testId="orders-empty-state"
        />
      )}

      {/* Orders list */}
      {!isLoading && !isError && orders.length > 0 && (
        <>
          <p className="text-sm text-gray-500">
            Showing {orders.length} of {totalCount} order{totalCount !== 1 ? 's' : ''}
          </p>
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasPrev}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500 px-3">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasNext}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
