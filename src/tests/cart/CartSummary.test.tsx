import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, resetStores } from '@/test/test-utils';
import { CartSummary } from '@/components/cart/CartSummary';
import userEvent from '@testing-library/user-event';

const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useSearchParams: () => ({ get: vi.fn() }),
  usePathname: () => '',
}));

describe('CartSummary', () => {
  beforeEach(() => {
    resetStores();
    mockRouterPush.mockClear();
  });

  // CART-UI-001: Totals Calculation Renders
  describe('Totals Calculation', () => {
    it('renders subtotal, discount, and grand total correctly', () => {
      render(
        <CartSummary
          subtotal={250}
          discount={20}
          grandTotal={230}
          itemCount={3}
          couponCode="SAVE20"
        />
      );

      // Verify subtotal
      expect(screen.getByText('Subtotal (3 items)')).toBeInTheDocument();
      expect(screen.getByText('$250.00')).toBeInTheDocument();

      // Verify discount
      expect(screen.getByText(/Discount.*SAVE20/)).toBeInTheDocument();
      expect(screen.getByText('-$20.00')).toBeInTheDocument();

      // Verify grand total
      expect(screen.getByText('$230.00')).toBeInTheDocument();
    });

    it('renders subtotal with correct item count text', () => {
      render(
        <CartSummary
          subtotal={100}
          discount={0}
          grandTotal={100}
          itemCount={1}
        />
      );

      expect(screen.getByText('Subtotal (1 items)')).toBeInTheDocument();
    });

    it('hides discount row when discount is 0', () => {
      render(
        <CartSummary
          subtotal={100}
          discount={0}
          grandTotal={100}
          itemCount={1}
        />
      );

      expect(screen.queryByText(/Discount/)).not.toBeInTheDocument();
    });

    it('shows discount row when discount > 0 without coupon code', () => {
      render(
        <CartSummary
          subtotal={250}
          discount={20}
          grandTotal={230}
          itemCount={3}
        />
      );

      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText('-$20.00')).toBeInTheDocument();
    });

    it('shows shipping text as "Calculated at checkout"', () => {
      render(
        <CartSummary
          subtotal={100}
          discount={0}
          grandTotal={100}
          itemCount={1}
        />
      );

      expect(screen.getByText('Calculated at checkout')).toBeInTheDocument();
    });

    it('displays taxes disclaimer text', () => {
      render(
        <CartSummary
          subtotal={100}
          discount={0}
          grandTotal={100}
          itemCount={1}
        />
      );

      expect(
        screen.getByText('Taxes and shipping calculated at checkout')
      ).toBeInTheDocument();
    });
  });

  describe('Checkout Action', () => {
    it('has a "Proceed to Checkout" button', () => {
      render(
        <CartSummary
          subtotal={100}
          discount={0}
          grandTotal={100}
          itemCount={1}
        />
      );

      expect(
        screen.getByRole('button', { name: /proceed to checkout/i })
      ).toBeInTheDocument();
    });

    it('navigates to /checkout when button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CartSummary
          subtotal={100}
          discount={0}
          grandTotal={100}
          itemCount={1}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /proceed to checkout/i })
      );

      expect(mockRouterPush).toHaveBeenCalledWith('/checkout');
    });

    it('disables checkout button when cart is empty', () => {
      render(
        <CartSummary
          subtotal={0}
          discount={0}
          grandTotal={0}
          itemCount={0}
        />
      );

      expect(
        screen.getByRole('button', { name: /proceed to checkout/i })
      ).toBeDisabled();
    });

    it('disables checkout button when loading', () => {
      render(
        <CartSummary
          subtotal={100}
          discount={0}
          grandTotal={100}
          itemCount={1}
          isLoading={true}
        />
      );

      expect(
        screen.getByRole('button', { name: /proceed to checkout/i })
      ).toBeDisabled();
    });
  });
});
