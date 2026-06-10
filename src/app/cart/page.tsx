'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { CouponInput } from '@/components/cart/CouponInput';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    isError,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    isUpdatingQuantity,
    isApplyingCoupon,
    isRemovingCoupon,
  } = useCart();

  const { cart: localCart } = useCartStore();
  const displayCart = cart ?? localCart;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <CartSkeleton />
      </div>
    );
  }

  // Error state
  if (isError || !displayCart) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <EmptyState
          icon={ShoppingCart}
          title="Failed to load cart"
          description="We couldn't load your cart right now. Please try again."
          actionLabel="Retry"
          onAction={() => window.location.reload()}
          testId="cart-error-state"
        />
      </div>
    );
  }

  // Empty state
  if (displayCart.items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Start browsing our products!"
          actionLabel="Continue Shopping"
          onAction={() => router.push('/products')}
          testId="cart-empty-state"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/products')}
          aria-label="Continue shopping"
        >
          <ArrowLeft size={16} className="mr-1" />
          Continue Shopping
        </Button>
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {displayCart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={(itemId, qty) => updateQuantity({ itemId, quantity: qty })}
              onRemove={removeItem}
              isUpdating={isUpdatingQuantity}
            />
          ))}

          {/* Coupon Section */}
          <div className="pt-2">
            <CouponInput
              onApply={(code) => applyCoupon({ code })}
              onRemove={removeCoupon}
              isLoading={isApplyingCoupon || isRemovingCoupon}
              appliedCode={displayCart.coupon_code ?? null}
              discountAmount={displayCart.discount}
            />
          </div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <CartSummary
              subtotal={displayCart.subtotal}
              discount={displayCart.discount}
              grandTotal={displayCart.grand_total}
              itemCount={displayCart.item_count}
              couponCode={displayCart.coupon_code ?? null}
              isLoading={isUpdatingQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
