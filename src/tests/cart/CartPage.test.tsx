import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, resetStores } from '@/test/test-utils';
import CartPage from '@/app/cart/page';
import { server } from '@/tests/mocks/server';
import { emptyCartHandlers, errorCartHandlers } from '@/tests/mocks/cartHandlers';
import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:8015/api/v1';

describe('CartPage', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Page Title', () => {
    it('renders the shopping cart heading', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      });
    });
  });

  // CART-UI-007: Empty Cart State
  describe('Empty Cart State (CART-UI-007)', () => {
    beforeEach(() => {
      server.use(...emptyCartHandlers);
    });

    it('shows "Your cart is empty" when cart has no items', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
      });
    });

    it('shows "Continue Shopping" button in empty state', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /continue shopping/i })
        ).toBeInTheDocument();
      });
    });

    it('shows empty state test id', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(screen.getByTestId('cart-empty-state')).toBeInTheDocument();
      });
    });
  });

  describe('Cart with Items', () => {
    it('renders cart items when cart has products', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText('Product A')).toBeInTheDocument();
      });
    });

    it('renders "Continue Shopping" link in header', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /continue shopping/i })
        ).toBeInTheDocument();
      });
    });

    it('renders the cart summary section', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(screen.getByText('Order Summary')).toBeInTheDocument();
      });
    });

    it('renders coupon section (applied state when cart has a coupon)', async () => {
      render(<CartPage />);

      await waitFor(() => {
        // The mock cart has coupon_code 'SAVE20', so the coupon shows as applied
        expect(
          screen.getByText(/coupon applied/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    beforeEach(() => {
      server.use(...errorCartHandlers);
    });

    it('shows error state when cart fetch fails', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/failed to load cart/i)
        ).toBeInTheDocument();
      });
    });

    it('shows retry button in error state', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /retry/i })
        ).toBeInTheDocument();
      });
    });

    it('has error test id', async () => {
      render(<CartPage />);

      await waitFor(() => {
        expect(screen.getByTestId('cart-error-state')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      // Use a handler that delays the response to show loading state
      server.use(
        http.get(`${API_BASE}/cart/`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ items: [] });
        })
      );
    });

    it('shows loading skeleton while fetching', async () => {
      render(<CartPage />);

      // The skeleton should appear immediately before data loads
      await waitFor(() => {
        expect(screen.getByTestId('cart-skeleton')).toBeInTheDocument();
      });
    });
  });
});
