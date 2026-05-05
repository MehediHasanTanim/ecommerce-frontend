import { Address } from '@/types/address';

export const mockAddress: Address = {
  id: 'addr-1',
  user: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Home',
  phone: '01711223344',
  country: 'Bangladesh',
  city: 'Dhaka',
  area: 'Uttara',
  postal_code: '1230',
  address_line: 'Sector 4, Road 5',
  is_default: true,
  type: 'shipping',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

export const mockAddresses: Address[] = [
  mockAddress,
  {
    ...mockAddress,
    id: 'addr-2',
    name: 'Office',
    is_default: false,
    type: 'billing',
  },
];
