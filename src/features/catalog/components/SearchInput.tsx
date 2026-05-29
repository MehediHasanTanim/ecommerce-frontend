'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface SearchInputProps {
  debounceMs?: number;
}

export function SearchInput({ debounceMs = 500 }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [value, setValue] = useState(initialQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      const params = new URLSearchParams(window.location.search || searchParams.toString());

      if (!trimmed && !params.has('q')) return;

      if (trimmed) {
        params.set('q', trimmed);
      } else {
        params.delete('q');
      }
      params.delete('page');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateSearch(next);
    }, debounceMs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    updateSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="flex gap-2">
      <input
        data-testid="catalog-search-input"
        type="text"
        role="textbox"
        value={value}
        onChange={handleChange}
        placeholder="Search products..."
        className="w-full border rounded-lg px-4 py-2 text-sm"
      />
      <button type="submit" data-testid="catalog-search-submit" className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white">
        Search
      </button>
    </form>
  );
}
