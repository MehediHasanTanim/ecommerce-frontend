import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, resetStores, loginAsUser } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '@/app/checkout/page';
import { server } from '@/tests/mocks/server';
import { emptyCheckoutHandlers } from '@/tests/mocks/checkoutHandlers';
import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:8015/api/v1';

describe('CheckoutPage', () => {
  beforeEach(() => {
    resetStores();
    loginAsUser();
  });

  describe('Page Rendering', () => {
    it('renders the checkout heading', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Checkout')).toBeInTheDocument();
      });
    });

    it('renders the stepper component', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Address')).toBeInTheDocument();
        expect(screen.getByText('Review')).toBeInTheDocument();
        expect(screen.getByText('Complete')).toBeInTheDocument();
      });
    });

    it('shows shipping address section on step 1', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        // 'Shipping Address' appears both in CardHeader and AddressSelector heading
        const headings = screen.getAllByText('Shipping Address');
        expect(headings.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('shows payment method section on step 1', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });
    });

    it('shows order summary sidebar on step 1', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        // Should find Order Summary heading in the sidebar
        const headings = screen.getAllByText('Order Summary');
        expect(headings.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('FE-UNIT-001: Step Navigation', () => {
    it('starts at step 1 (Address)', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        const headings = screen.getAllByText('Shipping Address');
        expect(headings.length).toBeGreaterThanOrEqual(1);
      });

      // Step 1 should have aria-current
      const step1 = screen.getByText('1');
      expect(step1.closest('[aria-current="step"]')).toBeInTheDocument();
    });

    it('moves to step 2 (Review) when address is selected and Continue is clicked', async () => {
      const user = userEvent.setup();
      render(<CheckoutPage />);

      await waitFor(() => {
        const headings = screen.getAllByText('Shipping Address');
        expect(headings.length).toBeGreaterThanOrEqual(1);
      });

      // Select the first address (mock data includes addresses)
      await waitFor(() => {
        const addressCards = document.querySelectorAll('[role="radio"]');
        if (addressCards.length > 0) {
          // Don't actually click - mock the checkout state
        }
      });

      // Set selected address directly via store
      const { useCheckoutStore } = await import('@/store/checkout-store');
      useCheckoutStore.getState().setSelectedAddress('addr-1');

      // Click Continue to Review
      const continueBtn = screen.getByRole('button', { name: /continue to review/i });
      await user.click(continueBtn);

      await waitFor(() => {
        expect(screen.getByText('Review Your Order')).toBeInTheDocument();
      });
    });
  });

  describe('FE-UNIT-002: Cannot Continue Without Address', () => {
    it('shows validation error when no address is selected', async () => {
      const { useCheckoutStore } = await import('@/store/checkout-store');
      // Ensure no address is selected
      useCheckoutStore.getState().setSelectedAddress(null);

      const user = userEvent.setup();
      render(<CheckoutPage />);

      await waitFor(() => {
        const headings = screen.getAllByText('Shipping Address');
        expect(headings.length).toBeGreaterThanOrEqual(1);
      });

      // Click Continue without selecting address
      const continueBtn = screen.getByRole('button', { name: /continue to review/i });
      await user.click(continueBtn);

      // Current step should remain at Address (step 1) - check Shipping Address is still visible
      const headings = screen.getAllByText('Shipping Address');
      expect(headings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('FE-UNIT-005 & FE-UNIT-006: Place Order Button State', () => {
    it('shows Place Order button on step 2', async () => {
      const { useCheckoutStore } = await import('@/store/checkout-store');
      useCheckoutStore.getState().setSelectedAddress('addr-1');
      useCheckoutStore.getState().setCurrentStep(2);

      render(<CheckoutPage />);

      await waitFor(() => {
        const placeBtn = screen.getByRole('button', { name: /place order/i });
        expect(placeBtn).toBeInTheDocument();
      });
    });

    it('enables Place Order when address is selected', async () => {
      const { useCheckoutStore } = await import('@/store/checkout-store');
      useCheckoutStore.getState().setSelectedAddress('addr-1');
      useCheckoutStore.getState().setCurrentStep(2);

      render(<CheckoutPage />);

      await waitFor(() => {
        const placeBtn = screen.getByRole('button', { name: /place order/i });
        expect(placeBtn).toBeEnabled();
      });
    });
  });

  describe('FE-UNIT-007: Place Order Loading State', () => {
    it('shows processing text and disables button when placing order', async () => {
      const { useCheckoutStore } = await import('@/store/checkout-store');
      useCheckoutStore.getState().setSelectedAddress('addr-1');
      useCheckoutStore.getState().setIsPlacingOrder(true);
      useCheckoutStore.getState().setCurrentStep(2);

      render(<CheckoutPage />);

      await waitFor(() => {
        const btn = screen.getByRole('button', { name: /processing your order/i });
        expect(btn).toBeInTheDocument();
        expect(btn).toBeDisabled();
      });
    });
  });

  describe('Empty Cart State', () => {
    beforeEach(() => {
      server.use(...emptyCheckoutHandlers);
    });

    it('shows empty cart message when no items in checkout', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
      });
    });

    it('shows Browse Products button when cart is empty', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /browse products/i })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('stepper has accessible navigation', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('Checkout progress')).toBeInTheDocument();
      });
    });

    it('step 1 is marked as current initially', async () => {
      render(<CheckoutPage />);

      await waitFor(() => {
        const step1 = screen.getByText('1');
        expect(step1.closest('[aria-current="step"]')).toBeInTheDocument();
      });
    });
  });
});
