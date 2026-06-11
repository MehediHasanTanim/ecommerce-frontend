import { axiosInstance } from '@/lib/axios';
import type {
  CheckoutSummary,
  PlaceOrderInput,
  PlaceOrderResponse,
} from '@/types/order';

export const checkoutService = {
  /** GET /api/v1/checkout/summary/ — Fetch checkout summary */
  async getCheckoutSummary(): Promise<CheckoutSummary> {
    const response = await axiosInstance.get<CheckoutSummary>('checkout/summary/');
    return response.data;
  },

  /** POST /api/v1/checkout/place-order/ — Place an order */
  async placeOrder(data: PlaceOrderInput): Promise<PlaceOrderResponse> {
    const response = await axiosInstance.post<PlaceOrderResponse>(
      'checkout/place-order/',
      data
    );
    return response.data;
  },
};
