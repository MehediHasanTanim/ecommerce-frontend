'use client';

import React from 'react';
import type { OrderStatus } from '@/types/order';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge = React.memo(function OrderStatusBadge({
  status,
  className = '',
}: OrderStatusBadgeProps) {
  const colorClass = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const label = ORDER_STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
});
