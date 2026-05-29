import { Suspense } from "react";
import { CatalogPageContent } from "@/features/catalog/components/CatalogPageContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div data-testid="product-loading-state">Loading products...</div>}>
      <CatalogPageContent />
    </Suspense>
  );
}
