'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
}

function parseDec(val: string): number {
  return parseFloat(val) || 0;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const OrderCard = React.memo(function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/orders/${order.id}`} className="block group">
      <Card className="hover:shadow-md transition-shadow duration-200">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="font-semibold text-sm sm:text-base truncate">
                  {order.order_number}
                </p>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Package size={14} />
                  {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(order.created_at)}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-lg group-hover:text-[var(--color-primary)] transition-colors">
                ৳{parseDec(order.grand_total).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});
