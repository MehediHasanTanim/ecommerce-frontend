import type { CheckoutSummary, PlaceOrderResponse } from '@/types/order';

export const mockCheckoutSummaryItem = {
  id: 'csi-1',
  product_name: 'Wireless Headphones',
  product_slug: 'wireless-headphones',
  variant_name: 'Black / Standard',
  sku: 'WH-BLK-STD',
  quantity: 2,
  unit_price: '1250.00',
  line_total: '2500.00',
  image_url: null,
  stock_quantity: 10,
};

export const mockCheckoutSummaryItem2 = {
  id: 'csi-2',
  product_name: 'USB-C Cable',
  product_slug: 'usb-c-cable',
  variant_name: null,
  sku: 'USBC-1M',
  quantity: 1,
  unit_price: '500.00',
  line_total: '500.00',
  image_url: null,
  stock_quantity: 50,
};

export const mockCheckoutSummary: CheckoutSummary = {
  items: [mockCheckoutSummaryItem, mockCheckoutSummaryItem2],
  subtotal: '3000.00',
  discount: '100.00',
  shipping_fee: '60.00',
  tax: '250.00',
  grand_total: '3210.00',
  item_count: 3,
};

export const mockCheckoutSummaryNoDiscount: CheckoutSummary = {
  items: [mockCheckoutSummaryItem],
  subtotal: '2500.00',
  discount: '0.00',
  shipping_fee: '0.00',
  tax: '0.00',
  grand_total: '2500.00',
  item_count: 2,
};

export const mockCheckoutSummaryEmpty: CheckoutSummary = {
  items: [],
  subtotal: '0.00',
  discount: '0.00',
  shipping_fee: '0.00',
  tax: '0.00',
  grand_total: '0.00',
  item_count: 0,
};

export const mockPlaceOrderResponse: PlaceOrderResponse = {
  order_id: 'order-uuid-123',
  order_number: 'ORD-20260615-000001',
  status: 'pending',
};
