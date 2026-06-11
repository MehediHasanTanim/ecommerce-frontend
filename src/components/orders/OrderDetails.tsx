'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { OrderStatusBadge } from './OrderStatusBadge';
import { CancelOrderDialog } from './CancelOrderDialog';
import { Button } from '@/components/ui/Button';
import type { Order } from '@/types/order';

interface OrderDetailsProps {
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
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const OrderDetails = React.memo(function OrderDetails({
  order,
}: OrderDetailsProps) {
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="space-y-6">
      {/* Order Info Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Order {order.order_number}</h2>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              {canCancel && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Status</p>
              <p className="font-medium capitalize">{order.payment_status}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium uppercase">{order.payment_method}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      {order.address && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Shipping Address</h3>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-0.5">
              <p className="font-medium">{order.address.name}</p>
              <p className="text-gray-500">{order.address.phone}</p>
              <p className="text-gray-600 dark:text-gray-300">
                {order.address.address_line}
                <br />
                {order.address.city}, {order.address.postal_code}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Items ({order.items.length})
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-2 border-b border-[var(--border)] last:border-0"
            >
              <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.product_name}</p>
                {item.variant_name && (
                  <p className="text-xs text-gray-500">{item.variant_name}</p>
                )}
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ৳{parseDec(item.unit_price).toLocaleString()}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm">
                  ৳{parseDec(item.line_total).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Totals */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Order Totals</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5 text-sm max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>৳{parseDec(order.subtotal).toLocaleString()}</span>
            </div>
            {parseDec(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-৳{parseDec(order.discount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>
                {parseDec(order.shipping_fee) > 0
                  ? `৳${parseDec(order.shipping_fee).toLocaleString()}`
                  : 'Free'}
              </span>
            </div>
            {parseDec(order.tax) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>৳{parseDec(order.tax).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-3 border-t border-[var(--border)]">
              <span>Grand Total</span>
              <span>৳{parseDec(order.grand_total).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <CancelOrderDialog
          orderId={order.id}
          orderNumber={order.order_number}
          onClose={() => setShowCancelDialog(false)}
        />
      )}
    </div>
  );
});
