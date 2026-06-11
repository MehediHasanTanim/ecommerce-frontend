'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addressService } from '@/services/address.service';
import type { AddressCreateInput } from '@/types/address';
import { mapApiError } from '@/lib/api-error';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  address_line: z.string().min(5, 'Address must be at least 5 characters'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormDialogProps {
  onClose: () => void;
}

export const AddressFormDialog = React.memo(function AddressFormDialog({
  onClose,
}: AddressFormDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'Bangladesh',
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: (data: AddressFormData) =>
      addressService.createAddress({
        ...data,
        type: 'shipping',
        is_default: false,
      } as AddressCreateInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address saved successfully');
      onClose();
    },
    onError: (error) => {
      const apiError = mapApiError(error);
      toast.error(apiError.message || 'Failed to save address');
      logger.error(
        error instanceof Error ? error : new Error('Create address failed'),
        { context: 'AddressFormDialog' }
      );
    },
  });

  const onSubmit = (data: AddressFormData) => {
    createAddressMutation.mutate(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add new address"
    >
      <div
        className="bg-[var(--background)] rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add New Address</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="John Doe"
          />
          <Input
            label="Phone Number"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="017xxxxxxxx"
          />
          <Input
            label="Country"
            {...register('country')}
            error={errors.country?.message}
          />
          <Input
            label="City"
            {...register('city')}
            error={errors.city?.message}
            placeholder="Dhaka"
          />
          <Input
            label="Area"
            {...register('area')}
            error={errors.area?.message}
            placeholder="Gulshan"
          />
          <Input
            label="Postal Code"
            {...register('postal_code')}
            error={errors.postal_code?.message}
            placeholder="1212"
          />
          <Input
            label="Address Line"
            {...register('address_line')}
            error={errors.address_line?.message}
            placeholder="House #, Road #, ..."
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={createAddressMutation.isPending}
            >
              Save Address
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});
