'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth-store';
import { 
  profileUpdateSchema, 
  ProfileUpdateInput,
  changePasswordSchema,
  ChangePasswordInput
} from '@/features/user/schemas/user-schemas';
import { mapApiError } from '@/lib/api-error';

function ProfileContent() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const { data: profile, isLoading: isFetching } = useQuery({
    queryKey: ['profile'],
    queryFn: userService.getMe,
  });

  const profileForm = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    values: profile ? {
      full_name: profile.full_name,
      phone: profile.phone,
    } : undefined,
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdateInput) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(['profile'], updatedUser);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(mapApiError(error).message);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => userService.changePassword(data),
    onSuccess: () => {
      passwordForm.reset();
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      toast.error(mapApiError(error).message);
    },
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <form 
            onSubmit={profileForm.handleSubmit((data) => updateProfileMutation.mutate(data))} 
            className="space-y-4"
          >
            <Input
              label="Full Name"
              {...profileForm.register('full_name')}
              error={profileForm.formState.errors.full_name?.message}
            />
            <Input
              label="Email Address (Read-only)"
              value={profile?.email}
              disabled
              className="bg-gray-50"
            />
            <Input
              label="Phone Number"
              {...profileForm.register('phone')}
              error={profileForm.formState.errors.phone?.message}
            />
            <Button 
              type="submit" 
              className="w-full" 
              isLoading={updateProfileMutation.isPending}
            >
              Update Profile
            </Button>
          </form>
        </Card>

        {/* Change Password Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>
          <form 
            onSubmit={passwordForm.handleSubmit((data) => changePasswordMutation.mutate(data))} 
            className="space-y-4"
          >
            <Input
              label="Old Password"
              type="password"
              placeholder="••••••••"
              {...passwordForm.register('old_password')}
              error={passwordForm.formState.errors.old_password?.message}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              {...passwordForm.register('new_password')}
              error={passwordForm.formState.errors.new_password?.message}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              {...passwordForm.register('confirm_password')}
              error={passwordForm.formState.errors.confirm_password?.message}
            />
            <Button 
              type="submit" 
              variant="secondary"
              className="w-full" 
              isLoading={changePasswordMutation.isPending}
            >
              Change Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
