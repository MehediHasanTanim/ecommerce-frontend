'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wishlistService } from '@/services/wishlist.service';
import { useWishlistStore } from '@/store/wishlist-store';
import { WishlistAddInput } from '@/types/wishlist';
import { mapApiError } from '@/lib/api-error';
import { logger } from '@/lib/logger';

const WISHLIST_QUERY_KEY = ['wishlist'] as const;

export function useWishlist({ enabled = true }: { enabled?: boolean } = {}) {
  const queryClient = useQueryClient();
  const { setWishlist, addItem, removeItem, setLoading } = useWishlistStore();

  const wishlistQuery = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      setLoading(true);
      try {
        const items = await wishlistService.getWishlist();
        setWishlist(items);
        return items;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 30 * 1000,
    enabled,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (input: WishlistAddInput) => wishlistService.addWishlistItem(input),
    onSuccess: (item) => {
      addItem(item);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success('Item added to wishlist');
    },
    onError: (error) => {
      const apiError = mapApiError(error);
      toast.error(apiError.message || 'Failed to add to wishlist');
      logger.error(error instanceof Error ? error : new Error('Add to wishlist failed'), { context: 'useWishlist.addToWishlist' });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: number) => wishlistService.removeWishlistItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      removeItem(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success('Removed from wishlist');
    },
    onError: (error) => {
      toast.error('Failed to remove from wishlist');
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      logger.error(error instanceof Error ? error : new Error('Remove from wishlist failed'), { context: 'useWishlist.removeFromWishlist' });
    },
  });

  return {
    items: wishlistQuery.data ?? [],
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    error: wishlistQuery.error,
    refetch: wishlistQuery.refetch,
    addToWishlist: (productId: number) => addToWishlistMutation.mutate({ product_id: productId }),
    isAdding: addToWishlistMutation.isPending,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isRemoving: removeFromWishlistMutation.isPending,
  };
}
