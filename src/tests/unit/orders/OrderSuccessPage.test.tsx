import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, resetStores, loginAsUser } from '@/test/test-utils';
import OrderSuccessPage from '@/app/order-success/[orderId]/page';
import { server } from '@/tests/mocks/server';
import { singleOrderHandlers } from '@/tests/mocks/orderHandlers';

// Use the globally mocked useParams from setup.ts
import { useParams } from 'next/navigation';

describe('OrderSuccessPage', () => {
  beforeEach(() => {
    resetStores();
    loginAsUser();
    server.use(...singleOrderHandlers);
    // Set the useParams mock to return the correct orderId
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ orderId: 'order-uuid-123' });
  });

  describe('FE-UNIT-009: Success Page Renders Data', () => {
    it('renders the success message', async () => {
      render(<OrderSuccessPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/order placed successfully/i)
        ).toBeInTheDocument();
      });
    });

    it('renders the order number', async () => {
      render(<OrderSuccessPage />);

      await waitFor(() => {
        expect(
          screen.getByText('ORD-20260615-000001')
        ).toBeInTheDocument();
      });
    });

    it('renders the order status', async () => {
      render(<OrderSuccessPage />);

      await waitFor(() => {
        expect(screen.getByText('Pending')).toBeInTheDocument();
      });
    });

    it('renders the grand total', async () => {
      render(<OrderSuccessPage />);

      await waitFor(() => {
        expect(screen.getByText(/2,710/)).toBeInTheDocument();
      });
    });

    it('renders a success icon', async () => {
      render(<OrderSuccessPage />);

      await waitFor(() => {
        // Check for the check circle icon (lucide renders SVG)
        const successIcon = document.querySelector('.text-green-500');
        expect(successIcon).toBeInTheDocument();
      });
    });
  });

  describe('FE-UNIT-010: Action Buttons', () => {
    it('renders View Order button', async () => {
      render(<OrderSuccessPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /view order/i })
        ).toBeInTheDocument();
      });
    });

    it('renders Continue Shopping button', async () => {
      render(<OrderSuccessPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /continue shopping/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loader while fetching order details', () => {
      render(<OrderSuccessPage />);

      // At first render, loader should appear
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Error Fallback', () => {
    it('shows fallback when order data cannot be loaded', async () => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ orderId: 'non-existent-id' });
      render(<OrderSuccessPage />);

      await waitFor(() => {
        // Should still show the success heading even if details fail
        expect(
          screen.getByText(/order placed/i)
        ).toBeInTheDocument();
      });
    });
  });
});
