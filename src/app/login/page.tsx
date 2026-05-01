import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <p className="text-center text-sm text-gray-500">Enter your credentials to access your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">Sign In</Button>
          <p className="text-sm text-center text-gray-600">
            Don't have an account? <Link href="/register" className="text-[var(--color-primary)] hover:underline">Register here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
