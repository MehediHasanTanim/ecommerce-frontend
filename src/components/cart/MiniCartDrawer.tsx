'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { MiniCartSkeleton } from './CartSkeleton';

export function MiniCartDrawer() {
  const { isDrawerOpen, closeDrawer, cart: localCart } = useCartStore();
  const { isLoading } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (isDrawerOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the drawer
      setTimeout(() => drawerRef.current?.focus(), 50);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isDrawerOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const items = localCart?.items ?? [];
  const subtotal = localCart?.subtotal ?? 0;
  const itemCount = localCart?.item_count ?? 0;

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Shopping cart drawer with ${itemCount} items`}
        tabIndex={-1}
        className={`
          fixed top-0 right-0 z-50 h-full w-full sm:w-[400px]
          bg-[var(--background)] shadow-2xl
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart size={20} />
            Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500">({itemCount})</span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && <MiniCartSkeleton />}

          {!isLoading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ShoppingCart size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some items to get started!</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={closeDrawer}
              >
                Continue Shopping
              </Button>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <ul className="divide-y divide-[var(--border)]">
              {items.map((item) => (
                <li key={item.id} className="p-4 flex gap-3">
                  <Link
                    href={`/products/${item.product_slug}`}
                    className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800"
                    onClick={closeDrawer}
                  >
                    <Image
                      src="/placeholder-product.png"
                      alt={item.product_name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product_slug}`}
                      className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-[var(--color-primary)] line-clamp-1 transition-colors"
                      onClick={closeDrawer}
                    >
                      {item.product_name}
                    </Link>
                    {item.variant_name && (
                      <p className="text-xs text-gray-500">{item.variant_name}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      <span className="text-sm font-semibold">${parseFloat(item.line_total).toFixed(2)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeDrawer}
              >
                <Link href="/cart" className="flex items-center gap-1" onClick={closeDrawer}>
                  View Cart
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                className="flex-1"
              >
                <Link href="/checkout" onClick={closeDrawer}>
                  Checkout
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
