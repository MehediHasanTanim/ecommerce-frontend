import { axiosInstance } from '@/lib/axios';
import { Address, AddressCreateInput, AddressUpdateInput } from '@/types/address';

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const response = await axiosInstance.get<Address[]>('addresses/');
    return response.data;
  },

  async createAddress(data: AddressCreateInput): Promise<Address> {
    const response = await axiosInstance.post<Address>('addresses/', data);
    return response.data;
  },

  async getAddress(id: string): Promise<Address> {
    const response = await axiosInstance.get<Address>(`addresses/${id}/`);
    return response.data;
  },

  async updateAddress(id: string, data: AddressUpdateInput): Promise<Address> {
    const response = await axiosInstance.patch<Address>(`addresses/${id}/`, data);
    return response.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await axiosInstance.delete(`addresses/${id}/`);
  },

  async setDefaultAddress(id: string): Promise<Address> {
    const response = await axiosInstance.patch<Address>(`addresses/${id}/default/`);
    return response.data;
  },
};
