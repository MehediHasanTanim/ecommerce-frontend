import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>
          <p className="text-center text-sm text-gray-500">Join E-Shop today</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Full Name" type="text" placeholder="John Doe" />
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Input label="Confirm Password" type="password" placeholder="••••••••" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">Register</Button>
          <p className="text-sm text-center text-gray-600">
            Already have an account? <Link href="/login" className="text-[var(--color-primary)] hover:underline">Log in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
