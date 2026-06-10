'use client';

import React, { useState } from 'react';
import { Ticket, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CouponInputProps {
  onApply: (code: string) => void;
  onRemove?: () => void;
  isLoading?: boolean;
  appliedCode?: string | null;
  discountAmount?: number;
}

export function CouponInput({
  onApply,
  onRemove,
  isLoading = false,
  appliedCode,
  discountAmount,
}: CouponInputProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) {
      onApply(trimmed);
      setCode('');
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <div className="flex items-center gap-2">
          <Ticket size={18} className="text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              Coupon Applied: <span className="font-bold">{appliedCode}</span>
            </p>
            {discountAmount !== undefined && discountAmount > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400">
                You saved ${discountAmount.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-green-600 hover:text-red-600 dark:text-green-400 dark:hover:text-red-400 transition-colors rounded"
            aria-label="Remove coupon"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Ticket
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code"
          className="input-field pl-9"
          aria-label="Enter coupon code"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        isLoading={isLoading}
        disabled={!code.trim()}
      >
        Apply
      </Button>
    </form>
  );
}
