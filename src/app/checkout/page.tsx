import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><h2 className="text-xl font-semibold">Shipping Address</h2></CardHeader>
            <CardContent>
              <p className="text-gray-500">No address provided.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><h2 className="text-xl font-semibold">Payment Method</h2></CardHeader>
            <CardContent>
              <p className="text-gray-500">No payment method selected.</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader><h2 className="text-xl font-semibold">Order Summary</h2></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>$0.00</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$0.00</span></div>
              <div className="flex justify-between font-bold pt-4 border-t border-[var(--border)]">
                <span>Total</span><span>$0.00</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>Place Order</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
