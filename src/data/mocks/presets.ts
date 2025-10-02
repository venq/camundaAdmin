import type { Preset } from '@/types';
import { mockComponentPresets } from '../mockComponentPresets';

export const mockPresets: Preset[] = [
  {
    id: 'preset-1',
    presetId: 'standardApprovalTask',
    tenantId: 'tenant-1',
    type: 'userTask',
    name: 'Стандартная задача согласования',
    description: 'Типовая структура для задач согласования',
    version: 2,
    isDefault: true, // Пресет по умолчанию для новых UserTask
    content: {
      decisions: [
        {
          decisionId: 'approve',
          title: 'Согласовать',
          type: 'ACCEPT',
          validate: true,
          comment: {
            visible: true,
            readonly: false,
            require: false
          }
        },
        {
          decisionId: 'reject',
          title: 'Отклонить',
          type: 'REJECT',
          validate: true,
          comment: {
            visible: true,
            readonly: false,
            require: true
          }
        }
      ],
      tabGroups: [
        {
          tabGroupId: 'mainGroup',
          title: 'Основная информация',
          pos: 1,
          tabs: []
        }
      ]
    },
    createdAt: '2025-05-01T12:00:00Z',
    updatedAt: '2025-08-10T15:30:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'preset-3',
    presetId: 'standardServiceTask',
    tenantId: 'tenant-1',
    type: 'serviceTask',
    name: 'Стандартная сервис-таска',
    description: 'Базовая конфигурация для ServiceTask с I/O маппингом',
    version: 1,
    isDefault: true, // Пресет по умолчанию для новых ServiceTask
    content: {
      ioMapping: {
        inputs: [],
        outputs: []
      }
    },
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-07-01T10:00:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'preset-tabgroup-1',
    presetId: 'documentTabGroup',
    tenantId: 'tenant-1',
    type: 'tabGroup',
    name: 'Документы',
    description: 'TabGroup для работы с документами',
    version: 1,
    content: {
      tabGroupId: 'documents',
      title: 'Документы',
      pos: 1,
      visible: true,
      tabs: [
        {
          tabId: 'uploadedDocs',
          title: 'Загруженные документы',
          pos: 1,
          components: []
        }
      ]
    },
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-01T10:00:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'preset-tabgroup-2',
    presetId: 'clientInfoTabGroup',
    tenantId: 'tenant-1',
    type: 'tabGroup',
    name: 'Информация о клиенте',
    description: 'TabGroup для отображения данных клиента',
    version: 1,
    content: {
      tabGroupId: 'clientInfo',
      title: 'Информация о клиенте',
      pos: 2,
      visible: true,
      tabs: [
        {
          tabId: 'generalInfo',
          title: 'Общие сведения',
          pos: 1,
          components: []
        },
        {
          tabId: 'contactInfo',
          title: 'Контактные данные',
          pos: 2,
          components: []
        }
      ]
    },
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-01T10:00:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'preset-tabgroup-3',
    presetId: 'analysisTabGroup',
    tenantId: 'tenant-1',
    type: 'tabGroup',
    name: 'Анализ и расчеты',
    description: 'TabGroup для аналитики и расчетов',
    version: 1,
    content: {
      tabGroupId: 'analysis',
      title: 'Анализ и расчеты',
      pos: 3,
      visible: true,
      tabs: [
        {
          tabId: 'riskAnalysis',
          title: 'Анализ рисков',
          pos: 1,
          components: []
        },
        {
          tabId: 'scoring',
          title: 'Скоринг',
          pos: 2,
          components: []
        }
      ]
    },
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-01T10:00:00Z',
    author: 'Иван Админов'
  },
  ...mockComponentPresets // Все 139 компонент-пресетов
];
