import { Address } from '@/types/address';

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    user: 'test-user-id',
    name: 'Home',
    phone: '01712345678',
    country: 'Bangladesh',
    city: 'Dhaka',
    area: 'Uttara',
    postal_code: '1230',
    address_line: 'Sector 4, Road 1',
    type: 'shipping',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'addr-2',
    user: 'test-user-id',
    name: 'Work',
    phone: '01812345678',
    country: 'Bangladesh',
    city: 'Dhaka',
    area: 'Gulshan',
    postal_code: '1212',
    address_line: 'Road 12, House 34',
    type: 'shipping',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const newAddress = {
  name: 'Office',
  phone: '01912345678',
  country: 'Bangladesh',
  city: 'Dhaka',
  area: 'Banani',
  postal_code: '1213',
  address_line: 'Block C, Road 17',
  type: 'shipping',
  is_default: false,
};
