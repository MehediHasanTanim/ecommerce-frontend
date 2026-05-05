export type AddressType = 'shipping' | 'billing';

export interface Address {
  id: string;
  user: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  postal_code: string;
  address_line: string;
  type: AddressType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type AddressCreateInput = Omit<Address, 'id' | 'user' | 'created_at' | 'updated_at'>;
export type AddressUpdateInput = Partial<AddressCreateInput>;
