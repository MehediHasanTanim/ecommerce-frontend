import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SearchInput } from '../SearchInput';

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: (key: string) => mockSearchParams.get(key),
    toString: () => mockSearchParams.toString(),
  })),
  usePathname: vi.fn(() => '/search'),
}));

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders input field', () => {
    render(<SearchInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('updates value while typing', () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'phone' } });

    expect(screen.getByDisplayValue('phone')).toBeInTheDocument();
  });

  it('updates URL query param with search keyword after debounce', async () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'smartphone' } });
    vi.advanceTimersByTime(600);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('q=smartphone'),
        { scroll: false }
      );
    });
  });

  it('calls search handler on form submit', () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'laptop' } });

    // The form submit handler reads value from state, which fireEvent.change
    // updates via the component's handleChange -> setValue
    fireEvent.submit(screen.getByRole('search'));

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('q=laptop'),
      { scroll: false }
    );
  });

  it('initializes input from URL search param', () => {
    mockSearchParams = new URLSearchParams('q=existing-search');
    render(<SearchInput />);
    expect(screen.getByRole('textbox')).toHaveValue('existing-search');
  });

  it('does not call router for whitespace-only input', async () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '   ' } });
    vi.advanceTimersByTime(600);

    // Wait long enough for any pending async effects
    await vi.waitFor(() => {
      // The only calls should be from the initial mount effect (none for q)
      // Any call with an empty or whitespace-only q should not happen
      const calls = mockReplace.mock.calls;
      const searchCalls = calls.filter(
        (call: [string]) => (call[0] as string).includes('q=')
      );
      expect(searchCalls.length).toBe(0);
    });
  });

  it('trims extra spaces before searching', () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '  laptop pro  ' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('q=laptop+pro'),
      { scroll: false }
    );
  });

  it('preserves existing filters when search query changes', async () => {
    mockSearchParams = new URLSearchParams('category=electronics&sort=price_asc');
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'tablet' } });
    vi.advanceTimersByTime(600);

    await waitFor(() => {
      const replaceUrl = mockReplace.mock.calls[0][0] as string;
      expect(replaceUrl).toContain('q=tablet');
      expect(replaceUrl).toContain('category=electronics');
      expect(replaceUrl).toContain('sort=price_asc');
    });
  });

  it('debounces search action by configured delay', async () => {
    render(<SearchInput debounceMs={800} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test' } });

    vi.advanceTimersByTime(400);
    expect(mockReplace).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  it('resets page to 1 when search changes', async () => {
    mockSearchParams = new URLSearchParams('page=3');
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'new-search' } });
    vi.advanceTimersByTime(600);

    await waitFor(() => {
      const replaceUrl = mockReplace.mock.calls[0][0] as string;
      expect(replaceUrl).not.toContain('page=3');
    });
  });
});
