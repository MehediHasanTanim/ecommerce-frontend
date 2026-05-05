'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { registerSchema, RegisterInput } from '@/features/auth/schemas/auth-schemas';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { mapApiError } from '@/lib/api-error';

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated, _hasHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      router.push('/');
    }
  }, [_hasHydrated, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      login(response.user, response.access, response.refresh);
      toast.success('Registration successful!');
      router.push('/');
    } catch (error) {
      const apiError = mapApiError(error);
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          setError(field as keyof RegisterInput, { 
            message: Array.isArray(messages) ? messages[0] : messages 
          });
        });
      } else {
        toast.error(apiError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-gray-500 mt-2">Join our e-commerce platform today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number"
            placeholder="01712345678"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...register('confirm_password')}
            error={errors.confirm_password?.message}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Register
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
