// Моки данных для разработки UI

import type {
  Tenant,
  Project,
  BpmnProcess,
  UserTaskConfig,
  ServiceTaskConfig,
  Registry,
  Preset,
  Release,
  AuditRecord,
  User
} from '@/types';
import { mockComponentPresets } from './mockComponentPresets';

export const mockUser: User = {
  id: 'user-1',
  name: 'Иван Админов',
  role: 'Admin',
  tenantIds: ['tenant-1', 'tenant-2'],
  projectIds: ['project-1', 'project-2']
};

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

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    tenantId: 'tenant-1',
    name: 'Выдача кредитов',
    description: 'Процесс оформления кредитов для физических лиц',
    createdAt: '2025-03-10T12:00:00Z',
    updatedAt: '2025-09-30T14:45:00Z'
  },
  {
    id: 'project-2',
    tenantId: 'tenant-1',
    name: 'Открытие счетов',
    description: 'Процесс открытия банковских счетов',
    createdAt: '2025-04-05T10:30:00Z',
    updatedAt: '2025-09-29T16:00:00Z'
  }
];

export const mockBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:zeebe="http://camunda.org/schema/zeebe/1.0"
  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="creditProcess" name="Процесс кредитования" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Начало">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="reviewApplication" name="Проверка заявки">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="creditProcess.reviewApplication" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:serviceTask id="calculateRisk" name="Расчет риска">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="RiskCalculator" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:userTask id="makeDecision" name="Принятие решения">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="creditProcess.makeDecision" />
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:endEvent id="EndEvent_1" name="Конец">
      <bpmn:incoming>Flow_4</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="reviewApplication" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="reviewApplication" targetRef="calculateRisk" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="calculateRisk" targetRef="makeDecision" />
    <bpmn:sequenceFlow id="Flow_4" sourceRef="makeDecision" targetRef="EndEvent_1" />
  </bpmn:process>
</bpmn:definitions>`;

export const mockBpmnProcesses: BpmnProcess[] = [
  {
    id: 'bpmn-1',
    projectId: 'project-1',
    fileName: 'credit-cpa-main.bpmn',
    processId: 'credit-cpa-main',
    name: 'Выдача кредитов: Основной процесс',
    description: 'Полный цикл выдачи кредита от подачи заявки до выдачи продукта',
    bpmnXml: mockBpmnXml, // Placeholder, реальный XML слишком большой
    userTasks: [
      {
        id: 'ut-1',
        processName: 'credit-cpa-main',
        taskDefinitionKey: 'credit-cpa-main.UserTaskAnalyzeReject',
        name: 'Анализ отказа',
        status: 'configured',
        hasConfig: true
      }
    ],
    serviceTasks: [
      {
        id: 'st-1',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskFormRG',
        name: 'Сформировать РГ по заявке',
        type: 'credit-cpa-main.ServiceTaskFormRG',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'st-2',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskInitialize',
        name: 'Инициализация заявки',
        type: 'credit-cpa-main.ServiceTaskInitialize',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'st-3',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'common-cpa-main.ServiceTaskUpdateStatus',
        name: 'Установить статус заявки',
        type: 'common-cpa-main.ServiceTaskUpdateStatus',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'st-4',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-clear.ServiceTaskInitializeAggregationContextByProduct',
        name: 'Получить параметры анализа транзакций',
        type: 'credit-cpa-clear.ServiceTaskInitializeAggregationContextByProduct',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'st-5',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskHasSuspendConditions',
        name: 'Проверить отлагательные условия',
        type: 'credit-cpa-main.ServiceTaskHasSuspendConditions',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'st-6',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskUploadDocumentsToEA',
        name: 'Загрузка документов в ЭА',
        type: 'credit-cpa-main.ServiceTaskUploadDocumentsToEA',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'st-7',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskCheckProductParams',
        name: 'Проверить параметры продукта',
        type: 'credit-cpa-main.ServiceTaskCheckProductParams',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'st-8',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskScheduleCovenantCheck',
        name: 'Постановка ковенантов на мониторинг',
        type: 'credit-cpa-main.ServiceTaskScheduleCovenantCheck',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'st-9',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'PUT /api/limit-mediator/limit/freeze',
        name: 'Заморозка лимита',
        type: 'PUT /api/limit-mediator/limit/freeze',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'st-10',
        processName: 'credit-cpa-main',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskGenerateUUID',
        name: 'Генерация UUID',
        type: 'credit-cpa-main.ServiceTaskGenerateUUID',
        status: 'configured',
        hasConfig: true
      }
    ],
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-09-30T14:30:00Z'
  },
  {
    id: 'bpmn-2',
    projectId: 'project-1',
    fileName: 'credit-cpa-documents.bpmn',
    processId: 'credit-cpa-documents',
    name: 'Сбор документов',
    description: 'Подпроцесс сбора и проверки пакета документов по кредитной заявке',
    bpmnXml: mockBpmnXml,
    userTasks: [
      {
        id: 'ut-2',
        processName: 'credit-cpa-documents',
        taskDefinitionKey: 'credit-cpa-documents.UserTaskCollectDocuments',
        name: 'Заполнение анкеты и сбор пакета документов',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'ut-3',
        processName: 'credit-cpa-documents',
        taskDefinitionKey: 'credit-cpa-documents.UserTaskBankSignAgreements',
        name: 'Приложите подписанные документы',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'ut-4',
        processName: 'credit-cpa-documents',
        taskDefinitionKey: 'credit-cpa-documents.UserTaskSignAgreementsCheck',
        name: 'Проверить подписанные документы',
        status: 'configured',
        hasConfig: true
      }
    ],
    serviceTasks: [
      {
        id: 'st-11',
        processName: 'credit-cpa-documents',
        serviceTaskKey: 'common-cpa-main.ServiceTaskUpdateStatus',
        name: 'Установить статус заявки',
        type: 'common-cpa-main.ServiceTaskUpdateStatus',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'st-12',
        processName: 'credit-cpa-documents',
        serviceTaskKey: 'avocadocc-api-enricher/order/{orderId}/order-members',
        name: 'Получение участников сделки',
        type: 'avocadocc-api-enricher/order/{orderId}/order-members',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'st-13',
        processName: 'credit-cpa-documents',
        serviceTaskKey: 'credit-api-doc-template.ServiceTaskGenerateDocs',
        name: 'Генерация анкеты-заявки',
        type: 'credit-api-doc-template.ServiceTaskGenerateDocs',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'st-14',
        processName: 'credit-cpa-documents',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskMock',
        name: 'Сформировать список документов',
        type: 'credit-cpa-main.ServiceTaskMock',
        status: 'new',
        hasConfig: false
      }
    ],
    createdAt: '2025-06-15T11:00:00Z',
    updatedAt: '2025-09-28T16:20:00Z'
  },
  {
    id: 'bpmn-3',
    projectId: 'project-1',
    fileName: 'credit-cpa-decision.bpmn',
    processId: 'credit-cpa-decision',
    name: 'Принятие решения (голосование)',
    description: 'Подпроцесс принятия коллегиального решения по кредитной заявке',
    bpmnXml: mockBpmnXml,
    userTasks: [
      {
        id: 'ut-5',
        processName: 'credit-cpa-decision',
        taskDefinitionKey: 'credit-cpa-decision.UserTaskEndorseMaterial',
        name: 'Подготовка и согласование материалов',
        status: 'configured',
        hasConfig: true
      }
    ],
    serviceTasks: [
      {
        id: 'st-15',
        processName: 'credit-cpa-decision',
        serviceTaskKey: 'common-cpa-main.ServiceTaskUpdateStatus',
        name: 'Установить статус заявки',
        type: 'common-cpa-main.ServiceTaskUpdateStatus',
        status: 'configured',
        hasConfig: true
      }
    ],
    createdAt: '2025-07-01T09:00:00Z',
    updatedAt: '2025-09-15T10:45:00Z'
  },
  {
    id: 'bpmn-3-1',
    projectId: 'project-1',
    fileName: 'credit-cpa-order-analyze.bpmn',
    processId: 'credit-cpa-order-analyze',
    name: 'Анализ заявки',
    description: 'Подпроцесс верификации и анализа финансово-хозяйственной деятельности',
    bpmnXml: mockBpmnXml,
    userTasks: [
      {
        id: 'ut-6',
        processName: 'credit-cpa-order-analyze',
        taskDefinitionKey: 'credit-cpa-order-analyze.UserTaskOrderVerify',
        name: 'Верификация и анализ ФХД',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'ut-7',
        processName: 'credit-cpa-order-analyze',
        taskDefinitionKey: 'credit-cpa-order-analyze.UserTaskRequestDocuments',
        name: 'Дозапрос документов',
        status: 'new',
        hasConfig: false
      }
    ],
    serviceTasks: [
      {
        id: 'st-16',
        processName: 'credit-cpa-order-analyze',
        serviceTaskKey: 'common-cpa-main.ServiceTaskUpdateStatus',
        name: 'Установить статус заявки',
        type: 'common-cpa-main.ServiceTaskUpdateStatus',
        status: 'configured',
        hasConfig: true
      },
      {
        id: 'st-17',
        processName: 'credit-cpa-order-analyze',
        serviceTaskKey: 'credit-cpa-main.ServiceTaskDefineExpertisesToStart',
        name: 'Получение экспертиз для запуска',
        type: 'credit-cpa-main.ServiceTaskDefineExpertisesToStart',
        status: 'new',
        hasConfig: false
      },
      {
        id: 'st-18',
        processName: 'credit-cpa-order-analyze',
        serviceTaskKey: 'credit-cpa-order-analyze.ServiceTaskStartPlannedExpertises',
        name: 'Запуск экспертиз',
        type: 'credit-cpa-order-analyze.ServiceTaskStartPlannedExpertises',
        status: 'new',
        hasConfig: false
      }
    ],
    createdAt: '2025-07-15T14:00:00Z',
    updatedAt: '2025-09-22T11:30:00Z'
  },
  {
    id: 'bpmn-4',
    projectId: 'project-2',
    fileName: 'account_opening_main.bpmn',
    processId: 'accountOpeningProcess',
    name: 'Открытие банковского счета',
    description: 'Основной процесс открытия нового счета',
    bpmnXml: mockBpmnXml,
    userTasks: [
      {
        id: 'ut-6',
        processName: 'accountOpeningProcess',
        taskDefinitionKey: 'accountOpeningProcess.fillApplication',
        name: 'Заполнение анкеты',
        status: 'configured',
        hasConfig: true
      }
    ],
    serviceTasks: [
      {
        id: 'st-4',
        processName: 'accountOpeningProcess',
        serviceTaskKey: 'accountOpeningProcess.createAccount',
        name: 'Создание счета',
        type: 'AccountService',
        status: 'configured',
        hasConfig: true
      }
    ],
    createdAt: '2025-04-10T14:00:00Z',
    updatedAt: '2025-09-20T12:30:00Z'
  }
];

export const mockUserTaskConfig: UserTaskConfig = {
  id: 'utc-1',
  taskDefinitionKey: 'creditProcess.reviewApplication',
  version: 3,
  metadata: {
    title: 'Проверка кредитной заявки',
    description: 'Необходимо проверить документы заявителя и первичную информацию',
    assignee: '',
    executorGroups: ['CREDIT_ANALYST'],
    managerGroups: ['CREDIT_ANALYST_MANAGER']
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

export const mockServiceTaskConfig: ServiceTaskConfig = {
  id: 'stc-1',
  serviceTaskKey: 'creditProcess.calculateRisk',
  version: 2,
  type: 'RiskCalculator',
  ioMapping: {
    inputs: [
      { name: 'applicantIncome', value: '=applicantIncome' },
      { name: 'creditAmount', value: '=creditAmount' },
      { name: 'creditTerm', value: '=creditTerm' }
    ],
    outputs: [
      { source: 'riskScore', target: 'calculatedRiskScore' },
      { source: 'riskLevel', target: 'riskLevel' }
    ]
  },
  createdAt: '2025-07-10T11:00:00Z',
  updatedAt: '2025-09-25T16:45:00Z',
  author: 'Иван Админов'
};

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
      { itemId: 'BACK_OFFICE_MANAGER', code: 'BACK_OFFICE_MANAGER', name: 'Руководитель Бэк-офиса', label: 'Руководитель Бэк-офиса', value: 'BACK_OFFICE_MANAGER' },
      { itemId: 'CLIENT', code: 'CLIENT', name: 'Клиент', label: 'Клиент', value: 'CLIENT' },
      { itemId: 'CLIENT_DEPARTMENT', code: 'CLIENT_DEPARTMENT', name: 'Клиентский менеджер', label: 'Клиентский менеджер', value: 'CLIENT_DEPARTMENT' },
      { itemId: 'CLIENT_DEPARTMENT_MANAGER', code: 'CLIENT_DEPARTMENT_MANAGER', name: 'Руководитель клиентского менеджера', label: 'Руководитель клиентского менеджера', value: 'CLIENT_DEPARTMENT_MANAGER' },
      { itemId: 'CREDIT_ANALYST', code: 'CREDIT_ANALYST', name: 'Специалист кредитного анализа', label: 'Специалист кредитного анализа', value: 'CREDIT_ANALYST' },
      { itemId: 'CREDIT_ANALYST_MANAGER', code: 'CREDIT_ANALYST_MANAGER', name: 'Руководитель кредитного анализа', label: 'Руководитель кредитного анализа', value: 'CREDIT_ANALYST_MANAGER' },
      { itemId: 'CREDIT_RISK', code: 'CREDIT_RISK', name: 'Кредитные риски', label: 'Кредитные риски', value: 'CREDIT_RISK' },
      { itemId: 'CREDIT_RISK_MANAGER', code: 'CREDIT_RISK_MANAGER', name: 'Руководитель кредитных рисков', label: 'Руководитель кредитных рисков', value: 'CREDIT_RISK_MANAGER' },
      { itemId: 'CREDIT_VERIFICATOR', code: 'CREDIT_VERIFICATOR', name: 'Кредитный верификатор', label: 'Кредитный верификатор', value: 'CREDIT_VERIFICATOR' },
      { itemId: 'CREDIT_VERIFICATOR_MANAGER', code: 'CREDIT_VERIFICATOR_MANAGER', name: 'Руководитель кредитного верификатора', label: 'Руководитель кредитного верификатора', value: 'CREDIT_VERIFICATOR_MANAGER' },
      { itemId: 'ECONOMIC_SECURITY', code: 'ECONOMIC_SECURITY', name: 'Экономическая безопасность', label: 'Экономическая безопасность', value: 'ECONOMIC_SECURITY' },
      { itemId: 'LEGAL_DEPARTMENT', code: 'LEGAL_DEPARTMENT', name: 'Юридическая служба', label: 'Юридическая служба', value: 'LEGAL_DEPARTMENT' },
      { itemId: 'LEGAL_DEPARTMENT_MANAGER', code: 'LEGAL_DEPARTMENT_MANAGER', name: 'Руководитель Юридической службы', label: 'Руководитель Юридической службы', value: 'LEGAL_DEPARTMENT_MANAGER' },
      { itemId: 'PLEDGE_SERVICE', code: 'PLEDGE_SERVICE', name: 'Залоговый сервис', label: 'Залоговый сервис', value: 'PLEDGE_SERVICE' }
    ],
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-09-20T10:15:00Z',
    author: 'Иван Админов'
  },
  {
    id: 'reg-2',
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
          decisionType: 'accept',
          validate: true
        },
        {
          decisionId: 'reject',
          title: 'Отклонить',
          decisionType: 'reject',
          validate: true,
          commentPolicy: 'required'
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
