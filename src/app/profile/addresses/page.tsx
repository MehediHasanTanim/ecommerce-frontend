'use client';

import React from 'react';
import { ProtectedRoute } from '@/lib/guards/ProtectedRoute';
import { AddressList } from '@/features/user/components/AddressList';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/profile" className="hover:text-[var(--color-primary)] flex items-center gap-1">
            <ChevronLeft size={16} /> Back to Profile
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold">Manage Addresses</h1>
        
        <div className="mt-8">
          <AddressList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
