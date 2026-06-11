import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, resetStores } from '@/test/test-utils';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { useCheckoutStore } from '@/store/checkout-store';

describe('AddressSelector', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Rendering', () => {
    it('renders the section heading', async () => {
      render(<AddressSelector />);

      await waitFor(() => {
        // 'Shipping Address' appears both in parent and inside AddressSelector
        // The AddressSelector itself renders an h3 with 'Shipping Address'
        const heading = screen.getByRole('heading', { name: /shipping address/i });
        expect(heading).toBeInTheDocument();
      });
    });

    it('renders "Add Address" button', async () => {
      render(<AddressSelector />);

      await waitFor(() => {
        // The button has aria-label="Add new address"
        const btn = screen.getByRole('button', { name: /add new address/i });
        expect(btn).toBeInTheDocument();
      });
    });

    it('renders address cards from mock data', async () => {
      render(<AddressSelector />);

      await waitFor(() => {
        // Address name from mock data
        expect(screen.getByText('Home')).toBeInTheDocument();
      });
    });

    it('renders address phone numbers', async () => {
      render(<AddressSelector />);

      await waitFor(() => {
        // Phone numbers from mock data (there could be multiple)
        const phones = screen.getAllByText('01711223344');
        expect(phones.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('marks default address with "Default" badge', async () => {
      render(<AddressSelector />);

      await waitFor(() => {
        expect(screen.getByText('Default')).toBeInTheDocument();
      });
    });
  });

  describe('Address Selection', () => {
    it('calls onSelect when an address is clicked', async () => {
      const { userEvent } = await import('@testing-library/user-event');
      const user = userEvent.setup();
      render(<AddressSelector />);

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });

      // Get all address radio buttons
      const addressCards = screen.getAllByRole('radio');
      expect(addressCards.length).toBeGreaterThan(0);

      // Click the first address
      await user.click(addressCards[0]);

      // Verify the checkout store was updated
      const state = useCheckoutStore.getState();
      expect(state.selectedAddressId).toBe('addr-1');
    });
  });

  describe('Accessibility', () => {
    it('renders address list as a radiogroup', async () => {
      render(<AddressSelector />);

      await waitFor(() => {
        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toBeInTheDocument();
      });
    });

    it('radiogroup has accessible label', async () => {
      render(<AddressSelector />);

      await waitFor(() => {
        const radioGroup = screen.getByRole('radiogroup', {
          name: /select shipping address/i,
        });
        expect(radioGroup).toBeInTheDocument();
      });
    });
  });
});
