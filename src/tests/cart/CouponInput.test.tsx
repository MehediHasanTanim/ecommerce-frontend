import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, resetStores } from '@/test/test-utils';
import { CouponInput } from '@/components/cart/CouponInput';
import userEvent from '@testing-library/user-event';

describe('CouponInput', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Empty State', () => {
    it('renders coupon code input field', () => {
      render(<CouponInput onApply={vi.fn()} />);

      expect(
        screen.getByPlaceholderText('Coupon code')
      ).toBeInTheDocument();
    });

    it('renders Apply button', () => {
      render(<CouponInput onApply={vi.fn()} />);

      expect(
        screen.getByRole('button', { name: /apply/i })
      ).toBeInTheDocument();
    });

    it('disables Apply button when input is empty', () => {
      render(<CouponInput onApply={vi.fn()} />);

      expect(
        screen.getByRole('button', { name: /apply/i })
      ).toBeDisabled();
    });

    it('enables Apply button when code is entered', async () => {
      const user = userEvent.setup();
      render(<CouponInput onApply={vi.fn()} />);

      await user.type(screen.getByPlaceholderText('Coupon code'), 'SAVE20');

      expect(
        screen.getByRole('button', { name: /apply/i })
      ).not.toBeDisabled();
    });
  });

  describe('Apply Coupon', () => {
    it('calls onApply with entered code on form submit', async () => {
      const handleApply = vi.fn();
      const user = userEvent.setup();
      render(<CouponInput onApply={handleApply} />);

      await user.type(screen.getByPlaceholderText('Coupon code'), 'SAVE20');
      await user.click(screen.getByRole('button', { name: /apply/i }));

      expect(handleApply).toHaveBeenCalledWith('SAVE20');
      expect(handleApply).toHaveBeenCalledTimes(1);
    });

    it('clears the input after applying', async () => {
      const handleApply = vi.fn();
      const user = userEvent.setup();
      render(<CouponInput onApply={handleApply} />);

      await user.type(screen.getByPlaceholderText('Coupon code'), 'SAVE20');
      await user.click(screen.getByRole('button', { name: /apply/i }));

      // Input should be cleared after apply
      expect(screen.getByPlaceholderText('Coupon code')).toHaveValue('');
    });

    it('disables input and button when loading', () => {
      render(<CouponInput onApply={vi.fn()} isLoading={true} />);

      expect(
        screen.getByPlaceholderText('Coupon code')
      ).toBeDisabled();
    });
  });

  describe('Applied Coupon State', () => {
    it('shows applied coupon code when applied', () => {
      render(
        <CouponInput
          onApply={vi.fn()}
          onRemove={vi.fn()}
          appliedCode="SAVE20"
          discountAmount={20}
        />
      );

      expect(
        screen.getByText(/coupon applied/i)
      ).toBeInTheDocument();
      expect(screen.getByText('SAVE20')).toBeInTheDocument();
    });

    it('shows discount amount when provided', () => {
      render(
        <CouponInput
          onApply={vi.fn()}
          onRemove={vi.fn()}
          appliedCode="SAVE20"
          discountAmount={20}
        />
      );

      expect(
        screen.getByText(/you saved \$20\.00/i)
      ).toBeInTheDocument();
    });

    it('shows remove button when onRemove is provided', () => {
      const handleRemove = vi.fn();
      render(
        <CouponInput
          onApply={vi.fn()}
          onRemove={handleRemove}
          appliedCode="SAVE20"
        />
      );

      expect(
        screen.getByRole('button', { name: /remove coupon/i })
      ).toBeInTheDocument();
    });

    it('calls onRemove when remove button is clicked', async () => {
      const handleRemove = vi.fn();
      const user = userEvent.setup();
      render(
        <CouponInput
          onApply={vi.fn()}
          onRemove={handleRemove}
          appliedCode="SAVE20"
        />
      );

      await user.click(
        screen.getByRole('button', { name: /remove coupon/i })
      );

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('does not show input field when coupon is applied', () => {
      render(
        <CouponInput
          onApply={vi.fn()}
          appliedCode="SAVE20"
        />
      );

      expect(
        screen.queryByPlaceholderText('Coupon code')
      ).not.toBeInTheDocument();
    });
  });
});
