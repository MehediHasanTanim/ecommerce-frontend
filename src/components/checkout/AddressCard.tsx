'use client';

import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Address } from '@/types/address';

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const AddressCard = React.memo(function AddressCard({
  address,
  isSelected,
  onSelect,
}: AddressCardProps) {
  return (
    <Card
      className={`
        relative cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-[var(--color-primary)] border-[var(--color-primary)]' : ''}
      `}
      onClick={() => onSelect(address.id)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(address.id);
        }
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <MapPin
              size={20}
              className={`mt-0.5 flex-shrink-0 ${
                isSelected ? 'text-[var(--color-primary)]' : 'text-gray-400'
              }`}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{address.name}</p>
                {address.is_default && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{address.phone}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {address.address_line}
                <br />
                {address.city}, {address.postal_code}
              </p>
            </div>
          </div>

          {isSelected && (
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
              <Check size={14} />
            </span>
          )}
        </div>
      </div>
    </Card>
  );
});
