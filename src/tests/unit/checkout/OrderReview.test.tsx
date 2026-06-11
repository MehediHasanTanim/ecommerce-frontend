import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, resetStores } from '@/test/test-utils';
import { OrderReview } from '@/components/checkout/OrderReview';
import { useCheckoutStore } from '@/store/checkout-store';
import { server } from '@/tests/mocks/server';
import { errorCheckoutHandlers } from '@/tests/mocks/checkoutHandlers';

describe('OrderReview', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Rendering', () => {
    it('renders items section with item count', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/Items.*3/)).toBeInTheDocument();
      });
    });

    it('renders product names in items list', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('USB-C Cable')).toBeInTheDocument();
      });
    });

    it('renders variant names', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Black / Standard')).toBeInTheDocument();
      });
    });

    it('renders line totals', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/2,500/)).toBeInTheDocument();
      });
    });

    it('renders shipping address section', async () => {
      // Set an address in the store first
      useCheckoutStore.getState().setSelectedAddress('addr-1');
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Shipping Address')).toBeInTheDocument();
      });
    });

    it('shows address details when address is selected', async () => {
      useCheckoutStore.getState().setSelectedAddress('addr-1');
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        // The address from mock data should appear
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('01711223344')).toBeInTheDocument();
      });
    });

    it('shows "No address selected" when no address', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/no address selected/i)).toBeInTheDocument();
      });
    });

    it('renders payment method section', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
        expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
      });
    });

    it('renders order summary totals', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        // Grand total should appear
        expect(screen.getByText(/3,210/)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loader while checkout summary is loading', () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      // At first render, loader should be visible
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    beforeEach(() => {
      server.use(...errorCheckoutHandlers);
    });

    it('shows error message when checkout summary fails', async () => {
      render(<OrderReview onValidationError={vi.fn()} />);

      const errorText = await screen.findByText(/failed to load checkout summary/i, {}, { timeout: 10000 });
      expect(errorText).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders section headings', async () => {
      useCheckoutStore.getState().setSelectedAddress('addr-1');
      render(<OrderReview onValidationError={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Shipping Address')).toBeInTheDocument();
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
        // 'Order Summary' may appear multiple times
        const summaries = screen.getAllByText('Order Summary');
        expect(summaries.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
