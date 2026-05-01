import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
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
  );
}
