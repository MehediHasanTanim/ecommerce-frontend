// Matches Swagger schema: CartItem (read serializer for a single cart line item)
export interface CartItem {
  id: string;
  product_id: number;
  product_name: string;
  product_slug: string;
  variant_id: number | null;
  variant_name: string | null;
  sku: string;
  attributes: unknown;
  quantity: number;
  /** Snapshot of variant effective_price at add time (decimal string) */
  unit_price: string;
  /** unit_price × quantity, denormalized for fast reads (decimal string) */
  line_total: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

// Matches Swagger schema: Cart (full cart read serializer)
export interface Cart {
  id: string;
  user: string | null;
  guest_token: string | null;
  items: CartItem[];
  subtotal: number;
  discount: number;
  grand_total: number;
  item_count: number;
  coupon: number | null;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
}

// Matches Swagger schema: AddItemRequest
export interface AddToCartInput {
  variant_id: number;
  quantity?: number;
}

// Matches Swagger schema: UpdateQuantityRequest
export interface UpdateCartItemInput {
  quantity: number;
}

// Matches Swagger schema: CouponApplyRequest
export interface ApplyCouponInput {
  code: string;
}

// Matches Swagger schema: CouponValidateRequest
export interface ValidateCouponInput {
  code: string;
}

// Matches Swagger schema: CouponValidateResponse
export interface ValidateCouponResponse {
  valid: boolean;
  discount?: string;
  discount_type?: string;
  message?: string;
}
