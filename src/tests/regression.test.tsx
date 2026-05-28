import React from 'react';
import { render, screen } from '@/test/test-utils';
import Home from '@/app/page';
import RootLayout from '@/app/layout';
import GlobalError from '@/app/global-error';
import { axiosInstance } from '@/lib/axios';
import { vi, describe, it, expect } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
  }),
}));

describe('Regression Tests', () => {
  describe('Home Page', () => {
    it('loads successfully and displays welcome message', () => {
      render(<Home />);
      expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
      expect(screen.getByText(/E-Shop/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Shop Now/i })).toBeInTheDocument();
    });
  });

  describe('Global Layout', () => {
    it('renders header and footer', () => {
      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );
      
      // Header should contain the brand name
      expect(screen.getByText('E-Shop')).toBeInTheDocument();
      
      // Navigation links
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      
      // Footer should contain copyright info
      expect(screen.getByText(/E-Shop. All rights reserved./i)).toBeInTheDocument();
    });
  });

  describe('API Configuration', () => {
    it('uses the correct base URL from environment or default', () => {
      const expectedBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8015/api/v1/';
      expect(axiosInstance.defaults.baseURL).toBe(expectedBaseURL);
    });
  });

  describe('Error Boundary', () => {
    it('renders fallback page when triggered', () => {
      const mockReset = vi.fn();
      const mockError = new Error('Test Error') as Error & { digest?: string };
      
      render(<GlobalError error={mockError} reset={mockReset} />);
      
      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(screen.getByText(/A critical error occurred/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
    });
  });
});
