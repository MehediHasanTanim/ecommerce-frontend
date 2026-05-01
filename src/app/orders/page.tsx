import { EmptyState } from "@/components/ui/EmptyState";
import { Package } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="You haven't placed any orders yet."
        actionLabel="Start Shopping"
      />
    </div>
  );
}
