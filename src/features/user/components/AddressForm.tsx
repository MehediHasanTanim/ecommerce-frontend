'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Address, AddressCreateInput } from '@/types/address';
import { addressSchema, AddressInput } from '@/features/user/schemas/user-schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddressFormProps {
  initialData?: Address;
  onSubmit: (data: AddressInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      phone: initialData.phone,
      country: initialData.country,
      city: initialData.city,
      area: initialData.area,
      postal_code: initialData.postal_code,
      address_line: initialData.address_line,
      type: initialData.type,
      is_default: initialData.is_default,
    } : {
      type: 'shipping',
      is_default: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Label (e.g. Home, Work)"
          placeholder="Home"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Phone Number"
          placeholder="01712345678"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      <Input
        label="Address Line"
        placeholder="House 1, Road 1, Block A"
        {...register('address_line')}
        error={errors.address_line?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Area"
          placeholder="Gulshan"
          {...register('area')}
          error={errors.area?.message}
        />
        <Input
          label="City"
          placeholder="Dhaka"
          {...register('city')}
          error={errors.city?.message}
        />
        <Input
          label="Postal Code"
          placeholder="1212"
          {...register('postal_code')}
          error={errors.postal_code?.message}
        />
      </div>

      <Input
        label="Country"
        placeholder="Bangladesh"
        {...register('country')}
        error={errors.country?.message}
      />

      <div className="flex gap-6 py-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="shipping"
            value="shipping"
            {...register('type')}
            className="w-4 h-4 text-[var(--color-primary)]"
          />
          <label htmlFor="shipping" className="text-sm">Shipping</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="billing"
            value="billing"
            {...register('type')}
            className="w-4 h-4 text-[var(--color-primary)]"
          />
          <label htmlFor="billing" className="text-sm">Billing</label>
        </div>
      </div>

      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          id="is_default"
          {...register('is_default')}
          className="w-4 h-4 rounded text-[var(--color-primary)]"
        />
        <label htmlFor="is_default" className="text-sm">Set as default address</label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          isLoading={isLoading}
        >
          {initialData ? 'Update Address' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
};
