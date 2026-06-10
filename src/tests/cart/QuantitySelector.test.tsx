import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, resetStores } from '@/test/test-utils';
import { QuantitySelector } from '@/components/cart/QuantitySelector';
import userEvent from '@testing-library/user-event';

describe('QuantitySelector', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Rendering', () => {
    it('renders current quantity value', () => {
      render(
        <QuantitySelector
          quantity={3}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      // The quantity is rendered as text inside the span
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders decrease and increase buttons', () => {
      render(
        <QuantitySelector
          quantity={1}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /decrease quantity/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /increase quantity/i })
      ).toBeInTheDocument();
    });

    it('has correct aria-label for the group', () => {
      render(
        <QuantitySelector
          quantity={2}
          maxStock={5}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(
        screen.getByRole('group', { name: /quantity selector:/i })
      ).toBeInTheDocument();
    });
  });

  // CART-UI-002: Increase Quantity
  describe('Increase Quantity (CART-UI-002)', () => {
    it('calls onIncrease when + button is clicked', async () => {
      const handleIncrease = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantitySelector
          quantity={1}
          maxStock={10}
          onIncrease={handleIncrease}
          onDecrease={vi.fn()}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /increase quantity/i })
      );

      expect(handleIncrease).toHaveBeenCalledTimes(1);
    });

    it('displays updated quantity after increase callback', () => {
      const { rerender } = render(
        <QuantitySelector
          quantity={1}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();

      // Re-render with new quantity (simulating state update)
      rerender(
        <QuantitySelector
          quantity={2}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  // CART-UI-003: Decrease Quantity
  describe('Decrease Quantity (CART-UI-003)', () => {
    it('calls onDecrease when - button is clicked', async () => {
      const handleDecrease = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantitySelector
          quantity={2}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={handleDecrease}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /decrease quantity/i })
      );

      expect(handleDecrease).toHaveBeenCalledTimes(1);
    });
  });

  // CART-UI-004: Minimum Quantity Validation
  describe('Minimum Quantity Validation (CART-UI-004)', () => {
    it('disables decrease button when quantity is 1', () => {
      render(
        <QuantitySelector
          quantity={1}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /decrease quantity/i })
      ).toBeDisabled();
    });

    it('enables decrease button when quantity > 1', () => {
      render(
        <QuantitySelector
          quantity={2}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /decrease quantity/i })
      ).not.toBeDisabled();
    });
  });

  // CART-UI-005: Maximum Stock Validation
  describe('Maximum Stock Validation (CART-UI-005)', () => {
    it('disables increase button when quantity equals maxStock', () => {
      render(
        <QuantitySelector
          quantity={5}
          maxStock={5}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /increase quantity/i })
      ).toBeDisabled();
    });

    it('shows "Maximum stock reached" message when at max', () => {
      render(
        <QuantitySelector
          quantity={5}
          maxStock={5}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(
        screen.getByText(/maximum stock reached/i)
      ).toBeInTheDocument();
    });

    it('does not show max stock message when below max', () => {
      render(
        <QuantitySelector
          quantity={4}
          maxStock={5}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      );

      expect(
        screen.queryByText(/maximum stock reached/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('disables both buttons when loading', () => {
      render(
        <QuantitySelector
          quantity={3}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
          isLoading={true}
        />
      );

      expect(
        screen.getByRole('button', { name: /decrease quantity/i })
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: /increase quantity/i })
      ).toBeDisabled();
    });
  });

  describe('Size Variants', () => {
    it('renders in small size', () => {
      render(
        <QuantitySelector
          quantity={1}
          maxStock={10}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
          size="sm"
        />
      );

      // Small size should still render the quantity
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
