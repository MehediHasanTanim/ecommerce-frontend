'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useCart } from '@/hooks/useCart';
import { User, LogOut, Heart, ShoppingCart } from 'lucide-react';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openDrawer, cart: localCart } = useCartStore();
  const { cart } = useCart();

  const displayCart = cart ?? localCart;
  const itemCount = displayCart?.item_count ?? 0;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openDrawer();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl text-[var(--color-primary)]">
                E-Shop
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/products" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/categories" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Categories
              </Link>
            </nav>
          </div>

          <div className="flex-1 px-8 hidden md:block max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-9 rounded-md border border-[var(--border)] bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-1">
            <nav className="flex items-center space-x-1">
              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  href="/wishlist"
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                </Link>
              )}

              {/* Cart Icon with Badge */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[var(--color-primary)] rounded-full">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm font-medium p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    <User size={18} />
                    <span className="hidden lg:inline">{user?.full_name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-sm font-medium p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mini Cart Drawer */}
      <MiniCartDrawer />
    </>
  );
}
