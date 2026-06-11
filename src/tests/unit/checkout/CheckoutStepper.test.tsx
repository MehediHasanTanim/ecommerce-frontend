import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, resetStores } from '@/test/test-utils';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';

describe('CheckoutStepper', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Rendering', () => {
    it('renders all three step labels', () => {
      render(<CheckoutStepper currentStep={1} />);

      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('renders with correct aria label for navigation', () => {
      render(<CheckoutStepper currentStep={1} />);

      const nav = screen.getByRole('navigation', { name: /checkout progress/i });
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Step States', () => {
    it('highlights the current step with aria-current', () => {
      render(<CheckoutStepper currentStep={1} />);

      const currentStep = screen.getByText('1');
      expect(currentStep.closest('[aria-current="step"]')).toBeInTheDocument();
    });

    it('shows step 2 as current when currentStep is 2', () => {
      render(<CheckoutStepper currentStep={2} />);

      const currentEl = screen.getByText('2');
      expect(currentEl.closest('[aria-current="step"]')).toBeInTheDocument();
    });

    it('shows step 3 as current when currentStep is 3', () => {
      render(<CheckoutStepper currentStep={3} />);

      const currentEl = screen.getByText('3');
      expect(currentEl.closest('[aria-current="step"]')).toBeInTheDocument();
    });

    it('shows check icon for completed steps', () => {
      render(<CheckoutStepper currentStep={2} />);

      // Step 1 should be completed and show a check icon
      const step1Container = screen.getByText('Address').closest('li');
      expect(step1Container).toBeInTheDocument();
    });

    it('does not set aria-current on non-current steps', () => {
      render(<CheckoutStepper currentStep={1} />);

      // Only step 1 should have aria-current
      const step1Text = screen.getByText('1');
      expect(step1Text.closest('[aria-current="step"]')).toBeInTheDocument();

      // Steps 2 and 3 should NOT have aria-current
      const step2Text = screen.getByText('2');
      expect(step2Text.closest('[aria-current]')).toBeNull();

      const step3Text = screen.getByText('3');
      expect(step3Text.closest('[aria-current]')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('uses nav element with aria-label', () => {
      render(<CheckoutStepper currentStep={1} />);
      expect(screen.getByLabelText('Checkout progress')).toBeInTheDocument();
    });

    it('renders ordered list for steps', () => {
      render(<CheckoutStepper currentStep={1} />);

      const list = document.querySelector('ol');
      expect(list).toBeInTheDocument();
    });
  });
});
