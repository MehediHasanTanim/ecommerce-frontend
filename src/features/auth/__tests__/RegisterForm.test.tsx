import React from 'react';
import { render, screen, fireEvent, waitFor, resetStores } from '@/test/test-utils';
import RegisterPage from '@/app/register/page';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockRegisterResponse } from '@/test/mocks/auth.mock';
import toast from 'react-hot-toast';

vi.mock('@/services/auth.service');

describe('RegisterForm', () => {
  beforeEach(() => {
    resetStores();
    vi.clearAllMocks();
  });

  it('test_register_form_validation', async () => {
    render(<RegisterPage />);
    const registerButton = await screen.findByText('Register', { selector: 'button' });
    fireEvent.click(registerButton);
    
    expect(await screen.findByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Invalid phone number/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('test_register_password_mismatch', async () => {
    render(<RegisterPage />);
    
    fireEvent.change(await screen.findByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '01712345678' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different' } });
    
    const registerButton = await screen.findByText('Register', { selector: 'button' });
    fireEvent.click(registerButton);

    expect(await screen.findByText(/Passwords don't match/i)).toBeInTheDocument();
  });

  it('test_register_submit_handler_called', async () => {
    (authService.register as any).mockResolvedValue(mockRegisterResponse);

    render(<RegisterPage />);
    
    fireEvent.change(await screen.findByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '01712345678' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    const registerButton = await screen.findByText('Register', { selector: 'button' });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Registration successful!');
      expect(vi.mocked(useRouter)().push).toHaveBeenCalledWith('/');
    });
  });

  it('test_register_field_errors_from_api', async () => {
    (authService.register as any).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          email: ['Email already exists']
        }
      }
    });

    render(<RegisterPage />);
    
    const nameInput = await screen.findByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '01712345678' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    
    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });
  });
});
