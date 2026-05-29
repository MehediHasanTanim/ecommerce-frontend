import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductFilters } from '../ProductFilters';
import { mockCategories, mockBrands } from '@/test/mocks/catalog.mock';

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
  usePathname: vi.fn(() => '/products'),
}));

function renderFilters() {
  return render(
    <ProductFilters
      categories={mockCategories}
      brands={mockBrands}
    />
  );
}

describe('ProductFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('renders all filter sections', () => {
    renderFilters();
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
    expect(screen.getByText(/brands/i)).toBeInTheDocument();
    expect(screen.getByText(/price range/i)).toBeInTheDocument();
    expect(screen.getByText(/availability/i)).toBeInTheDocument();
  });

  it('selecting a category updates URL query params', async () => {
    renderFilters();
    const categoryCheckbox = screen.getByLabelText(mockCategories[0].name);
    fireEvent.click(categoryCheckbox);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining(`category=${mockCategories[0].slug}`),
        { scroll: false }
      );
    });
  });

  it('selecting a brand updates URL query params', async () => {
    renderFilters();
    const brandCheckbox = screen.getByLabelText(mockBrands[0].name);
    fireEvent.click(brandCheckbox);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining(`brand=${mockBrands[0].slug}`),
        { scroll: false }
      );
    });
  });

  it('entering min price updates query state', async () => {
    renderFilters();
    const minInput = screen.getByPlaceholderText(/min/i);
    fireEvent.change(minInput, { target: { value: '100' } });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('minPrice=100'),
        { scroll: false }
      );
    });
  });

  it('entering max price updates query state', async () => {
    renderFilters();
    const maxInput = screen.getByPlaceholderText(/max/i);
    fireEvent.change(maxInput, { target: { value: '500' } });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('maxPrice=500'),
        { scroll: false }
      );
    });
  });

  it('selecting availability updates query state', async () => {
    renderFilters();
    const inStockOption = screen.getByLabelText(/in stock/i);
    fireEvent.click(inStockOption);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('availability=in_stock'),
        { scroll: false }
      );
    });
  });

  it('clear all filters removes query params', async () => {
    mockSearchParams = new URLSearchParams('category=electronics&brand=techpro&minPrice=100');
    renderFilters();
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
      const url = mockReplace.mock.calls[0][0] as string;
      expect(url.startsWith('/products')).toBe(true);
      expect(url).not.toContain('category=');
      expect(url).not.toContain('brand=');
      expect(url).not.toContain('minPrice=');
    });
  });

  it('existing URL query params pre-populate selected filters', () => {
    mockSearchParams = new URLSearchParams('category=electronics&brand=techpro');
    renderFilters();

    const categoryCheckbox = screen.getByLabelText(mockCategories[0].name) as HTMLInputElement;
    const brandCheckbox = screen.getByLabelText(mockBrands[0].name) as HTMLInputElement;

    expect(categoryCheckbox.checked).toBe(true);
    expect(brandCheckbox.checked).toBe(true);
  });

  it('multiple filters can be applied independently', async () => {
    renderFilters();

    const categoryCheckbox = screen.getByLabelText(mockCategories[0].name);
    fireEvent.click(categoryCheckbox);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenLastCalledWith(
        expect.stringContaining(`category=${mockCategories[0].slug}`),
        { scroll: false }
      );
    });

    const brandCheckbox = screen.getByLabelText(mockBrands[0].name);
    fireEvent.click(brandCheckbox);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenLastCalledWith(
        expect.stringContaining(`brand=${mockBrands[0].slug}`),
        { scroll: false }
      );
    });
  });

  it('resets page to 1 when filters change', async () => {
    mockSearchParams = new URLSearchParams('page=3');
    renderFilters();

    const categoryCheckbox = screen.getByLabelText(mockCategories[0].name);
    fireEvent.click(categoryCheckbox);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.not.stringContaining('page=3'),
        { scroll: false }
      );
    });
  });

  it('does not duplicate existing search query param when clearing', () => {
    mockSearchParams = new URLSearchParams('q=phone&category=electronics');
    renderFilters();

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    expect(mockReplace).toHaveBeenCalledWith(
      '/products?q=phone',
      { scroll: false }
    );
  });
});
