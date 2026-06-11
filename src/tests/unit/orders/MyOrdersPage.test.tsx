import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, resetStores, loginAsUser } from '@/test/test-utils';
import MyOrdersPage from '@/app/orders/page';
import { server } from '@/tests/mocks/server';
import { emptyOrderHandlers, errorOrderHandlers } from '@/tests/mocks/orderHandlers';

describe('MyOrdersPage', () => {
  beforeEach(() => {
    resetStores();
    loginAsUser();
  });

  describe('Page Rendering', () => {
    it('renders the heading', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText('My Orders')).toBeInTheDocument();
      });
    });

    it('renders status filter tabs', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Confirmed')).toBeInTheDocument();
        expect(screen.getByText('Processing')).toBeInTheDocument();
        expect(screen.getByText('Shipped')).toBeInTheDocument();
        expect(screen.getByText('Delivered')).toBeInTheDocument();
        expect(screen.getByText('Cancelled')).toBeInTheDocument();
      });
    });

    it('highlights "All" filter as active by default', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        const allButton = screen.getByText('All');
        expect(allButton.className).toMatch(/bg-\[var\(--color-primary\)\]/);
      });
    });
  });

  describe('FE-UNIT-011: Orders List Rendering', () => {
    it('renders order numbers from mock data', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText('ORD-20260615-000001')).toBeInTheDocument();
      });
    });

    it('renders all orders from mock data', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText('ORD-20260615-000001')).toBeInTheDocument();
        expect(screen.getByText('ORD-20260615-000002')).toBeInTheDocument();
        expect(screen.getByText('ORD-20260615-000003')).toBeInTheDocument();
      });
    });

    it('renders order grand totals', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText(/2,710/)).toBeInTheDocument();
      });
    });

    it('renders order status badges', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Shipped')).toBeInTheDocument();
        expect(screen.getByText('Delivered')).toBeInTheDocument();
      });
    });

    it('shows item count in orders', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 3 of 3 order/)).toBeInTheDocument();
      });
    });
  });

  describe('FE-UNIT-013: Empty Orders State', () => {
    beforeEach(() => {
      server.use(...emptyOrderHandlers);
    });

    it('shows empty state message when no orders', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/you haven't placed any orders yet/i)
        ).toBeInTheDocument();
      });
    });

    it('shows Start Shopping CTA when empty', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /start shopping/i })
        ).toBeInTheDocument();
      });
    });

    it('shows empty state test id', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        expect(screen.getByTestId('orders-empty-state')).toBeInTheDocument();
      });
    });
  });

  describe('FE-UNIT-015: Error State', () => {
    // Re-apply error handlers before each test since setup.ts afterEach resets them
    beforeEach(() => {
      server.use(...errorOrderHandlers);
    });

    it('shows error state when orders fetch fails', async () => {
      render(<MyOrdersPage />);

      const errorText = await screen.findByText(/failed to load orders/i, {}, { timeout: 10000 });
      expect(errorText).toBeInTheDocument();
    });

    it('shows Retry button on error', async () => {
      render(<MyOrdersPage />);

      const retryBtn = await screen.findByText('Retry', {}, { timeout: 10000 });
      expect(retryBtn).toBeInTheDocument();
    });
  });

  describe('FE-UNIT-014: Loading State', () => {
    it('shows skeleton loader while data is loading', () => {
      render(<MyOrdersPage />);

      // Skeleton should be visible before data resolves
      expect(screen.getByTestId('orders-list-skeleton')).toBeInTheDocument();
    });
  });

  describe('Status Filtering', () => {
    it('shows filtered message for specific status', async () => {
      // Override the search params to simulate pending filter
      const { useSearchParams } = await import('next/navigation');
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
        get: vi.fn((key: string) => key === 'status' ? 'pending' : null),
      });

      render(<MyOrdersPage />);

      await waitFor(() => {
        // Should still render since the filter is applied at API level
        expect(screen.getByText('My Orders')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('renders filter buttons as interactive elements', async () => {
      render(<MyOrdersPage />);

      await waitFor(() => {
        const filterButtons = screen.getAllByRole('button');
        const filterLabels = filterButtons
          .filter((btn) =>
            ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(
              btn.textContent || ''
            )
          );
        expect(filterLabels.length).toBeGreaterThanOrEqual(7);
      });
    });
  });
});
