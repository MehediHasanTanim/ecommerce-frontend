'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useCancelOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';

interface CancelOrderDialogProps {
  orderId: string;
  orderNumber: string;
  onClose: () => void;
}

export const CancelOrderDialog = React.memo(function CancelOrderDialog({
  orderId,
  orderNumber,
  onClose,
}: CancelOrderDialogProps) {
  const cancelOrder = useCancelOrder();

  const handleCancel = () => {
    cancelOrder.mutate(orderId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Cancel order confirmation"
    >
      <div
        className="bg-[var(--background)] rounded-xl shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Cancel Order</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to cancel order{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {orderNumber}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={cancelOrder.isPending}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleCancel}
              isLoading={cancelOrder.isPending}
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
