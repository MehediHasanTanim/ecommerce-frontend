import React from 'react';
import { render, screen, fireEvent } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductVariantSelector } from '../ProductVariantSelector';
import {
  mockProduct,
  mockVariants,
  singleVariantProduct,
  allOutOfStockVariants,
} from '@/test/mocks/catalog.mock';

const onVariantChange = vi.fn();

describe('ProductVariantSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all available product variants as buttons', () => {
    render(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={null}
        onVariantChange={onVariantChange}
      />
    );

    mockProduct.variants!.forEach((variant) => {
      const button = screen.getByRole('button', { name: new RegExp(variant.name, 'i') });
      expect(button).toBeInTheDocument();
    });
  });

  it('shows stock quantity for the selected variant', () => {
    render(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={mockVariants[0].id}
        onVariantChange={onVariantChange}
      />
    );

    expect(screen.getByTestId(`variant-stock-${mockVariants[0].id}`)).toHaveTextContent('15');

    const secondStock = screen.queryByTestId(`variant-stock-${mockVariants[1].id}`);
    expect(secondStock).not.toBeInTheDocument();
  });

  it('selecting a variant calls onVariantChange with the variant', () => {
    render(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={null}
        onVariantChange={onVariantChange}
      />
    );

    const variantButton = screen.getByRole('button', { name: /512GB/i });
    fireEvent.click(variantButton);

    expect(onVariantChange).toHaveBeenCalledWith(mockVariants[1]);
  });

  it('disables out-of-stock variants and they cannot be selected', () => {
    render(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={null}
        onVariantChange={onVariantChange}
      />
    );

    const outOfStockButton = screen.getByRole('button', { name: /1TB/i });
    expect(outOfStockButton).toBeDisabled();

    onVariantChange.mockClear();
    fireEvent.click(outOfStockButton);
    expect(onVariantChange).not.toHaveBeenCalledWith(mockVariants[2]);
  });

  it('selects default variant when no variant is selected', () => {
    render(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={null}
        onVariantChange={onVariantChange}
      />
    );

    expect(onVariantChange).toHaveBeenCalledWith(mockProduct.variants![0]);
  });

  it('applies selected variant styling', () => {
    const { rerender } = render(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={mockVariants[0].id}
        onVariantChange={onVariantChange}
      />
    );

    const selectedButton = screen.getByRole('button', { name: /256GB/i });
    expect(selectedButton).toHaveClass(/selected/);

    rerender(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={mockVariants[1].id}
        onVariantChange={onVariantChange}
      />
    );

    const newlySelected = screen.getByRole('button', { name: /512GB/i });
    expect(newlySelected).toHaveClass(/selected/);

    const deselected = screen.getByRole('button', { name: /256GB/i });
    expect(deselected).not.toHaveClass(/selected/);
  });

  it('displays SKU for selected variant', () => {
    render(
      <ProductVariantSelector
        variants={mockProduct.variants!}
        selectedVariantId={mockVariants[0].id}
        onVariantChange={onVariantChange}
      />
    );

    expect(screen.getByText(new RegExp(mockVariants[0].sku, 'i'))).toBeInTheDocument();
  });

  it('handles single variant by auto-selecting with no UI', () => {
    render(
      <ProductVariantSelector
        variants={singleVariantProduct.variants!}
        selectedVariantId={null}
        onVariantChange={onVariantChange}
      />
    );

    expect(onVariantChange).toHaveBeenCalledWith(singleVariantProduct.variants![0]);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows out of stock label for zero-stock variants', () => {
    render(
      <ProductVariantSelector
        variants={allOutOfStockVariants.variants!}
        selectedVariantId={null}
        onVariantChange={onVariantChange}
      />
    );

    allOutOfStockVariants.variants!.forEach((variant) => {
      const button = screen.getByRole('button', { name: new RegExp(variant.name, 'i') });
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/out of stock/i);
    });
  });
});
