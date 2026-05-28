'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { loginSchema, LoginInput } from '@/features/auth/schemas/auth-schemas';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { mapApiError } from '@/lib/api-error';

import { Suspense } from 'react';
import { Loader } from '@/components/ui/Loader';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login, _hasHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const redirect = searchParams.get('redirect') || '/';

  React.useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      router.push(redirect);
    }
  }, [_hasHydrated, isAuthenticated, router, redirect]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(response.user, response.access, response.refresh);
      toast.success('Login successful!');
      router.push(redirect);
    } catch (error) {
      const apiError = mapApiError(error);
      const message = apiError.message === 'Validation failed' ? 'Invalid credentials' : apiError.message;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email or Phone"
            placeholder="email@example.com"
            {...register('username')}
            error={errors.username?.message}
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader size="lg" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
