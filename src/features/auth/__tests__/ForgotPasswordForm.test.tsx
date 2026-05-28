import React from 'react';
import { render, screen, fireEvent, waitFor, resetStores } from '@/test/test-utils';
import ForgotPasswordPage from '@/app/forgot-password/page';
import { authService } from '@/services/auth.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import toast from 'react-hot-toast';

vi.mock('@/services/auth.service');

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    resetStores();
    vi.clearAllMocks();
  });

  it('test_forgot_password_validation', async () => {
    render(<ForgotPasswordPage />);
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));
    
    expect(await screen.findByText(/Email or phone is required/i)).toBeInTheDocument();
  });

  it('test_forgot_password_submit_handler_called', async () => {
    (authService.forgotPassword as any).mockResolvedValue({ detail: 'Success' });

    render(<ForgotPasswordPage />);
    
    fireEvent.change(screen.getByLabelText(/Email or Phone/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    await waitFor(() => {
      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/If an account exists with that identifier/i)).toBeInTheDocument();
    });
  });
});
