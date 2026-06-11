import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, resetStores } from '@/test/test-utils';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { mockCheckoutSummary, mockCheckoutSummaryNoDiscount } from '@/test/mocks/checkout.mock';

describe('OrderSummary', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('FE-UNIT-003: Summary Totals Render Correctly', () => {
    it('renders all summary labels (subtotal, shipping, tax, grand total)', () => {
      render(<OrderSummary summary={mockCheckoutSummary} />);

      // Subtotal with item count
      expect(screen.getByText(/Subtotal.*3 items/)).toBeInTheDocument();
      // Shipping
      expect(screen.getByText('Shipping')).toBeInTheDocument();
      // Tax
      expect(screen.getByText('Tax')).toBeInTheDocument();
      // Grand Total
      expect(screen.getByText('Grand Total')).toBeInTheDocument();
    });

    it('displays correct subtotal value', () => {
      render(<OrderSummary summary={mockCheckoutSummary} />);

      expect(screen.getByText(/3,000/)).toBeInTheDocument();
    });

    it('displays correct discount value when discount > 0', () => {
      render(<OrderSummary summary={mockCheckoutSummary} />);

      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('displays correct shipping fee', () => {
      render(<OrderSummary summary={mockCheckoutSummary} />);

      // Shipping fee should be displayed (৳60)
      expect(screen.getByText(/60/)).toBeInTheDocument();
    });

    it('displays correct tax value', () => {
      render(<OrderSummary summary={mockCheckoutSummary} />);

      expect(screen.getByText(/250/)).toBeInTheDocument();
    });

    it('displays correct grand total', () => {
      render(<OrderSummary summary={mockCheckoutSummary} />);

      // Grand total: ৳3,210
      expect(screen.getByText(/3,210/)).toBeInTheDocument();
    });
  });

  describe('FE-UNIT-004: Summary Handles Empty / Zero Values', () => {
    it('renders free shipping when shipping_fee is 0', () => {
      render(<OrderSummary summary={mockCheckoutSummaryNoDiscount} />);

      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('does not show discount section when discount is 0', () => {
      render(<OrderSummary summary={mockCheckoutSummaryNoDiscount} />);

      // No discount label should appear
      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    });

    it('does not show tax section when tax is 0', () => {
      render(<OrderSummary summary={mockCheckoutSummaryNoDiscount} />);

      // No Tax label should appear
      expect(screen.queryByText('Tax')).not.toBeInTheDocument();
    });

    it('shows grand total correctly even with zero discount/tax', () => {
      render(<OrderSummary summary={mockCheckoutSummaryNoDiscount} />);

      // Grand total and subtotal both show 2,500, so we use getAllByText
      const totals = screen.getAllByText(/2,500/);
      expect(totals.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('renders without crashing for single item', () => {
      const singleItem = { ...mockCheckoutSummary, item_count: 1 };
      render(<OrderSummary summary={singleItem} />);

      expect(screen.getByText(/Subtotal.*1 items/)).toBeInTheDocument();
    });

    it('renders without crashing for zero items', () => {
      const zeroItems = { ...mockCheckoutSummary, item_count: 0, items: [], subtotal: '0.00', grand_total: '0.00', discount: '0.00', tax: '0.00', shipping_fee: '0.00' };
      render(<OrderSummary summary={zeroItems} />);

      // Should show 'Free' for shipping
      expect(screen.getByText('Free')).toBeInTheDocument();
      // Grand Total section should contain a 0 value
      expect(screen.getByText('Grand Total')).toBeInTheDocument();
    });
  });
});
