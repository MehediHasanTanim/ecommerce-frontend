'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { WishlistItemCard } from '@/components/wishlist/WishlistItem';
import { WishlistSkeleton } from '@/components/cart/CartSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const router = useRouter();
  const { items, isLoading, isError, removeFromWishlist, isRemoving } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  const handleMoveToCart = (productId: number) => {
    // Note: AddItemRequest requires variant_id; we use product_id as the
    // variant identifier for the "Move to Cart" action.
    addToCart(
      { variant_id: productId, quantity: 1 },
      {
        onSuccess: () => {
          removeFromWishlist(productId);
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <WishlistSkeleton />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <EmptyState
          icon={Heart}
          title="Failed to load wishlist"
          description="We couldn't load your wishlist right now. Please try again."
          actionLabel="Retry"
          onAction={() => window.location.reload()}
          testId="wishlist-error-state"
        />
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <EmptyState
          icon={Heart}
          title="No items in wishlist"
          description="Save your favorite products and find them here anytime."
          actionLabel="Browse Products"
          onAction={() => router.push('/products')}
          testId="wishlist-empty-state"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          My Wishlist
          <span className="text-lg font-normal text-gray-500 ml-2">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/products')}
        >
          Browse Products
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onMoveToCart={handleMoveToCart}
            onRemove={removeFromWishlist}
            isMovingToCart={isAddingToCart}
            isRemoving={isRemoving}
          />
        ))}
      </div>
    </div>
  );
}
