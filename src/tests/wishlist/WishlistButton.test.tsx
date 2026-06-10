import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, resetStores } from '@/test/test-utils';
import { WishlistItemCard } from '@/components/wishlist/WishlistItem';
import {
  mockWishlistItem1,
  mockWishlistItem2,
  mockWishlistItemOutOfStock,
} from '@/test/mocks/wishlist.mock';
import userEvent from '@testing-library/user-event';

describe('WishlistItemCard', () => {
  beforeEach(() => {
    resetStores();
  });

  describe('Rendering', () => {
    it('renders product name', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    it('renders product price correctly', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      // price is "99.99" as string
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('links to the product page', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      const links = screen.getAllByRole('link', { name: /product a/i });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', '/products/product-a');
    });

    it('has correct test id', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(
        screen.getByTestId(`wishlist-item-${mockWishlistItem1.product_id}`)
      ).toBeInTheDocument();
    });
  });

  describe('In Stock Status', () => {
    it('shows "In Stock" badge when product is in stock', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    it('shows "Out of Stock" badge when product is out of stock', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItemOutOfStock}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      // There are two "Out of Stock" elements (overlay + badge)
      const outOfStockElements = screen.getAllByText('Out of Stock');
      expect(outOfStockElements.length).toBeGreaterThanOrEqual(1);
    });

    it('shows "Out of Stock" overlay image when product is out of stock', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItemOutOfStock}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      // There should be two "Out of Stock" elements: badge + overlay
      const outOfStockElements = screen.getAllByText('Out of Stock');
      expect(outOfStockElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  // WISH-UI-001: Move to Cart
  describe('Move to Cart (WISH-UI-001)', () => {
    it('renders "Move to Cart" button', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /move product a to cart/i })
      ).toBeInTheDocument();
    });

    it('calls onMoveToCart with product_id when clicked', async () => {
      const handleMoveToCart = vi.fn();
      const user = userEvent.setup();

      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={handleMoveToCart}
          onRemove={vi.fn()}
        />
      );

      await user.click(
        screen.getByRole('button', { name: /move product a to cart/i })
      );

      expect(handleMoveToCart).toHaveBeenCalledWith(101);
      expect(handleMoveToCart).toHaveBeenCalledTimes(1);
    });

    it('disables move to cart button when item is out of stock', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItemOutOfStock}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', {
          name: /move out of stock product to cart/i,
        })
      ).toBeDisabled();
    });

    it('disables move to cart button when isRemoving', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
          isRemoving={true}
        />
      );

      expect(
        screen.getByRole('button', { name: /move product a to cart/i })
      ).toBeDisabled();
    });

    it('shows loading state on move to cart button', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
          isMovingToCart={true}
        />
      );

      expect(
        screen.getByRole('button', { name: /move product a to cart/i })
      ).toBeDisabled();
    });
  });

  // WISH-UI-002: Remove from Wishlist
  describe('Remove from Wishlist (WISH-UI-002)', () => {
    it('renders remove button with accessible label', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem2}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /remove product b from wishlist/i })
      ).toBeInTheDocument();
    });

    it('calls onRemove with product_id when clicked', async () => {
      const handleRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <WishlistItemCard
          item={mockWishlistItem2}
          onMoveToCart={vi.fn()}
          onRemove={handleRemove}
        />
      );

      await user.click(
        screen.getByRole('button', {
          name: /remove product b from wishlist/i,
        })
      );

      expect(handleRemove).toHaveBeenCalledWith(102);
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('disables remove button when isRemoving', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
          isRemoving={true}
        />
      );

      expect(
        screen.getByRole('button', {
          name: /remove product a from wishlist/i,
        })
      ).toBeDisabled();
    });

    it('disables remove button when isMovingToCart', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
          isMovingToCart={true}
        />
      );

      expect(
        screen.getByRole('button', {
          name: /remove product a from wishlist/i,
        })
      ).toBeDisabled();
    });
  });

  describe('Image Handling', () => {
    it('renders with image_url when present', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem1}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      const img = screen.getByRole('img', { name: /product a/i });
      expect(img).toBeInTheDocument();
    });

    it('uses placeholder when image_url is null', () => {
      render(
        <WishlistItemCard
          item={mockWishlistItem2}
          onMoveToCart={vi.fn()}
          onRemove={vi.fn()}
        />
      );

      const img = screen.getByRole('img', { name: /product b/i });
      expect(img).toBeInTheDocument();
    });
  });
});
