import { EmptyState } from "@/components/ui/EmptyState";
import { Package } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>
      <EmptyState
        icon={Package}
        title="No products found"
        description="We couldn't find any products matching your criteria."
        actionLabel="Clear Filters"
      />
    </div>
  );
}
