import React from 'react';

export function CartSkeleton() {
  return (
    <div className="space-y-4" data-testid="cart-skeleton" aria-busy="true" aria-label="Loading cart">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row gap-4 p-4 border border-[var(--border)] rounded-xl animate-pulse"
        >
          <div className="w-full sm:w-24 h-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex items-center gap-6">
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}

      {/* Summary skeleton */}
      <div className="rounded-xl border border-[var(--border)] p-6 space-y-3 animate-pulse">
        <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <hr />
          <div className="flex justify-between">
            <div className="h-5 w-1/6 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-5 w-1/5 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

export function MiniCartSkeleton() {
  return (
    <div className="space-y-3 p-4 animate-pulse" data-testid="mini-cart-skeleton" aria-busy="true">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
      <hr className="border-[var(--border)]" />
      <div className="flex justify-between">
        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="wishlist-skeleton" aria-busy="true" aria-label="Loading wishlist">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-[var(--border)] rounded-xl p-4 animate-pulse space-y-3">
          <div className="w-full h-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-2">
            <div className="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
