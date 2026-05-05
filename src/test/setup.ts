import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach } from 'vitest';

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
}));

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
