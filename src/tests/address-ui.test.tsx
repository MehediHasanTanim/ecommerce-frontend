import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AddressList } from '@/features/user/components/AddressList';
import { addressService } from '@/services/address.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocking dependencies
vi.mock('@/services/address.service', () => ({
  addressService: {
    getAddresses: vi.fn(),
    createAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
    setDefaultAddress: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('AddressList', () => {
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  it('renders loading state initially', () => {
    vi.mocked(addressService.getAddresses).mockReturnValue(new Promise(() => {}));
    render(<AddressList />, { wrapper });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders empty state when no addresses', async () => {
    vi.mocked(addressService.getAddresses).mockResolvedValue([]);
    render(<AddressList />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/No addresses found/i)).toBeInTheDocument();
    });
  });

  it('renders address cards when data is available', async () => {
    const mockAddresses = [
      {
        id: '1',
        name: 'Home',
        phone: '01712345678',
        country: 'Bangladesh',
        city: 'Dhaka',
        area: 'Gulshan',
        postal_code: '1212',
        address_line: 'House 1',
        type: 'shipping',
        is_default: true,
      },
    ];
    vi.mocked(addressService.getAddresses).mockResolvedValue(mockAddresses as any);
    
    render(<AddressList />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText(/House 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Default/i)).toBeInTheDocument();
    });
  });
});
