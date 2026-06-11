import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCheckoutStore } from '@/store/checkout-store';
import type { User } from '@/types/auth';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Use a non-infinite staleTime to allow refetch when handlers change
        staleTime: 0,
        gcTime: Infinity,
      },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

/** Minimal authenticated user for protected route tests */
export const mockAuthUser: User = {
  id: 'user-uuid-1',
  email: 'test@example.com',
  phone: '01711223344',
  full_name: 'Test User',
  role: 'customer',
  is_verified: true,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
};

/** Set the auth store to an authenticated state */
export const loginAsUser = () => {
  useAuthStore.setState({
    user: mockAuthUser,
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    isAuthenticated: true,
    _hasHydrated: true,
  });
};

/** Reset all Zustand stores to their initial state between tests */
export const resetStores = () => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    _hasHydrated: true,
  });

  useCartStore.setState({
    cart: null,
    isDrawerOpen: false,
    loading: false,
  });

  useWishlistStore.setState({
    items: [],
    loading: false,
  });

  useCheckoutStore.setState({
    selectedAddressId: null,
    paymentMethod: 'cod',
    currentStep: 1,
    isPlacingOrder: false,
  });
};
