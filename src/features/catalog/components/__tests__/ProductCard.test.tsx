import React from 'react';
import { render, screen } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductCard } from '../ProductCard';
import {
  mockProduct,
  mockProductNoDiscount,
  mockProductOutOfStock,
  mockProductNoBrand,
} from '@/test/mocks/catalog.mock';

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
  })),
  usePathname: vi.fn(() => ''),
}));

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  it('renders product image with alt text', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockProduct.imageUrl);
    expect(img).toHaveAttribute('alt', mockProduct.name);
  });

  it('renders brand name when available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.brand!.name)).toBeInTheDocument();
  });

  it('renders regular price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('renders discount price and strikes through original when discount exists', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(`$${mockProduct.discountPrice!.toFixed(2)}`)).toBeInTheDocument();
    const originalPrice = screen.getByText(`$${mockProduct.price.toFixed(2)}`);
    expect(originalPrice.className).toMatch(/line-through/);
  });

  it('does not render discount price section when no discount exists', () => {
    render(<ProductCard product={mockProductNoDiscount} />);
    expect(screen.getByText(`$${mockProductNoDiscount.price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('renders stock status badge for out of stock', () => {
    render(<ProductCard product={mockProductOutOfStock} />);
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('renders stock status badge for low stock', () => {
    render(<ProductCard product={mockProductNoDiscount} />);
    expect(screen.getByText(/low stock/i)).toBeInTheDocument();
  });

  it('renders category name when available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.category!.name)).toBeInTheDocument();
  });

  it('navigates to product details page on click', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/products/${mockProduct.slug}`);
  });

  it('uses fallback image when imageUrl is missing', () => {
    render(<ProductCard product={mockProductNoDiscount} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src');
    expect(img.getAttribute('src')).not.toBe('');
  });

  it('handles missing brand and category safely', () => {
    render(<ProductCard product={mockProductNoBrand} />);
    expect(screen.getByText(mockProductNoBrand.name)).toBeInTheDocument();
    expect(screen.queryByText(/techpro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/electronics/i)).not.toBeInTheDocument();
  });

  it('renders discount price tag badge when applicable', () => {
    render(<ProductCard product={mockProduct} />);
    const discountAmount = Math.round(
      ((mockProduct.price - mockProduct.discountPrice!) / mockProduct.price) * 100
    );
    expect(screen.getByText(new RegExp(`${discountAmount}%`, 'i'))).toBeInTheDocument();
  });
});
