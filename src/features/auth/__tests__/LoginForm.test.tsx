import React from 'react';
import { render, screen, fireEvent, waitFor, resetStores } from '@/test/test-utils';
import LoginPage from '@/app/login/page';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockLoginResponse } from '@/test/mocks/auth.mock';
import toast from 'react-hot-toast';

vi.mock('@/services/auth.service');

describe('LoginForm', () => {
  beforeEach(() => {
    resetStores();
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    render(<LoginPage />);
    expect(await screen.findByText(/Welcome Back/i)).toBeInTheDocument();
  });

  it('test_login_form_validation', async () => {
    render(<LoginPage />);
    const loginButton = await screen.findByText('Login', { selector: 'button' });
    fireEvent.click(loginButton);
    
    expect(await screen.findByText(/Email or phone is required/i)).toBeInTheDocument();
  });

  it('test_login_submit_handler_called', async () => {
    (authService.login as any).mockResolvedValue(mockLoginResponse);

    render(<LoginPage />);
    
    fireEvent.change(await screen.findByPlaceholderText(/email@example.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    
    const loginButton = await screen.findByText('Login', { selector: 'button' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123',
      });
      expect(vi.mocked(useRouter)().push).toHaveBeenCalledWith('/');
    });
  });

  it('test_login_api_error_display', async () => {
    (authService.login as any).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          message: 'Invalid credentials'
        }
      }
    });

    render(<LoginPage />);
    
    const emailInput = await screen.findByPlaceholderText(/email@example.com/i);
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
