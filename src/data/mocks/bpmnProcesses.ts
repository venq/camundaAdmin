import type { BpmnProcess } from '@/types';

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
