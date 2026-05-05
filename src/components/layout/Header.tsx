'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { User, LogOut } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
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

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              <span className="sr-only">Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
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
  );
}
