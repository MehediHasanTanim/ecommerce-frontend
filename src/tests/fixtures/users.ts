export const testUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  phone: '01712345678',
  full_name: 'Test User',
  password: 'Password123!',
  role: 'customer' as const,
};

export const adminUser = {
  id: 'admin-user-id',
  email: 'admin@example.com',
  phone: '01812345678',
  full_name: 'Admin User',
  password: 'Password123!',
  role: 'admin' as const,
};

export const duplicateUser = {
  ...testUser,
  email: 'existing@example.com',
};
