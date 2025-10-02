// Базовые типы для системы Camunda Admin

export type Role = 'Admin' | 'Manager';

export type Environment = 'dev' | 'test' | 'stage' | 'prod';

export type TaskStatus = 'new' | 'configured' | 'extra';

export interface User {
  id: string;
  name: string;
  role: Role;
  tenantIds: string[];
  projectIds: string[];
}

export interface Tenant {
  id: string;
  name: string;
  description: string;
  environments: Environment[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BpmnProcess {
  id: string;
  projectId: string;
  fileName: string; // имя файла BPMN
  processId: string; // ID процесса из BPMN
  name: string; // название процесса
  description?: string;
  bpmnXml: string;
  userTasks: UserTaskNode[];
  serviceTasks: ServiceTaskNode[];
  createdAt: string;
  updatedAt: string;
}

export interface UserTaskNode {
  id: string;
  processName: string;
  taskDefinitionKey: string;
  name: string;
  status: TaskStatus;
  hasConfig: boolean;
}

export interface ServiceTaskNode {
  id: string;
  processName: string;
  serviceTaskKey: string;
  name: string;
  type: string;
  status: TaskStatus;
  hasConfig: boolean;
}

// UserTask конфигурация

export interface UserTaskConfig {
  id: string;
  taskDefinitionKey: string;
  version: number;
  metadata: UserTaskMetadata;
  decisions: Decision[];
  leftPanel: Component[];
  tabGroups: TabGroup[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface UserTaskMetadata {
  title: string;
  description: string;
  assignee?: string;
  executorGroups: string[];
  managerGroups: string[];
  workGroups: string[];
  decision?: string;
}

export interface DecisionPermission {
  readRole: string;
  authorMask?: string;
}

export interface DecisionComment {
  visible: boolean;
  readonly: boolean;
  require: boolean;
  permissions?: DecisionPermission[];
}

export interface Decision {
  decisionId: string;
  title: string;
  type: 'ACCEPT' | 'REJECT' | 'REWORK';
  validate: boolean;
  comment?: DecisionComment;
  properties?: {
    transient?: boolean;
    [key: string]: any;
  };
}

export interface TabGroup {
  tabGroupId: string;
  title: string;
  pos: number;
  visible?: boolean | string; // boolean или SpEL
  tabs: Tab[];
}

export interface Tab {
  tabId: string;
  title: string;
  pos: number;
  visible?: boolean | string;
  components: Component[];
}

export interface Component {
  componentId: string;
  type: string;
  pos?: number;
  _component?: string; // ссылка на пресет
  label?: string;
  visible?: boolean | string;
  enabled?: boolean | string;
  required?: boolean | string;
  readonly?: boolean | string;
  properties?: Record<string, any>;
}

// ServiceTask конфигурация

export interface ServiceTaskConfig {
  id: string;
  serviceTaskKey: string;
  version: number;
  type: string;
  ioMapping: IoMapping;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface IoMapping {
  inputs: IoInput[];
  outputs: IoOutput[];
}

export interface IoInput {
  name: string;
  value: string | FeelExpression;
}

export interface IoOutput {
  source: string;
  target: string;
}

export interface FeelExpression {
  type: 'feel';
  expression: string; // начинается с "="
}

// Реестры

export interface Registry {
  id: string;
  registryId: string;
  tenantId: string;
  name: string;
  description: string;
  version: number;
  items: RegistryItem[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface RegistryItem {
  itemId: string;
  label: string;
  value: any;
  code?: string;
  name?: string;
  properties?: Record<string, any>;
}

// Пресеты

export type PresetType = 'userTask' | 'component' | 'serviceTask' | 'tabGroup';

export interface Preset {
  id: string;
  presetId: string;
  tenantId: string;
  type: PresetType;
  name: string;
  description: string;
  version: number;
  content: any; // структура зависит от типа
  isDefault?: boolean; // флаг для использования по умолчанию при создании новых задач
  createdAt: string;
  updatedAt: string;
  author: string;
}

// Релизы

export interface Release {
  id: string;
  projectId: string;
  version: string;
  title: string;
  description: string;
  environment: Environment;
  snapshot: ReleaseSnapshot;
  testResults?: TestResult[];
  checklist: ChecklistItem[];
  author: string;
  createdAt: string;
  promotedFrom?: string;
}

export interface ReleaseSnapshot {
  userTasks: UserTaskConfig[];
  serviceTasks: ServiceTaskConfig[];
  registries: Registry[];
  bpmnFiles?: string[];
}

export interface TestResult {
  id: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  message?: string;
  duration: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  status: 'passed' | 'failed' | 'warning';
  message?: string;
}

// Аудит

export interface AuditRecord {
  id: string;
  timestamp: string;
  author: string;
  objectType: 'userTask' | 'serviceTask' | 'registry' | 'preset' | 'release';
  objectId: string;
  action: 'create' | 'update' | 'delete' | 'promote' | 'rollback';
  changes?: Record<string, any>;
  tenantId: string;
  projectId?: string;
}

// Импорт/Экспорт

export type ImportMode = 'replace' | 'merge';

export interface ImportOptions {
  mode: ImportMode;
  targetTenantId?: string;
  targetProjectId?: string;
}

export interface ExportData {
  type: 'project' | 'process' | 'task' | 'registry' | 'presets';
  data: any;
  metadata: {
    exportedAt: string;
    exportedBy: string;
    sourceTenant: string;
    sourceProject?: string;
  };
}
