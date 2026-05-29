import { Button } from "@/components/ui/Button";
import { HomeCatalogSections } from "@/features/catalog/components/HomeCatalogSections";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <div data-testid="home-promo-banner" className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 px-6 dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white">
          Welcome to <span className="text-[var(--color-primary)]">E-Shop</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your one-stop destination for the best products. High quality, reliable, and fast delivery.
        </p>
        <div className="flex gap-4">
          <Link href="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">Create Account</Button>
          </Link>
        </div>
      </div>
      <Suspense fallback={<div data-testid="product-loading-state">Loading catalog...</div>}>
        <HomeCatalogSections />
      </Suspense>
    </div>
  );
}
