import React from 'react';
import { render, screen, fireEvent, waitFor, resetStores } from '@/test/test-utils';
import ProfilePage from '@/app/profile/page';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth-store';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockUser, mockAdmin } from '@/test/mocks/auth.mock';
import toast from 'react-hot-toast';

vi.mock('@/services/user.service');

describe('ProfileForm', () => {
  beforeEach(() => {
    resetStores();
    vi.clearAllMocks();
    useAuthStore.setState({ isAuthenticated: true, user: mockUser, _hasHydrated: true });
    (userService.getMe as any).mockResolvedValue(mockUser);
  });

  it('renders profile data correctly', async () => {
    render(<ProfilePage />);
    
    // Wait for loader to disappear and content to appear
    expect(await screen.findByDisplayValue(mockUser.full_name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.phone)).toBeInTheDocument();
  });

  it('test_profile_update_validation', async () => {
    render(<ProfilePage />);
    
    const nameInput = await screen.findByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    
    const updateButton = await screen.findByRole('button', { name: /Update Profile/i });
    fireEvent.click(updateButton);
    
    expect(await screen.findByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
  });

  it('test_profile_update_submit_handler_called', async () => {
    (userService.updateProfile as any).mockResolvedValue({ ...mockUser, full_name: 'New Name' });

    render(<ProfilePage />);
    
    const nameInput = await screen.findByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    
    const updateButton = await screen.findByRole('button', { name: /Update Profile/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(userService.updateProfile).toHaveBeenCalledWith({
        full_name: 'New Name',
        phone: mockUser.phone,
      });
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
    });
  });

  it('test_change_password_validation', async () => {
    render(<ProfilePage />);
    
    const changeButton = await screen.findByRole('button', { name: /Change Password/i });
    fireEvent.click(changeButton);
    
    expect(await screen.findByText(/Old password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/New password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('test_change_password_submit_handler_called', async () => {
    (userService.changePassword as any).mockResolvedValue({ detail: 'Success' });

    render(<ProfilePage />);
    
    fireEvent.change(await screen.findByLabelText(/Old Password/i), { target: { value: 'oldpass123' } });
    fireEvent.change(screen.getByLabelText(/^New Password$/i), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newpass123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    await waitFor(() => {
      expect(userService.changePassword).toHaveBeenCalledWith({
        old_password: 'oldpass123',
        new_password: 'newpass123',
        confirm_password: 'newpass123',
      });
      expect(toast.success).toHaveBeenCalledWith('Password changed successfully!');
    });
  });
});
