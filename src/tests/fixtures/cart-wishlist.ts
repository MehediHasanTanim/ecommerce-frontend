/**
 * Cart fixture data for Playwright regression tests.
 * Matches the Swagger Cart/CartItem schemas.
 */
export const cartFixtures = {
  empty: {
    id: 'cart-uuid-empty',
    user: null,
    guest_token: 'guest-token-regression',
    items: [],
    subtotal: 0,
    discount: 0,
    grand_total: 0,
    item_count: 0,
    coupon: null,
    coupon_code: null,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
  },

  singleItem: {
    id: 'cart-uuid-single',
    user: 'user-uuid-1',
    guest_token: null,
    items: [
      {
        id: 'item-uuid-reg-1',
        product_id: 101,
        product_name: 'iPhone 16 Pro',
        product_slug: 'iphone-16-pro',
        variant_id: 201,
        variant_name: '256GB / Black',
        sku: 'IP16P-256-BLK',
        attributes: { storage: '256GB', color: 'Black' },
        quantity: 1,
        unit_price: '999.00',
        line_total: '999.00',
        stock_quantity: 20,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
    ],
    subtotal: 999,
    discount: 0,
    grand_total: 999,
    item_count: 1,
    coupon: null,
    coupon_code: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },

  twoItems: {
    id: 'cart-uuid-two',
    user: 'user-uuid-1',
    guest_token: null,
    items: [
      {
        id: 'item-uuid-reg-1',
        product_id: 101,
        product_name: 'iPhone 16 Pro',
        product_slug: 'iphone-16-pro',
        variant_id: 201,
        variant_name: '256GB / Black',
        sku: 'IP16P-256-BLK',
        attributes: { storage: '256GB', color: 'Black' },
        quantity: 1,
        unit_price: '999.00',
        line_total: '999.00',
        stock_quantity: 20,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 'item-uuid-reg-2',
        product_id: 102,
        product_name: 'AirPods Pro',
        product_slug: 'airpods-pro',
        variant_id: 202,
        variant_name: null,
        sku: 'APP-WHT',
        attributes: null,
        quantity: 1,
        unit_price: '249.00',
        line_total: '249.00',
        stock_quantity: 15,
        created_at: '2024-01-15T11:00:00Z',
        updated_at: '2024-01-15T11:00:00Z',
      },
    ],
    subtotal: 1248,
    discount: 0,
    grand_total: 1248,
    item_count: 2,
    coupon: null,
    coupon_code: null,
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
  },
};

export const productFixtures = {
  iphone16Pro: {
    id: 101,
    name: 'iPhone 16 Pro',
    price: 999,
    stock: 20,
    variant_id: 201,
  },
  airpodsPro: {
    id: 102,
    name: 'AirPods Pro',
    price: 249,
    stock: 15,
    variant_id: 202,
  },
};

export const wishlistFixtures = {
  empty: [],

  singleItem: [
    {
      id: 'wish-uuid-reg-1',
      product_id: 101,
      product_name: 'iPhone 16 Pro',
      product_slug: 'iphone-16-pro',
      image_url: 'https://example.com/images/iphone-16-pro.jpg',
      price: '999.00',
      in_stock: true,
      created_at: '2024-01-10T08:00:00Z',
    },
  ],
};
