'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/cart-store';
import { AddToCartInput, ApplyCouponInput } from '@/types/cart';
import { mapApiError } from '@/lib/api-error';
import { logger } from '@/lib/logger';

const CART_QUERY_KEY = ['cart'] as const;

export function useCart({ enabled = true }: { enabled?: boolean } = {}) {
  const queryClient = useQueryClient();
  const { setCart, clearCart, updateItemLocally, removeItemLocally, setLoading, openDrawer } = useCartStore();

  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      setLoading(true);
      try {
        const cart = await cartService.getCart();
        setCart(cart);
        return cart;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 30 * 1000,
    enabled,
  });

  const addToCartMutation = useMutation({
    mutationFn: (input: AddToCartInput) => cartService.addToCart(input),
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      openDrawer();
      toast.success('Item added to cart');
    },
    onError: (error) => {
      const apiError = mapApiError(error);
      toast.error(apiError.message || 'Failed to add item to cart');
      logger.error(error instanceof Error ? error : new Error('Add to cart failed'), { context: 'useCart.addToCart' });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateCartItem(itemId, { quantity }),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      updateItemLocally(itemId, quantity);
    },
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error, _vars) => {
      toast.error('Failed to update quantity');
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      logger.error(error instanceof Error ? error : new Error('Update quantity failed'), { context: 'useCart.updateQuantity' });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeCartItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      removeItemLocally(itemId);
    },
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      toast.error('Failed to remove item');
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      logger.error(error instanceof Error ? error : new Error('Remove item failed'), { context: 'useCart.removeItem' });
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: (input: ApplyCouponInput) => cartService.applyCoupon(input),
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Coupon applied successfully!');
    },
    onError: (error) => {
      const apiError = mapApiError(error);
      toast.error(apiError.message || 'Invalid coupon code');
      logger.error(error instanceof Error ? error : new Error('Apply coupon failed'), { context: 'useCart.applyCoupon' });
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: (cart) => {
      setCart(cart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Coupon removed');
    },
    onError: (error) => {
      toast.error('Failed to remove coupon');
      logger.error(error instanceof Error ? error : new Error('Remove coupon failed'), { context: 'useCart.removeCoupon' });
    },
  });

  return {
    cart: cartQuery.data ?? null,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
    refetch: cartQuery.refetch,
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    updateQuantity: updateQuantityMutation.mutate,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemovingItem: removeItemMutation.isPending,
    applyCoupon: applyCouponMutation.mutate,
    isApplyingCoupon: applyCouponMutation.isPending,
    removeCoupon: removeCouponMutation.mutate,
    isRemovingCoupon: removeCouponMutation.isPending,
  };
}
