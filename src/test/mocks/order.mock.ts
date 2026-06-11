import type { Order, OrderItem, PaginatedOrders } from '@/types/order';

export const mockOrderItem1: OrderItem = {
  id: 'oi-1',
  product_name: 'Wireless Headphones',
  product_slug: 'wireless-headphones',
  variant_name: 'Black / Standard',
  sku: 'WH-BLK-STD',
  quantity: 2,
  unit_price: '1250.00',
  line_total: '2500.00',
  image_url: null,
};

export const mockOrderItem2: OrderItem = {
  id: 'oi-2',
  product_name: 'USB-C Cable',
  product_slug: 'usb-c-cable',
  variant_name: null,
  sku: 'USBC-1M',
  quantity: 1,
  unit_price: '500.00',
  line_total: '500.00',
  image_url: null,
};

export const mockOrder1: Order = {
  id: 'order-uuid-123',
  order_number: 'ORD-20260615-000001',
  status: 'pending',
  payment_status: 'pending',
  payment_method: 'cod',
  subtotal: '2500.00',
  discount: '100.00',
  shipping_fee: '60.00',
  tax: '250.00',
  grand_total: '2710.00',
  item_count: 2,
  address: {
    id: 'addr-1',
    name: 'John Doe',
    phone: '01711223344',
    country: 'Bangladesh',
    city: 'Dhaka',
    area: 'Uttara',
    postal_code: '1230',
    address_line: 'Sector 4, Road 5, House 12',
  },
  items: [mockOrderItem1],
  created_at: '2026-06-15T10:00:00Z',
  updated_at: '2026-06-15T10:00:00Z',
};

export const mockOrder2: Order = {
  id: 'order-uuid-456',
  order_number: 'ORD-20260615-000002',
  status: 'shipped',
  payment_status: 'paid',
  payment_method: 'cod',
  subtotal: '1800.00',
  discount: '0.00',
  shipping_fee: '50.00',
  tax: '150.00',
  grand_total: '2000.00',
  item_count: 1,
  address: {
    id: 'addr-2',
    name: 'Jane Smith',
    phone: '01799887766',
    country: 'Bangladesh',
    city: 'Chittagong',
    area: 'Agrabad',
    postal_code: '4100',
    address_line: 'Plot 10, Block B',
  },
  items: [mockOrderItem2],
  created_at: '2026-06-14T15:30:00Z',
  updated_at: '2026-06-15T08:00:00Z',
};

export const mockOrder3: Order = {
  id: 'order-uuid-789',
  order_number: 'ORD-20260615-000003',
  status: 'delivered',
  payment_status: 'paid',
  payment_method: 'cod',
  subtotal: '5000.00',
  discount: '500.00',
  shipping_fee: '0.00',
  tax: '400.00',
  grand_total: '4900.00',
  item_count: 3,
  address: null,
  items: [mockOrderItem1, mockOrderItem2],
  created_at: '2026-06-10T09:00:00Z',
  updated_at: '2026-06-13T14:00:00Z',
};

export const mockOrdersList: PaginatedOrders = {
  count: 3,
  next: null,
  previous: null,
  results: [mockOrder1, mockOrder2, mockOrder3],
};

export const mockOrderPending: Order = {
  ...mockOrder1,
  status: 'pending',
};

export const mockOrderConfirmed: Order = {
  ...mockOrder1,
  id: 'order-uuid-confirmed',
  order_number: 'ORD-20260615-000004',
  status: 'confirmed',
};

export const mockEmptyOrdersList: PaginatedOrders = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};
