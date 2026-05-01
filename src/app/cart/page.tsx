import { EmptyState } from "@/components/ui/EmptyState";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Looks like you haven't added anything to your cart yet."
        actionLabel="Start Shopping"
      />
    </div>
  );
}
