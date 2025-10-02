import type { Project } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    tenantId: 'tenant-1',
    name: 'Выдача кредитов',
    description: 'Процесс оформления кредитов для физических лиц',
    version: '1.0.0',
    author: 'Иван Админов',
    createdAt: '2025-03-10T12:00:00Z',
    updatedAt: '2025-09-30T14:45:00Z'
  },
  {
    id: 'project-2',
    tenantId: 'tenant-1',
    name: 'Открытие счетов',
    description: 'Процесс открытия банковских счетов',
    version: '1.0.0',
    author: 'Иван Админов',
    createdAt: '2025-04-05T10:30:00Z',
    updatedAt: '2025-09-29T16:00:00Z'
  }
];
