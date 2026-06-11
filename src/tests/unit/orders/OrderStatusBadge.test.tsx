import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, resetStores } from '@/test/test-utils';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import type { OrderStatus } from '@/types/order';

describe('OrderStatusBadge', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('FE-UNIT-012: Status Badge Rendering', () => {
    const statuses: { status: OrderStatus; label: string }[] = [
      { status: 'pending', label: 'Pending' },
      { status: 'confirmed', label: 'Confirmed' },
      { status: 'processing', label: 'Processing' },
      { status: 'shipped', label: 'Shipped' },
      { status: 'delivered', label: 'Delivered' },
      { status: 'cancelled', label: 'Cancelled' },
    ];

    statuses.forEach(({ status, label }) => {
      it(`renders "${label}" text for "${status}" status`, () => {
        render(<OrderStatusBadge status={status} />);

        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it('renders Pending status with correct visual styling', () => {
      render(<OrderStatusBadge status="pending" />);

      const badge = screen.getByText('Pending');
      expect(badge).toBeInTheDocument();
      // Verify it has proper CSS classes (yellow theme for pending)
      expect(badge.className).toMatch(/bg-yellow/);
    });

    it('renders Delivered status with green styling', () => {
      render(<OrderStatusBadge status="delivered" />);

      const badge = screen.getByText('Delivered');
      expect(badge.className).toMatch(/bg-green/);
    });

    it('renders Cancelled status with red styling', () => {
      render(<OrderStatusBadge status="cancelled" />);

      const badge = screen.getByText('Cancelled');
      expect(badge.className).toMatch(/bg-red/);
    });

    it('renders Confirmed status with blue styling', () => {
      render(<OrderStatusBadge status="confirmed" />);

      const badge = screen.getByText('Confirmed');
      expect(badge.className).toMatch(/bg-blue/);
    });

    it('renders Processing status with purple styling', () => {
      render(<OrderStatusBadge status="processing" />);

      const badge = screen.getByText('Processing');
      expect(badge.className).toMatch(/bg-purple/);
    });

    it('renders Shipped status with orange styling', () => {
      render(<OrderStatusBadge status="shipped" />);

      const badge = screen.getByText('Shipped');
      expect(badge.className).toMatch(/bg-orange/);
    });

    it('accepts and applies custom className', () => {
      render(<OrderStatusBadge status="pending" className="custom-class" />);

      const badge = screen.getByText('Pending');
      expect(badge.className).toMatch(/custom-class/);
    });
  });
});
