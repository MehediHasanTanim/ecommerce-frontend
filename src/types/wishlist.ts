// Matches Swagger schema: WishlistItem (read serializer for wishlist items with product summary)
export interface WishlistItem {
  id: string;
  product_id: number;
  product_name: string;
  product_slug: string;
  /** Primary image URL for the product */
  image_url: string | null;
  /** Decimal string from API */
  price: string;
  /** Whether any active variant has stock */
  in_stock: boolean;
  created_at: string;
}

// Matches Swagger schema: WishlistAddRequest
export interface WishlistAddInput {
  product_id: number;
}

/** The API returns a list of WishlistItem directly */
export type Wishlist = WishlistItem[];
