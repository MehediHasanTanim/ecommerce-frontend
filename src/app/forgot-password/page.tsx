'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/features/auth/schemas/auth-schemas';
import { authService } from '@/services/auth.service';
import { mapApiError } from '@/lib/api-error';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.username);
      setIsSubmitted(true);
      toast.success('Reset instructions sent if account exists.');
    } catch (error) {
      // Always show success or generic message to avoid account enumeration
      setIsSubmitted(true);
      toast.success('Reset instructions sent if account exists.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
          <p className="text-gray-500 mt-2">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email or Phone"
              placeholder="email@example.com"
              {...register('username')}
              error={errors.username?.message}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
              If an account exists with that identifier, you will receive a password reset link shortly.
            </div>
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
