import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/auth-store';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  });

  it('should handle login', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' };
    useAuthStore.getState().login(user, 'access_token', 'refresh_token');
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe('access_token');
  });

  it('should handle logout', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' };
    useAuthStore.getState().login(user, 'access_token', 'refresh_token');
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});
