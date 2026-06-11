'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/guards/ProtectedRoute';
import { useCheckoutStore } from '@/store/checkout-store';
import { useCheckoutSummary, usePlaceOrder } from '@/hooks/useCheckout';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { OrderReview } from '@/components/checkout/OrderReview';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutSummarySkeleton } from '@/components/checkout/CheckoutSkeletons';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ShoppingCart } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    prevStep,
    selectedAddressId,
    paymentMethod,
    setIsPlacingOrder,
    isPlacingOrder,
  } = useCheckoutStore();
  const { data: summary, isLoading: isSummaryLoading } = useCheckoutSummary();
  const placeOrder = usePlaceOrder();

  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Show validation errors as toast
  const handleValidationError = React.useCallback((message: string) => {
    setValidationError(message);
    toast.error(message);
  }, []);

  // Step 1 → Step 2 (Address → Review)
  const handleGoToReview = () => {
    setValidationError(null);

    if (!selectedAddressId) {
      handleValidationError('Please select a shipping address.');
      return;
    }
    if (!paymentMethod) {
      handleValidationError('Please select a payment method.');
      return;
    }

    // Ensure we have a checkout summary before proceeding
    if (!summary || summary.items.length === 0) {
      handleValidationError('Your cart is empty. Please add items before checkout.');
      return;
    }

    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 → Step 3 (Place Order)
  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      handleValidationError('Please select a shipping address.');
      return;
    }
    if (!paymentMethod) {
      handleValidationError('Please select a payment method.');
      return;
    }

    setIsPlacingOrder(true);
    placeOrder.mutate(
      { address_id: selectedAddressId, payment_method: paymentMethod },
      {
        onSuccess: (data) => {
          setIsPlacingOrder(false);
          toast.success('Order placed successfully!');
          router.push(`/order-success/${data.order_id}`);
        },
        onError: () => {
          setIsPlacingOrder(false);
        },
      }
    );
  };

  // Go back a step
  const handleGoBack = () => {
    setValidationError(null);
    prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isSummaryLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <CheckoutSummarySkeleton />
      </div>
    );
  }

  // Empty cart
  if (!summary || summary.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">
          Add some items to your cart before checking out.
        </p>
        <Button onClick={() => router.push('/products')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <CheckoutStepper currentStep={currentStep} />

      {/* ---- STEP 1: Address ---- */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address Selection + Payment */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </CardHeader>
              <CardContent>
                <AddressSelector />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                  </div>
                  <span className="font-medium text-sm">Cash on Delivery</span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-end">
              <Button size="lg" onClick={handleGoToReview}>
                Continue to Review
              </Button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </CardHeader>
              <CardContent>
                <OrderSummary summary={summary} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ---- STEP 2: Review ---- */}
      {currentStep === 2 && (
        <div>
          {/* Items review */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Review Your Order</h2>
            </CardHeader>
            <CardContent>
              <OrderReview onValidationError={handleValidationError} />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" size="lg" onClick={handleGoBack}>
              ← Back to Address
            </Button>
            <Button
              size="lg"
              onClick={handlePlaceOrder}
              isLoading={isPlacingOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Processing your order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      )}

      {/* ---- STEP 3: Placing Order (Transition) ---- */}
      {currentStep === 3 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader size="lg" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Processing your order...
          </p>
          <p className="text-sm text-gray-400">Please do not close this page.</p>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
