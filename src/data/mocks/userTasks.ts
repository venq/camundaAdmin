import type { UserTaskConfig } from '@/types';

export const mockUserTaskConfig: UserTaskConfig = {
  id: 'utc-1',
  taskDefinitionKey: 'creditProcess.reviewApplication',
  version: 3,
  metadata: {
    title: 'Проверка кредитной заявки',
    description: 'Необходимо проверить документы заявителя и первичную информацию',
    assignee: '',
    executorGroups: ['CREDIT_ANALYST'],
    managerGroups: ['CREDIT_ANALYST_MANAGER'],
    workGroups: ['CREDIT_ANALYST_ROLE', 'LEGAL_DEPARTMENT_ROLE'],
    decision: 'reviewApplication'
  },
  decisions: [
    {
      decisionId: 'approve',
      title: 'Одобрить',
      decisionType: 'accept',
      validate: true,
      commentPolicy: 'optional'
    },
    {
      decisionId: 'reject',
      title: 'Отклонить',
      decisionType: 'reject',
      validate: true,
      commentPolicy: 'required'
    },
    {
      decisionId: 'sendToRework',
      title: 'На доработку',
      decisionType: 'rework',
      validate: false,
      commentPolicy: 'required'
    }
  ],
  leftPanel: [
    {
      componentId: 'taskInfo',
      type: 'TaskInfo',
      label: 'Информация о задаче'
    }
  ],
  tabGroups: [
    {
      tabGroupId: 'mainGroup',
      title: 'Основная информация',
      pos: 1,
      tabs: [
        {
          tabId: 'applicantTab',
          title: 'Заявитель',
          pos: 1,
          components: [
            {
              componentId: 'applicantName',
              type: 'TextField',
              pos: 1,
              label: 'ФИО заявителя',
              required: true,
              readonly: false
            },
            {
              componentId: 'applicantPassport',
              type: 'TextField',
              pos: 2,
              label: 'Паспортные данные',
              required: true
            },
            {
              componentId: 'applicantIncome',
              type: 'NumberField',
              pos: 3,
              label: 'Ежемесячный доход',
              required: true
            }
          ]
        },
        {
          tabId: 'documentsTab',
          title: 'Документы',
          pos: 2,
          components: [
            {
              componentId: 'documents',
              type: 'DocumentList',
              pos: 1,
              label: 'Приложенные документы',
              properties: {
                types: ['passport', 'income_certificate', 'employment_record']
              }
            }
          ]
        }
      ]
    },
    {
      tabGroupId: 'additionalGroup',
      title: 'Дополнительно',
      pos: 2,
      tabs: [
        {
          tabId: 'commentsTab',
          title: 'Комментарии',
          pos: 1,
          components: [
            {
              componentId: 'comments',
              type: 'TextArea',
              pos: 1,
              label: 'Комментарии проверяющего'
            }
          ]
        }
      ]
    }
  ],
  createdAt: '2025-06-01T10:00:00Z',
  updatedAt: '2025-09-30T14:30:00Z',
  author: 'Иван Админов'
};
