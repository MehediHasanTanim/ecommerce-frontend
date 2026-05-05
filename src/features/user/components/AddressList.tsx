'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

import { addressService } from '@/services/address.service';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Address } from '@/types/address';
import { AddressInput } from '@/features/user/schemas/user-schemas';
import { mapApiError } from '@/lib/api-error';

export const AddressList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAddresses,
  });

  const createMutation = useMutation({
    mutationFn: addressService.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setIsAdding(false);
      toast.success('Address added successfully!');
    },
    onError: (error) => toast.error(mapApiError(error).message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressInput }) => 
      addressService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setEditingAddress(null);
      toast.success('Address updated successfully!');
    },
    onError: (error) => toast.error(mapApiError(error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: addressService.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully!');
    },
    onError: (error) => toast.error(mapApiError(error).message),
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressService.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated!');
    },
    onError: (error) => toast.error(mapApiError(error).message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (isAdding || editingAddress) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6">
          {isAdding ? 'Add New Address' : 'Edit Address'}
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <AddressForm
            initialData={editingAddress || undefined}
            onSubmit={(data) => {
              if (editingAddress) {
                updateMutation.mutate({ id: editingAddress.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditingAddress(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Shipping & Billing Addresses</h2>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus size={18} /> Add New Address
        </Button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <EmptyState
          title="No addresses found"
          description="You haven't added any addresses yet. Add one to speed up your checkout process."
          actionLabel="Add Your First Address"
          onAction={() => setIsAdding(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={setEditingAddress}
              onDelete={(id) => deleteMutation.mutate(id)}
              onSetDefault={(id) => setDefaultMutation.mutate(id)}
              isMutating={deleteMutation.isPending || setDefaultMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};
