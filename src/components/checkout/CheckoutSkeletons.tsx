'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function CheckoutSummarySkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="checkout-summary-skeleton">
      {/* Stepper skeleton */}
      <div className="flex justify-center gap-4 pb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Addresses skeleton */}
          <Card>
            <div className="p-6 space-y-3">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 p-4 border rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Summary sidebar skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6 space-y-3">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-md mt-4" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OrdersListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" data-testid="orders-list-skeleton">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="order-details-skeleton">
      {/* Header card */}
      <div className="rounded-xl border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Items card */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Totals card */}
      <div className="rounded-xl border p-6">
        <div className="max-w-xs ml-auto space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
