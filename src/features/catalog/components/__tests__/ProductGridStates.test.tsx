import React from 'react';
import { render, screen, fireEvent } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductGrid } from '../ProductGrid';
import { mockProducts, mockProductInactive } from '@/test/mocks/catalog.mock';
import { useProducts, useSearchProducts, useProductDetails } from '../../hooks/useProducts';

vi.mock('../../hooks/useProducts', () => ({
  useProducts: vi.fn(),
  useSearchProducts: vi.fn(),
  useProductDetails: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
    toString: () => '',
  })),
  usePathname: vi.fn(() => '/products'),
}));

const activeProducts = mockProducts.filter((p) => p.status === 'ACTIVE');

describe('ProductGrid states', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Product Listing', () => {
    it('shows loading skeleton while fetching', () => {
      vi.mocked(useProducts).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid />);
      const skeletons = document.querySelectorAll('[data-testid="product-skeleton"]');
      expect(skeletons.length).toBeGreaterThanOrEqual(6);
    });

    it('renders products when data loads', () => {
      vi.mocked(useProducts).mockReturnValue({
        data: { results: activeProducts, count: activeProducts.length, page: 1, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid />);
      activeProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });

    it('does not render inactive products', () => {
      const mixedProducts = [...activeProducts, mockProductInactive];
      vi.mocked(useProducts).mockReturnValue({
        data: { results: mixedProducts, count: mixedProducts.length, page: 1, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid />);
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
      expect(screen.queryByText(mockProductInactive.name)).not.toBeInTheDocument();
    });

    it('shows empty state when no products exist', () => {
      vi.mocked(useProducts).mockReturnValue({
        data: { results: [], count: 0, page: 1, totalPages: 0 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid />);
      expect(screen.getByRole('heading', { name: /no products/i })).toBeInTheDocument();
    });

    it('shows error state when fetch fails with retry button', () => {
      const mockRefetch = vi.fn();
      vi.mocked(useProducts).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Failed to fetch products'),
        refetch: mockRefetch,
      } as any);

      render(<ProductGrid />);
      expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
      expect(screen.getByText(/try again/i)).toBeInTheDocument();

      fireEvent.click(screen.getByText(/try again/i));
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Search Results', () => {
    it('shows loading state while searching', () => {
      vi.mocked(useSearchProducts).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid searchQuery="phone" />);
      const skeletons = document.querySelectorAll('[data-testid="product-skeleton"]');
      expect(skeletons.length).toBeGreaterThanOrEqual(6);
    });

    it('shows no-result state when no products match', () => {
      vi.mocked(useSearchProducts).mockReturnValue({
        data: { results: [], count: 0, page: 1, totalPages: 0 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid searchQuery="xyznonexistent" />);
      expect(screen.getByRole('heading', { name: /no results/i })).toBeInTheDocument();
    });

    it('displays search results when found', () => {
      vi.mocked(useSearchProducts).mockReturnValue({
        data: { results: [mockProducts[0]], count: 1, page: 1, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid searchQuery="laptop" />);
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    });
  });

  describe('Product Details', () => {
    it('shows loading state for product details', () => {
      vi.mocked(useProductDetails).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid detailSlug="some-slug" />);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('shows error state for invalid slug', () => {
      vi.mocked(useProductDetails).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Product not found'),
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid detailSlug="invalid-slug" />);
      expect(screen.getByRole('heading', { name: /product not found/i })).toBeInTheDocument();
    });

    it('shows empty state for inactive product', () => {
      vi.mocked(useProductDetails).mockReturnValue({
        data: mockProductInactive,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<ProductGrid detailSlug="old-phone" />);
      expect(screen.getByRole('heading', { name: /product unavailable/i })).toBeInTheDocument();
    });
  });
});
