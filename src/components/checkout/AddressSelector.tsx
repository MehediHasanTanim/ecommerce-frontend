'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { addressService } from '@/services/address.service';
import { useCheckoutStore } from '@/store/checkout-store';
import { AddressCard } from './AddressCard';
import { AddressFormDialog } from './AddressFormDialog';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';

export const AddressSelector = React.memo(function AddressSelector() {
  const { selectedAddressId, setSelectedAddress } = useCheckoutStore();
  const [showAddForm, setShowAddForm] = React.useState(false);

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAddresses(),
    staleTime: 60 * 1000,
  });

  const handleCloseForm = () => setShowAddForm(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Shipping Address</h3>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-sm">Failed to load addresses. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          aria-label="Add new address"
        >
          <Plus size={16} className="mr-1" />
          Add Address
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="space-y-3" role="radiogroup" aria-label="Select shipping address">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedAddressId === addr.id}
              onSelect={setSelectedAddress}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No saved addresses. Please add a shipping address.
        </p>
      )}

      {showAddForm && <AddressFormDialog onClose={handleCloseForm} />}
    </div>
  );
});
