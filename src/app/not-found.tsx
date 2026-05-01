import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-6xl font-bold text-[var(--color-primary)]">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-gray-500 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}
