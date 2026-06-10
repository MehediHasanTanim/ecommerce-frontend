import '@testing-library/jest-dom';
import React from 'react';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/tests/mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers and stores after each test
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

// Close MSW server after all tests
afterAll(() => server.close());

// Mock next/navigation
vi.mock('next/navigation', () => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  };
  const searchParams = {
    get: vi.fn(),
  };
  return {
    useRouter: vi.fn(() => router),
    useSearchParams: vi.fn(() => searchParams),
    usePathname: vi.fn(() => ''),
  };
});

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return React.createElement('img', rest);
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => null,
}));

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
