import React from 'react';
import { render, screen, fireEvent, waitFor, resetStores } from '@/test/test-utils';
import { AddressList } from '../components/AddressList';
import { addressService } from '@/services/address.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockAddresses, mockAddress } from '@/test/mocks/address.mock';
import toast from 'react-hot-toast';

vi.mock('@/services/address.service');

describe('AddressManagement', () => {
  beforeEach(() => {
    resetStores();
    vi.clearAllMocks();
    // Mock window.confirm
    window.confirm = vi.fn().mockReturnValue(true);
    (addressService.getAddresses as any).mockResolvedValue(mockAddresses);
  });

  it('test_address_list_renders_items', async () => {
    render(<AddressList />);
    
    expect(await screen.findByText(mockAddresses[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockAddresses[1].name)).toBeInTheDocument();
  });

  it('test_address_empty_state_renders', async () => {
    (addressService.getAddresses as any).mockResolvedValue([]);
    render(<AddressList />);
    
    expect(await screen.findByText(/No addresses found/i)).toBeInTheDocument();
  });

  it('test_add_address_opens_form', async () => {
    render(<AddressList />);
    
    const addButton = await screen.findByRole('button', { name: /Add New Address/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText(/Add New Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Label/i)).toBeInTheDocument();
  });

  it('test_add_address_validation', async () => {
    render(<AddressList />);
    fireEvent.click(await screen.findByRole('button', { name: /Add New Address/i }));
    
    fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));
    
    expect(await screen.findByText(/Label \(e.g. Home, Work\) is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
  });

  it('test_add_address_success_updates_ui', async () => {
    (addressService.createAddress as any).mockResolvedValue(mockAddress);
    render(<AddressList />);
    
    fireEvent.click(await screen.findByRole('button', { name: /Add New Address/i }));
    
    fireEvent.change(screen.getByLabelText(/Label/i), { target: { value: 'Home' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '01712345678' } });
    fireEvent.change(screen.getByLabelText(/Address Line/i), { target: { value: 'Road 1' } });
    fireEvent.change(screen.getByLabelText(/Area/i), { target: { value: 'Uttara' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Dhaka' } });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), { target: { value: '1230' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'Bangladesh' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save Address/i }));

    await waitFor(() => {
      expect(addressService.createAddress).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Address added successfully!');
    });
  });

  it('test_edit_address_prefills_form', async () => {
    render(<AddressList />);
    
    const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]);
    
    expect(screen.getByDisplayValue(mockAddresses[0].name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockAddresses[0].address_line)).toBeInTheDocument();
  });

  it('test_delete_address_requires_confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<AddressList />);
    
    const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this address?');
    expect(addressService.deleteAddress).not.toHaveBeenCalled();
  });

  it('test_delete_address_success_removes_item', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    (addressService.deleteAddress as any).mockResolvedValue(undefined);
    render(<AddressList />);
    
    const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(addressService.deleteAddress).toHaveBeenCalledWith(mockAddresses[0].id, expect.anything());
      expect(toast.success).toHaveBeenCalledWith('Address deleted successfully!');
    });
  });

  it('test_set_default_address_updates_badge', async () => {
    (addressService.setDefaultAddress as any).mockResolvedValue({ ...mockAddresses[1], is_default: true });

    render(<AddressList />);
    
    const setButtons = await screen.findAllByText(/Set Default/i);
    fireEvent.click(setButtons[0]);

    await waitFor(() => {
      expect(addressService.setDefaultAddress).toHaveBeenCalledWith(mockAddresses[1].id, expect.anything());
      expect(toast.success).toHaveBeenCalledWith('Default address updated!');
    });
  });
});
