import type { AuditRecord } from '@/types';

export const mockAuditRecords: AuditRecord[] = [
  {
    id: 'audit-1',
    timestamp: '2025-09-30T14:30:00Z',
    author: 'Иван Админов',
    objectType: 'userTask',
    objectId: 'utc-1',
    action: 'update',
    changes: {
      'metadata.title': {
        old: 'Проверка заявки',
        new: 'Проверка кредитной заявки'
      }
    },
    tenantId: 'tenant-1',
    projectId: 'project-1'
  },
  {
    id: 'audit-2',
    timestamp: '2025-09-30T16:00:00Z',
    author: 'Иван Админов',
    objectType: 'release',
    objectId: 'release-1',
    action: 'promote',
    tenantId: 'tenant-1',
    projectId: 'project-1'
  },
  {
    id: 'audit-3',
    timestamp: '2025-09-25T16:45:00Z',
    author: 'Иван Админов',
    objectType: 'serviceTask',
    objectId: 'stc-1',
    action: 'update',
    changes: {
      'ioMapping.inputs': {
        old: '[2 inputs]',
        new: '[3 inputs]'
      }
    },
    tenantId: 'tenant-1',
    projectId: 'project-1'
  },
  {
    id: 'audit-4',
    timestamp: '2025-09-20T10:15:00Z',
    author: 'Иван Админов',
    objectType: 'registry',
    objectId: 'reg-1',
    action: 'update',
    changes: {
      items: {
        old: '[2 items]',
        new: '[3 items]'
      }
    },
    tenantId: 'tenant-1'
  }
];
