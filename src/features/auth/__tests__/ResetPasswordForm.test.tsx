import React from 'react';
import { render, screen, fireEvent, waitFor, resetStores } from '@/test/test-utils';
import ResetPasswordPage from '@/app/reset-password/page';
import { authService } from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import toast from 'react-hot-toast';

vi.mock('@/services/auth.service');

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    resetStores();
    vi.clearAllMocks();
  });

  it('test_reset_password_token_missing_state', () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);

    render(<ResetPasswordPage />);
    
    expect(screen.getByText(/Invalid Link/i)).toBeInTheDocument();
  });

  it('test_reset_password_validation', async () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue('valid-token'),
    } as any);

    render(<ResetPasswordPage />);
    
    const resetButton = await screen.findByRole('button', { name: /Reset Password/i });
    fireEvent.click(resetButton);
    
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('test_reset_password_submit_handler_called', async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as any);
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue('valid-token'),
    } as any);
    (authService.resetPassword as any).mockResolvedValue({ detail: 'Success' });

    render(<ResetPasswordPage />);
    
    fireEvent.change(screen.getByLabelText(/^New Password$/i), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newpassword123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith({
        token: 'valid-token',
        password: 'newpassword123',
        confirm_password: 'newpassword123',
      });
      expect(toast.success).toHaveBeenCalledWith('Password reset successfully!');
      expect(push).toHaveBeenCalledWith('/login');
    });
  });
});
