'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader } from '@/components/ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  React.useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [_hasHydrated, isAuthenticated, router, pathname]);

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
