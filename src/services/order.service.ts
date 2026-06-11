import { axiosInstance } from '@/lib/axios';
import type {
  Order,
  PaginatedOrders,
  CancelOrderResponse,
  OrderFilters,
} from '@/types/order';

export const orderService = {
  /** GET /api/v1/orders/ — List user orders with pagination & filters */
  async getOrders(filters: OrderFilters = {}): Promise<PaginatedOrders> {
    const params: Record<string, string | number> = {};
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    if (filters.page) {
      params.page = filters.page;
    }
    if (filters.page_size) {
      params.page_size = filters.page_size;
    }
    const response = await axiosInstance.get<PaginatedOrders>('orders/', { params });
    return response.data;
  },

  /** GET /api/v1/orders/{id}/ — Get order details */
  async getOrderDetails(orderId: string): Promise<Order> {
    const response = await axiosInstance.get<Order>(`orders/${orderId}/`);
    return response.data;
  },

  /** POST /api/v1/orders/{id}/cancel/ — Cancel an order */
  async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
    const response = await axiosInstance.post<CancelOrderResponse>(
      `orders/${orderId}/cancel/`
    );
    return response.data;
  },
};
