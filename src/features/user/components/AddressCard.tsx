'use client';

import React from 'react';
import { Address } from '@/types/address';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MapPin, Phone, Trash2, Edit2, Check } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isMutating?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isMutating
}) => {
  return (
    <Card className={`relative p-4 border-2 transition-all ${address.is_default ? 'border-[var(--color-primary)]' : 'border-transparent'}`}>
      {address.is_default && (
        <div className="absolute top-2 right-2 bg-[var(--color-primary)] text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Check size={10} /> Default
        </div>
      )}
      
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-1 p-2 bg-gray-100 rounded-full text-gray-600">
          <MapPin size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{address.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{address.type} Address</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-6">
        <p>{address.address_line}</p>
        <p>{address.area}, {address.city} - {address.postal_code}</p>
        <p>{address.country}</p>
        <div className="flex items-center gap-2 text-gray-800 font-medium pt-1">
          <Phone size={14} /> {address.phone}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 gap-2"
          onClick={() => onEdit(address)}
          disabled={isMutating}
        >
          <Edit2 size={14} /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          onClick={() => {
            if (confirm('Are you sure you want to delete this address?')) {
              onDelete(address.id);
            }
          }}
          disabled={isMutating}
        >
          <Trash2 size={14} /> Delete
        </Button>
        {!address.is_default && (
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1"
            onClick={() => onSetDefault(address.id)}
            disabled={isMutating}
          >
            Set Default
          </Button>
        )}
      </div>
    </Card>
  );
};
