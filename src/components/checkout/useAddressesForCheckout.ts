'use client';

import { useQuery } from '@tanstack/react-query';
import { addressService } from '@/services/address.service';

/**
 * Shared hook for fetching addresses used during checkout.
 * Mirrors the pattern in AddressSelector but returns data for any consumer.
 */
export function useAddressesForCheckout() {
  const query = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAddresses(),
    staleTime: 60 * 1000,
  });

  return {
    addresses: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
