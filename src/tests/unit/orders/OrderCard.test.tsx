import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, resetStores } from '@/test/test-utils';
import { OrderCard } from '@/components/orders/OrderCard';
import { mockOrder1, mockOrder2 } from '@/test/mocks/order.mock';

describe('OrderCard', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('FE-UNIT-011: Order Card Rendering', () => {
    it('renders order number', () => {
      render(<OrderCard order={mockOrder1} />);

      expect(screen.getByText('ORD-20260615-000001')).toBeInTheDocument();
    });

    it('renders order status badge', () => {
      render(<OrderCard order={mockOrder1} />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('renders item count with correct pluralization', () => {
      render(<OrderCard order={mockOrder1} />);

      // mockOrder1 has 2 items
      expect(screen.getByText(/2 items/)).toBeInTheDocument();
    });

    it('renders singular item count for 1 item', () => {
      render(<OrderCard order={mockOrder2} />);

      // mockOrder2 has 1 item
      expect(screen.getByText(/1 item/)).toBeInTheDocument();
    });

    it('renders grand total', () => {
      render(<OrderCard order={mockOrder1} />);

      expect(screen.getByText(/2,710/)).toBeInTheDocument();
    });

    it('renders order date', () => {
      render(<OrderCard order={mockOrder1} />);

      // mockOrder1 created_at: '2026-06-15T10:00:00Z'
      expect(screen.getByText(/15 Jun 2026/)).toBeInTheDocument();
    });

    it('links to the order detail page', () => {
      render(<OrderCard order={mockOrder1} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/orders/order-uuid-123');
    });
  });

  describe('Different Statuses', () => {
    it('renders Shipped status correctly', () => {
      render(<OrderCard order={mockOrder2} />);

      expect(screen.getByText('Shipped')).toBeInTheDocument();
    });

    it('renders different grand total for different orders', () => {
      render(<OrderCard order={mockOrder2} />);

      expect(screen.getByText(/2,000/)).toBeInTheDocument();
    });
  });
});
