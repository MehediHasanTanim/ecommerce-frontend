// ============================================================
// Checkout & Orders TypeScript Types
// Matches Swagger API schemas from the backend
// ============================================================

// --------------- Enums / Union Types ---------------

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'cod' | 'sslcommerz' | 'bkash' | 'nagad';

// --------------- Order Item ---------------

export interface OrderItem {
  id: string;
  product_name: string;
  product_slug: string;
  variant_name: string | null;
  sku: string;
  quantity: number;
  unit_price: string; // decimal string
  line_total: string; // unit_price × quantity, decimal string
  image_url: string | null;
}

// --------------- Order ---------------

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: string; // decimal string
  discount: string;
  shipping_fee: string;
  tax: string;
  grand_total: string;
  item_count: number;
  address: OrderAddress | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// --------------- Paginated Orders ---------------

export interface PaginatedOrders {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

// --------------- Order Address ---------------

export interface OrderAddress {
  id: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  postal_code: string;
  address_line: string;
}

// --------------- Checkout Summary ---------------

export interface CheckoutSummaryItem {
  id: string;
  product_name: string;
  product_slug: string;
  variant_name: string | null;
  sku: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  image_url: string | null;
  stock_quantity: number;
}

export interface CheckoutSummary {
  items: CheckoutSummaryItem[];
  subtotal: string;
  discount: string;
  shipping_fee: string;
  tax: string;
  grand_total: string;
  item_count: number;
}

// --------------- Place Order ---------------

export interface PlaceOrderInput {
  address_id: string;
  payment_method: PaymentMethod;
}

export interface PlaceOrderResponse {
  order_id: string;
  order_number: string;
  status: OrderStatus;
}

// --------------- Cancel Order ---------------

export interface CancelOrderResponse {
  status: OrderStatus;
  message: string;
}

// --------------- Order Filters ---------------

export interface OrderFilters {
  status?: OrderStatus | 'all';
  page?: number;
  page_size?: number;
}

// --------------- Status Color Map ---------------

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
