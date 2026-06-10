import { axiosInstance } from '@/lib/axios';
import { Cart, AddToCartInput, UpdateCartItemInput, ApplyCouponInput, ValidateCouponInput, ValidateCouponResponse } from '@/types/cart';

export const cartService = {
  /** GET /api/v1/cart/ — View Cart */
  async getCart(): Promise<Cart> {
    const response = await axiosInstance.get<Cart>('cart/');
    return response.data;
  },

  /** POST /api/v1/cart/add/ — Add Item to Cart */
  async addToCart(data: AddToCartInput): Promise<Cart> {
    const response = await axiosInstance.post<Cart>('cart/add/', data);
    return response.data;
  },

  /** PUT /api/v1/cart/items/{item_id}/ — Update Item Quantity */
  async updateCartItem(itemId: string, data: UpdateCartItemInput): Promise<Cart> {
    const response = await axiosInstance.put<Cart>(`cart/items/${itemId}/`, data);
    return response.data;
  },

  /** DELETE /api/v1/cart/items/{item_id}/delete/ — Remove Item from Cart */
  async removeCartItem(itemId: string): Promise<Cart> {
    const response = await axiosInstance.delete<Cart>(`cart/items/${itemId}/delete/`);
    return response.data;
  },

  /** POST /api/v1/cart/coupons/apply/ — Apply Coupon to Cart */
  async applyCoupon(data: ApplyCouponInput): Promise<Cart> {
    const response = await axiosInstance.post<Cart>('cart/coupons/apply/', data);
    return response.data;
  },

  /** DELETE /api/v1/cart/coupons/remove/ — Remove Coupon from Cart */
  async removeCoupon(): Promise<Cart> {
    const response = await axiosInstance.delete<Cart>('cart/coupons/remove/');
    return response.data;
  },

  /** POST /api/v1/cart/coupons/validate/ — Validate Coupon */
  async validateCoupon(data: ValidateCouponInput): Promise<ValidateCouponResponse> {
    const response = await axiosInstance.post<ValidateCouponResponse>('cart/coupons/validate/', data);
    return response.data;
  },
};
