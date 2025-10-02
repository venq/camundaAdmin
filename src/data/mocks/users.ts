import type { User } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Иван Админов',
  role: 'Admin',
  tenantIds: ['tenant-1', 'tenant-2'],
  projectIds: ['project-1', 'project-2']
};
