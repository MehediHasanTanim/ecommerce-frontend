'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderService } from '@/services/order.service';
import type { OrderFilters } from '@/types/order';
import { mapApiError } from '@/lib/api-error';
import { logger } from '@/lib/logger';

const ORDERS_QUERY_KEY = ['orders'] as const;

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, filters],
    queryFn: () => orderService.getOrders(filters),
    staleTime: 30 * 1000,
    retry: 2,
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, orderId],
    queryFn: () => orderService.getOrderDetails(orderId),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: (data) => {
      toast.success(data.message || 'Order cancelled successfully.');
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (error) => {
      const apiError = mapApiError(error);
      toast.error(apiError.message || 'Failed to cancel order.');
      logger.error(
        error instanceof Error ? error : new Error('Cancel order failed'),
        { context: 'useCancelOrder' }
      );
    },
  });
}
