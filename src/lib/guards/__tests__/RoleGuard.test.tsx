import React from 'react';
import { render, screen, resetStores } from '@/test/test-utils';
import { RoleGuard } from '../RoleGuard';
import { useAuthStore } from '@/store/auth-store';
import { mockUser, mockAdmin } from '@/test/mocks/auth.mock';
import { describe, it, expect, beforeEach } from 'vitest';

describe('RoleGuard', () => {
  beforeEach(() => {
    resetStores();
  });

  it('test_admin_content_visible_to_admin', () => {
    useAuthStore.setState({ 
      isAuthenticated: true, 
      user: mockAdmin 
    });
    
    render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Admin Content</div>
      </RoleGuard>
    );
    
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('test_admin_content_hidden_from_customer', () => {
    useAuthStore.setState({ 
      isAuthenticated: true, 
      user: mockUser 
    });
    
    const { container } = render(
      <RoleGuard allowedRoles={['admin']}>
        <div>Admin Content</div>
      </RoleGuard>
    );
    
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('test_fallback_renders_when_unauthorized', () => {
    useAuthStore.setState({ 
      isAuthenticated: true, 
      user: mockUser 
    });
    
    render(
      <RoleGuard 
        allowedRoles={['admin']} 
        fallback={<div>Access Denied</div>}
      >
        <div>Admin Content</div>
      </RoleGuard>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('test_content_hidden_when_unauthenticated', () => {
    useAuthStore.setState({ 
      isAuthenticated: false, 
      user: null 
    });
    
    render(
      <RoleGuard allowedRoles={['admin', 'customer']}>
        <div>Secret Content</div>
      </RoleGuard>
    );
    
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });
});
