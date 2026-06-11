'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { checkoutService } from '@/services/checkout.service';
import type { PlaceOrderInput } from '@/types/order';
import { mapApiError } from '@/lib/api-error';
import { logger } from '@/lib/logger';

const CHECKOUT_QUERY_KEY = ['checkout', 'summary'] as const;

export function useCheckoutSummary() {
  return useQuery({
    queryKey: CHECKOUT_QUERY_KEY,
    queryFn: () => checkoutService.getCheckoutSummary(),
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlaceOrderInput) => checkoutService.placeOrder(data),
    onSuccess: (_data) => {
      // Invalidate cart and checkout data after successful order
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEY });
    },
    onError: (error) => {
      const apiError = mapApiError(error);
      toast.error(apiError.message || 'Failed to place order. Please try again.');
      logger.error(
        error instanceof Error ? error : new Error('Place order failed'),
        { context: 'usePlaceOrder' }
      );
    },
  });
}
