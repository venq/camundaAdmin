import type { Registry } from '@/types';

export const mockRegistries: Registry[] = [
  {
    id: 'reg-1',
    registryId: 'roles',
    tenantId: 'tenant-1',
    name: 'Роли пользователей',
    description: 'Справочник ролей для назначения задач',
    version: 5,
    items: [
      { itemId: 'BACK_OFFICE', code: 'BACK_OFFICE', name: 'Сотрудник Бэк-офиса', label: 'Сотрудник Бэк-офиса', value: 'BACK_OFFICE' },
      { itemId: 'CLIENT', code: 'CLIENT', name: 'Клиент', label: 'Клиент', value: 'CLIENT' },
      { itemId: 'CLIENT_DEPARTMENT', code: 'CLIENT_DEPARTMENT', name: 'Клиентский менеджер', label: 'Клиентский менеджер', value: 'CLIENT_DEPARTMENT' },
      { itemId: 'CREDIT_ANALYST', code: 'CREDIT_ANALYST', name: 'Специалист кредитного анализа', label: 'Специалист кредитного анализа', value: 'CREDIT_ANALYST' },
      { itemId: 'CREDIT_RISK', code: 'CREDIT_RISK', name: 'Кредитные риски', label: 'Кредитные риски', value: 'CREDIT_RISK' },
      { itemId: 'CREDIT_VERIFICATOR', code: 'CREDIT_VERIFICATOR', name: 'Кредитный верификатор', label: 'Кредитный верификатор', value: 'CREDIT_VERIFICATOR' },
      { itemId: 'ECONOMIC_SECURITY', code: 'ECONOMIC_SECURITY', name: 'Экономическая безопасность', label: 'Экономическая безопасность', value: 'ECONOMIC_SECURITY' },
      { itemId: 'LEGAL_DEPARTMENT', code: 'LEGAL_DEPARTMENT', name: 'Юридическая служба', label: 'Юридическая служба', value: 'LEGAL_DEPARTMENT' },
      { itemId: 'PLEDGE_SERVICE', code: 'PLEDGE_SERVICE', name: 'Залоговый сервис', label: 'Залоговый сервис', value: 'PLEDGE_SERVICE' }
    ],
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-09-20T10:15:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'reg-1a',
    registryId: 'managerRoles',
    tenantId: 'tenant-1',
    name: 'Роли руководителей',
    description: 'Справочник ролей руководителей',
    version: 1,
    items: [
      { itemId: 'BACK_OFFICE_MANAGER', code: 'BACK_OFFICE_MANAGER', name: 'Руководитель Бэк-офиса', label: 'Руководитель Бэк-офиса', value: 'BACK_OFFICE_MANAGER' },
      { itemId: 'CLIENT_DEPARTMENT_MANAGER', code: 'CLIENT_DEPARTMENT_MANAGER', name: 'Руководитель клиентского менеджера', label: 'Руководитель клиентского менеджера', value: 'CLIENT_DEPARTMENT_MANAGER' },
      { itemId: 'CREDIT_ANALYST_MANAGER', code: 'CREDIT_ANALYST_MANAGER', name: 'Руководитель кредитного анализа', label: 'Руководитель кредитного анализа', value: 'CREDIT_ANALYST_MANAGER' },
      { itemId: 'CREDIT_RISK_MANAGER', code: 'CREDIT_RISK_MANAGER', name: 'Руководитель кредитных рисков', label: 'Руководитель кредитных рисков', value: 'CREDIT_RISK_MANAGER' },
      { itemId: 'CREDIT_VERIFICATOR_MANAGER', code: 'CREDIT_VERIFICATOR_MANAGER', name: 'Руководитель кредитного верификатора', label: 'Руководитель кредитного верификатора', value: 'CREDIT_VERIFICATOR_MANAGER' },
      { itemId: 'LEGAL_DEPARTMENT_MANAGER', code: 'LEGAL_DEPARTMENT_MANAGER', name: 'Руководитель Юридической службы', label: 'Руководитель Юридической службы', value: 'LEGAL_DEPARTMENT_MANAGER' }
    ],
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-09-20T10:15:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'reg-2',
    registryId: 'workgroups',
    tenantId: 'tenant-1',
    name: 'Рабочая группа',
    description: 'Справочник рабочих групп',
    version: 1,
    items: [
      { itemId: 'BACK_OFFICE_ROLE', code: 'BACK_OFFICE_ROLE', name: 'Сотрудник Бэк-офиса', label: 'Сотрудник Бэк-офиса', value: 'BACK_OFFICE_ROLE' },
      { itemId: 'BACK_OFFICE_MANAGER_ROLE', code: 'BACK_OFFICE_MANAGER_ROLE', name: 'Руководитель Бэк-офиса', label: 'Руководитель Бэк-офиса', value: 'BACK_OFFICE_MANAGER_ROLE' },
      { itemId: 'CLIENT', code: 'CLIENT', name: 'Клиент', label: 'Клиент', value: 'CLIENT' },
      { itemId: 'CLIENT_DEPARTMENT_ROLE', code: 'CLIENT_DEPARTMENT_ROLE', name: 'Клиентский менеджер', label: 'Клиентский менеджер', value: 'CLIENT_DEPARTMENT_ROLE' },
      { itemId: 'CLIENT_DEPARTMENT_MANAGER_ROLE', code: 'CLIENT_DEPARTMENT_MANAGER_ROLE', name: 'Руководитель клиентского менеджера', label: 'Руководитель клиентского менеджера', value: 'CLIENT_DEPARTMENT_MANAGER_ROLE' },
      { itemId: 'CREDIT_ANALYST_ROLE', code: 'CREDIT_ANALYST_ROLE', name: 'Специалист кредитного анализа', label: 'Специалист кредитного анализа', value: 'CREDIT_ANALYST_ROLE' },
      { itemId: 'CREDIT_ANALYST_MANAGER_ROLE', code: 'CREDIT_ANALYST_MANAGER_ROLE', name: 'Руководитель кредитного анализа', label: 'Руководитель кредитного анализа', value: 'CREDIT_ANALYST_MANAGER_ROLE' },
      { itemId: 'CREDIT_RISK_ROLE', code: 'CREDIT_RISK_ROLE', name: 'Кредитные риски', label: 'Кредитные риски', value: 'CREDIT_RISK_ROLE' },
      { itemId: 'CREDIT_RISK_MANAGER_ROLE', code: 'CREDIT_RISK_MANAGER_ROLE', name: 'Руководитель кредитных рисков', label: 'Руководитель кредитных рисков', value: 'CREDIT_RISK_MANAGER_ROLE' },
      { itemId: 'CREDIT_VERIFICATOR_ROLE', code: 'CREDIT_VERIFICATOR_ROLE', name: 'Кредитный верификатор', label: 'Кредитный верификатор', value: 'CREDIT_VERIFICATOR_ROLE' },
      { itemId: 'CREDIT_VERIFICATOR_MANAGER_ROLE', code: 'CREDIT_VERIFICATOR_MANAGER_ROLE', name: 'Руководитель кредитного верификатора', label: 'Руководитель кредитного верификатора', value: 'CREDIT_VERIFICATOR_MANAGER_ROLE' },
      { itemId: 'ECONOMIC_SECURITY_ROLE', code: 'ECONOMIC_SECURITY_ROLE', name: 'Экономическая безопасность', label: 'Экономическая безопасность', value: 'ECONOMIC_SECURITY_ROLE' },
      { itemId: 'LEGAL_DEPARTMENT_ROLE', code: 'LEGAL_DEPARTMENT_ROLE', name: 'Юридическая служба', label: 'Юридическая служба', value: 'LEGAL_DEPARTMENT_ROLE' },
      { itemId: 'LEGAL_DEPARTMENT_MANAGER_ROLE', code: 'LEGAL_DEPARTMENT_MANAGER_ROLE', name: 'Руководитель Юридической службы', label: 'Руководитель Юридической службы', value: 'LEGAL_DEPARTMENT_MANAGER_ROLE' },
      { itemId: 'PLEDGE_SERVICE_ROLE', code: 'PLEDGE_SERVICE_ROLE', name: 'Залоговый сервис', label: 'Залоговый сервис', value: 'PLEDGE_SERVICE_ROLE' }
    ],
    createdAt: '2025-05-10T10:00:00Z',
    updatedAt: '2025-09-15T14:20:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'reg-3',
    registryId: 'docType',
    tenantId: 'tenant-1',
    name: 'Типы документов',
    description: 'Справочник типов документов для процессов',
    version: 3,
    items: [
      { itemId: 'passport', label: 'Паспорт', value: 'passport' },
      { itemId: 'income_certificate', label: 'Справка о доходах', value: 'income_certificate' },
      { itemId: 'employment_record', label: 'Трудовая книжка', value: 'employment_record' }
    ],
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-09-15T14:20:00Z',
    author: 'Иван Админов'
  }
];
