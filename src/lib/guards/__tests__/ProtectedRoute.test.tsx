import React from 'react';
import { render, screen, resetStores } from '@/test/test-utils';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    resetStores();
  });

  it('test_loading_state_before_hydration', () => {
    useAuthStore.setState({ _hasHydrated: false });
    render(<ProtectedRoute>Content</ProtectedRoute>);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('test_guest_redirected_to_login', () => {
    const push = vi.fn();
    (useRouter as any).mockReturnValue({ push });
    (usePathname as any).mockReturnValue('/profile');
    
    useAuthStore.setState({ _hasHydrated: true, isAuthenticated: false });
    render(<ProtectedRoute>Content</ProtectedRoute>);
    
    expect(push).toHaveBeenCalledWith('/login?redirect=/profile');
  });

  it('test_authenticated_user_can_view_content', () => {
    useAuthStore.setState({ _hasHydrated: true, isAuthenticated: true });
    render(<ProtectedRoute>Content</ProtectedRoute>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('test_preserves_redirect_url', () => {
    const push = vi.fn();
    (useRouter as any).mockReturnValue({ push });
    (usePathname as any).mockReturnValue('/profile/addresses');
    
    useAuthStore.setState({ _hasHydrated: true, isAuthenticated: false });
    render(<ProtectedRoute>Content</ProtectedRoute>);
    
    expect(push).toHaveBeenCalledWith('/login?redirect=/profile/addresses');
  });
});
