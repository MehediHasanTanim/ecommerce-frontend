import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, resetStores } from '@/test/test-utils';
import { CartItem } from '@/components/cart/CartItem';
import { mockCartItemA, mockCartItemB, mockCartItemC } from '@/test/mocks/cart.mock';
import userEvent from '@testing-library/user-event';

describe('CartItem', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Rendering', () => {
    it('renders product name', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    it('renders variant name when present', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(screen.getByText('Red / Large')).toBeInTheDocument();
    });

    it('does not render variant name when null', () => {
      render(
        <CartItem
          item={mockCartItemC}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      // Product C has variant_name: null — text should not appear
      expect(screen.queryByText(/variant/i)).not.toBeInTheDocument();
    });

    it('renders unit price correctly', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      // unit_price is "100.00" as a string
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });

    it('renders line total correctly', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      // line_total is "200.00" as a string
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });

    it('renders remove button with accessible label', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /remove product a from cart/i })
      ).toBeInTheDocument();
    });

    it('links to the product page', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      const links = screen.getAllByRole('link', { name: /product a/i });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', '/products/product-a');
    });
  });

  // Test for data-testid
  it('has correct test id', () => {
    render(
      <CartItem
        item={mockCartItemA}
        onUpdateQuantity={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    expect(screen.getByTestId(`cart-item-${mockCartItemA.id}`)).toBeInTheDocument();
  });

  // CART-UI-006: Remove Item
  describe('Remove Item (CART-UI-006)', () => {
    it('calls onRemove with item id when remove button is clicked', async () => {
      const handleRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={handleRemove}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /remove product a from cart/i })
      );

      expect(handleRemove).toHaveBeenCalledWith(mockCartItemA.id);
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('disables remove button when updating', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
          isUpdating={true}
        />
      );

      expect(
        screen.getByRole('button', { name: /remove product a from cart/i })
      ).toBeDisabled();
    });
  });

  describe('Quantity Controls', () => {
    it('calls onUpdateQuantity with increased quantity when + is clicked', async () => {
      const handleUpdate = vi.fn();
      const user = userEvent.setup();

      render(
        <CartItem
          item={{ ...mockCartItemA, quantity: 1 }}
          onUpdateQuantity={handleUpdate}
          onRemove={vi.fn()}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /increase quantity/i })
      );

      expect(handleUpdate).toHaveBeenCalledWith(mockCartItemA.id, 2);
    });

    it('calls onUpdateQuantity with decreased quantity when - is clicked', async () => {
      const handleUpdate = vi.fn();
      const user = userEvent.setup();

      render(
        <CartItem
          item={{ ...mockCartItemA, quantity: 2 }}
          onUpdateQuantity={handleUpdate}
          onRemove={vi.fn()}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /decrease quantity/i })
      );

      expect(handleUpdate).toHaveBeenCalledWith(mockCartItemA.id, 1);
    });

    it('disables quantity buttons when updating', () => {
      render(
        <CartItem
          item={mockCartItemA}
          onUpdateQuantity={vi.fn()}
          onRemove={vi.fn()}
          isUpdating={true}
        />
      );

      expect(
        screen.getByRole('button', { name: /increase quantity/i })
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: /decrease quantity/i })
      ).toBeDisabled();
    });

    it('does not increase above stock quantity', async () => {
      const handleUpdate = vi.fn();
      const user = userEvent.setup();

      // Item at max stock (quantity 5, stock_quantity 5)
      render(
        <CartItem
          item={mockCartItemC}
          onUpdateQuantity={handleUpdate}
          onRemove={vi.fn()}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /increase quantity/i })
      );

      // Button is disabled, click should not fire
      expect(handleUpdate).not.toHaveBeenCalled();
    });
  });
});
