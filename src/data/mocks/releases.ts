import type { Release } from '@/types';
import { mockUserTaskConfig } from './userTasks';
import { mockServiceTaskConfig } from './serviceTasks';
import { mockRegistries } from './registries';

export const mockReleases: Release[] = [
  {
    id: 'release-1',
    projectId: 'project-1',
    version: 'v1.5.0',
    title: 'Обновление процесса кредитования',
    description: 'Добавлены новые проверки и улучшен UI задач',
    environment: 'prod',
    snapshot: {
      userTasks: [mockUserTaskConfig],
      serviceTasks: [mockServiceTaskConfig],
      registries: mockRegistries
    },
    checklist: [
      {
        id: 'check-1',
        title: 'Отсутствие лишних конфигураций',
        status: 'passed'
      },
      {
        id: 'check-2',
        title: 'Отсутствие пустых табов',
        status: 'passed'
      },
      {
        id: 'check-3',
        title: 'Валидность ссылок на компоненты',
        status: 'passed'
      },
      {
        id: 'check-4',
        title: 'Прохождение unit-тестов',
        status: 'passed',
        message: '15/15 тестов пройдено'
      }
    ],
    author: 'Иван Админов',
    createdAt: '2025-09-30T16:00:00Z'
  },
  {
    id: 'release-2',
    projectId: 'project-1',
    version: 'v1.4.2',
    title: 'Исправление ошибок',
    description: 'Исправлены мелкие ошибки в валидации',
    environment: 'stage',
    snapshot: {
      userTasks: [],
      serviceTasks: [],
      registries: []
    },
    checklist: [
      {
        id: 'check-1',
        title: 'Отсутствие лишних конфигураций',
        status: 'passed'
      }
    ],
    author: 'Иван Админов',
    createdAt: '2025-09-25T12:00:00Z',
    promotedFrom: 'release-0'
  }
];
