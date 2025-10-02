import type { Tenant } from '@/types';

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Banana',
    description: 'Процессы для Banana',
    environments: ['dev', 'test', 'stage', 'prod'],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-09-28T15:30:00Z'
  },
  {
    id: 'tenant-2',
    name: 'Carambola',
    description: 'Процессы для Carambola',
    environments: ['dev', 'prod'],
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-09-25T11:20:00Z'
  }
];
