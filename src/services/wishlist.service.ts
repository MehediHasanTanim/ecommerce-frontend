import { axiosInstance } from '@/lib/axios';
import { WishlistItem, WishlistAddInput } from '@/types/wishlist';

export const wishlistService = {
  /** GET /api/v1/wishlist/ — List Wishlist */
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await axiosInstance.get<WishlistItem[]>('wishlist/');
    return response.data;
  },

  /** POST /api/v1/wishlist/add/ — Add to Wishlist */
  async addWishlistItem(data: WishlistAddInput): Promise<WishlistItem> {
    const response = await axiosInstance.post<WishlistItem>('wishlist/add/', data);
    return response.data;
  },

  /** DELETE /api/v1/wishlist/{product_id}/ — Remove from Wishlist */
  async removeWishlistItem(productId: number): Promise<void> {
    await axiosInstance.delete(`wishlist/${productId}/`);
  },
};
