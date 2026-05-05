'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { resetPasswordSchema, ResetPasswordInput } from '@/features/auth/schemas/auth-schemas';
import { authService } from '@/services/auth.service';
import { mapApiError } from '@/lib/api-error';

import { Suspense } from 'react';
import { Loader } from '@/components/ui/Loader';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        password: data.password,
        confirm_password: data.confirm_password,
      });
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (error) {
      const apiError = mapApiError(error);
      toast.error(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center py-10">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Link</h1>
          <p className="text-gray-500 mt-4">
            The password reset link is invalid or has expired.
          </p>
          <Button 
            className="mt-6 w-full" 
            onClick={() => router.push('/forgot-password')}
          >
            Request New Link
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-gray-500 mt-2">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            {...register('confirm_password')}
            error={errors.confirm_password?.message}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader size="lg" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
