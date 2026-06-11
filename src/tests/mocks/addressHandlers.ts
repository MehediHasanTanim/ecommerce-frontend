import { http, HttpResponse } from 'msw';
import { mockAddresses, mockAddress } from '@/test/mocks/address.mock';
import type { Address } from '@/types/address';

const API_BASE = 'http://localhost:8015/api/v1';

export const addressHandlers = [
  /** GET /api/v1/addresses/ — List addresses */
  http.get(`${API_BASE}/addresses/`, () => {
    return HttpResponse.json<Address[]>(mockAddresses);
  }),

  /** POST /api/v1/addresses/ — Create address */
  http.post(`${API_BASE}/addresses/`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newAddress: Address = {
      ...mockAddress,
      id: `addr-${Date.now()}`,
      name: (body.name as string) || 'New Address',
      phone: (body.phone as string) || '01700000000',
      country: (body.country as string) || 'Bangladesh',
      city: (body.city as string) || 'Dhaka',
      area: (body.area as string) || 'Unknown',
      postal_code: (body.postal_code as string) || '0000',
      address_line: (body.address_line as string) || 'New address line',
      is_default: false,
    };
    return HttpResponse.json<Address>(newAddress, { status: 201 });
  }),

  /** GET /api/v1/addresses/:id/ — Get single address */
  http.get(`${API_BASE}/addresses/:id/`, ({ params }) => {
    const { id } = params;
    const address = mockAddresses.find((a) => a.id === id);
    if (!address) {
      return HttpResponse.json({ detail: 'Address not found' }, { status: 404 });
    }
    return HttpResponse.json<Address>(address);
  }),

  /** PATCH /api/v1/addresses/:id/ — Update address */
  http.patch(`${API_BASE}/addresses/:id/`, () => {
    return HttpResponse.json<Address>(mockAddress);
  }),

  /** DELETE /api/v1/addresses/:id/ — Delete address */
  http.delete(`${API_BASE}/addresses/:id/`, () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];
