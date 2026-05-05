import { User, LoginResponse, RegisterResponse } from '@/types/auth';

export const mockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  phone: '01711223344',
  full_name: 'Test User',
  role: 'customer',
  is_verified: true,
  is_active: true,
  created_at: '2023-01-01T00:00:00Z',
};

export const mockAdmin: User = {
  ...mockUser,
  id: '123e4567-e89b-12d3-a456-426614174001',
  email: 'admin@example.com',
  role: 'admin',
};

export const mockLoginResponse: LoginResponse = {
  access: 'access-token',
  refresh: 'refresh-token',
  user: mockUser,
};

export const mockRegisterResponse: RegisterResponse = {
  access: 'access-token',
  refresh: 'refresh-token',
  user: mockUser,
};
