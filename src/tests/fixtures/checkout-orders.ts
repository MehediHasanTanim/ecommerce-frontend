/**
 * Checkout & Orders fixture data for Playwright regression tests.
 * Matches Swagger schemas from the backend API.
 */

export const checkoutFixtures = {
  /** Full checkout summary with items, discount, shipping, tax */
  summary: {
    items: [
      {
        id: 'csi-reg-1',
        product_name: 'iPhone 16 Pro',
        product_slug: 'iphone-16-pro',
        variant_name: '256GB / Black',
        sku: 'IP16P-256-BLK',
        quantity: 2,
        unit_price: '1200.00',
        line_total: '2400.00',
        image_url: null,
        stock_quantity: 10,
      },
      {
        id: 'csi-reg-2',
        product_name: 'AirPods Pro',
        product_slug: 'airpods-pro',
        variant_name: null,
        sku: 'APP-WHT',
        quantity: 1,
        unit_price: '250.00',
        line_total: '250.00',
        image_url: null,
        stock_quantity: 50,
      },
    ],
    subtotal: '2650.00',
    discount: '100.00',
    shipping_fee: '60.00',
    tax: '250.00',
    grand_total: '2860.00',
    item_count: 3,
  },

  /** Checkout summary with no discount for edge-case validation */
  noDiscount: {
    items: [
      {
        id: 'csi-reg-1',
        product_name: 'iPhone 16 Pro',
        product_slug: 'iphone-16-pro',
        variant_name: '256GB / Black',
        sku: 'IP16P-256-BLK',
        quantity: 2,
        unit_price: '1250.00',
        line_total: '2500.00',
        image_url: null,
        stock_quantity: 10,
      },
    ],
    subtotal: '2500.00',
    discount: '0.00',
    shipping_fee: '60.00',
    tax: '250.00',
    grand_total: '2810.00',
    item_count: 2,
  },

  /** Place order success response */
  placeOrderSuccess: {
    order_id: 'order-uuid-reg-001',
    order_number: 'ORD-20260620-000001',
    status: 'pending' as const,
  },

  /** Place order — insufficient stock error */
  placeOrderStockError: {
    detail: 'Insufficient stock for some items.',
  },

  /** Place order — empty cart error */
  placeOrderEmptyCartError: {
    detail: 'Cart is empty. Please add items before checkout.',
  },

  /** Place order — invalid address error */
  placeOrderInvalidAddressError: {
    detail: 'Address invalid or not found.',
  },
};

export const ordersFixtures = {
  /** List of orders for /orders page */
  list: {
    count: 2,
    next: null,
    previous: null,
    results: [
      {
        id: 'order-uuid-reg-001',
        order_number: 'ORD-20260620-000001',
        status: 'pending' as const,
        payment_status: 'pending' as const,
        payment_method: 'cod' as const,
        subtotal: '2500.00',
        discount: '100.00',
        shipping_fee: '60.00',
        tax: '250.00',
        grand_total: '2710.00',
        item_count: 2,
        address: {
          id: 'addr-1',
          name: 'Home',
          phone: '01712345678',
          country: 'Bangladesh',
          city: 'Dhaka',
          area: 'Uttara',
          postal_code: '1230',
          address_line: 'Sector 4, Road 1',
        },
        items: [
          {
            id: 'oi-reg-1',
            product_name: 'iPhone 16 Pro',
            product_slug: 'iphone-16-pro',
            variant_name: '256GB / Black',
            sku: 'IP16P-256-BLK',
            quantity: 2,
            unit_price: '1250.00',
            line_total: '2500.00',
            image_url: null,
          },
        ],
        created_at: '2026-06-20T10:00:00Z',
        updated_at: '2026-06-20T10:00:00Z',
      },
      {
        id: 'order-uuid-reg-002',
        order_number: 'ORD-20260620-000002',
        status: 'shipped' as const,
        payment_status: 'paid' as const,
        payment_method: 'cod' as const,
        subtotal: '1800.00',
        discount: '0.00',
        shipping_fee: '50.00',
        tax: '150.00',
        grand_total: '2000.00',
        item_count: 1,
        address: null,
        items: [
          {
            id: 'oi-reg-2',
            product_name: 'AirPods Pro',
            product_slug: 'airpods-pro',
            variant_name: null,
            sku: 'APP-WHT',
            quantity: 1,
            unit_price: '1800.00',
            line_total: '1800.00',
            image_url: null,
          },
        ],
        created_at: '2026-06-19T15:30:00Z',
        updated_at: '2026-06-20T08:00:00Z',
      },
    ],
  },

  /** Empty orders list */
  empty: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },

  /** Single order detail (for /orders/:id) */
  detail: {
    id: 'order-uuid-reg-001',
    order_number: 'ORD-20260620-000001',
    status: 'pending' as const,
    payment_status: 'pending' as const,
    payment_method: 'cod' as const,
    subtotal: '2400.00',
    discount: '100.00',
    shipping_fee: '60.00',
    tax: '240.00',
    grand_total: '2600.00',
    item_count: 2,
    address: {
      id: 'addr-1',
      name: 'Home',
      phone: '01712345678',
      country: 'Bangladesh',
      city: 'Dhaka',
      area: 'Uttara',
      postal_code: '1230',
      address_line: 'Sector 4, Road 1',
    },
    items: [
      {
        id: 'oi-reg-1',
        product_name: 'iPhone 16 Pro',
        product_slug: 'iphone-16-pro',
        variant_name: '256GB / Black',
        sku: 'IP16P-256-BLK',
        quantity: 2,
        unit_price: '1200.00',
        line_total: '2400.00',
        image_url: null,
      },
    ],
    created_at: '2026-06-20T10:00:00Z',
    updated_at: '2026-06-20T10:00:00Z',
  },

  /** Order detail for a confirmed order (cancel button visible) */
  detailConfirmed: {
    id: 'order-uuid-reg-003',
    order_number: 'ORD-20260620-000003',
    status: 'confirmed' as const,
    payment_status: 'pending' as const,
    payment_method: 'cod' as const,
    subtotal: '5000.00',
    discount: '0.00',
    shipping_fee: '0.00',
    tax: '400.00',
    grand_total: '5400.00',
    item_count: 1,
    address: null,
    items: [
      {
        id: 'oi-reg-3',
        product_name: 'MacBook Air',
        product_slug: 'macbook-air',
        variant_name: null,
        sku: 'MBA-M1',
        quantity: 1,
        unit_price: '5000.00',
        line_total: '5000.00',
        image_url: null,
      },
    ],
    created_at: '2026-06-19T09:00:00Z',
    updated_at: '2026-06-19T10:00:00Z',
  },
};
