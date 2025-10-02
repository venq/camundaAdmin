// Zustand store для управления состоянием приложения

import { create } from 'zustand';
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
  User,
  Environment
} from '@/types';
import {
  mockUser,
  mockTenants,
  mockProjects,
  mockBpmnProcesses,
  mockUserTaskConfig,
  mockServiceTaskConfig,
  mockRegistries,
  mockPresets,
  mockReleases,
  mockAuditRecords
} from '@/data/mockData';

interface AppState {
  // Текущий пользователь
  user: User | null;

  // Выбранные сущности
  selectedTenantId: string | null;
  selectedProjectId: string | null;
  selectedEnvironment: Environment;

  // Данные
  tenants: Tenant[];
  projects: Project[];
  bpmnProcesses: BpmnProcess[];
  userTaskConfigs: UserTaskConfig[];
  serviceTaskConfigs: ServiceTaskConfig[];
  registries: Registry[];
  presets: Preset[];
  releases: Release[];
  auditRecords: AuditRecord[];

  // Действия
  setUser: (user: User) => void;
  setSelectedTenant: (tenantId: string | null) => void;
  setSelectedProject: (projectId: string | null) => void;
  setSelectedEnvironment: (env: Environment) => void;

  // CRUD для тенантов
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;

  // CRUD для проектов
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // CRUD для конфигураций задач
  addUserTaskConfig: (config: UserTaskConfig) => void;
  updateUserTaskConfig: (id: string, updates: Partial<UserTaskConfig>) => void;
  deleteUserTaskConfig: (id: string) => void;

  addServiceTaskConfig: (config: ServiceTaskConfig) => void;
  updateServiceTaskConfig: (id: string, updates: Partial<ServiceTaskConfig>) => void;
  deleteServiceTaskConfig: (id: string) => void;

  // CRUD для реестров
  addRegistry: (registry: Registry) => void;
  updateRegistry: (id: string, updates: Partial<Registry>) => void;
  deleteRegistry: (id: string) => void;

  // CRUD для пресетов
  addPreset: (preset: Preset) => void;
  updatePreset: (id: string, updates: Partial<Preset>) => void;
  deletePreset: (id: string) => void;

  // Релизы
  addRelease: (release: Release) => void;
  promoteRelease: (id: string, toEnvironment: Environment) => void;
  rollbackRelease: (projectId: string, environment: Environment) => void;

  // Аудит
  addAuditRecord: (record: AuditRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Начальное состояние
  user: mockUser,
  selectedTenantId: null,
  selectedProjectId: null,
  selectedEnvironment: 'dev',

  tenants: mockTenants,
  projects: mockProjects,
  bpmnProcesses: mockBpmnProcesses,
  userTaskConfigs: [mockUserTaskConfig],
  serviceTaskConfigs: [mockServiceTaskConfig],
  registries: mockRegistries,
  presets: mockPresets,
  releases: mockReleases,
  auditRecords: mockAuditRecords,

  // Базовые действия
  setUser: (user) => set({ user }),
  setSelectedTenant: (tenantId) => set({ selectedTenantId: tenantId }),
  setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),
  setSelectedEnvironment: (env) => set({ selectedEnvironment: env }),

  // Тенанты
  addTenant: (tenant) => set((state) => ({
    tenants: [...state.tenants, tenant]
  })),

  updateTenant: (id, updates) => set((state) => ({
    tenants: state.tenants.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    )
  })),

  deleteTenant: (id) => set((state) => ({
    tenants: state.tenants.filter((t) => t.id !== id)
  })),

  // Проекты
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id)
  })),

  // UserTask конфигурации
  addUserTaskConfig: (config) => set((state) => ({
    userTaskConfigs: [...state.userTaskConfigs, config]
  })),

  updateUserTaskConfig: (id, updates) => set((state) => ({
    userTaskConfigs: state.userTaskConfigs.map((c) =>
      c.id === id
        ? { ...c, ...updates, version: c.version + 1, updatedAt: new Date().toISOString() }
        : c
    )
  })),

  deleteUserTaskConfig: (id) => set((state) => ({
    userTaskConfigs: state.userTaskConfigs.filter((c) => c.id !== id)
  })),

  // ServiceTask конфигурации
  addServiceTaskConfig: (config) => set((state) => ({
    serviceTaskConfigs: [...state.serviceTaskConfigs, config]
  })),

  updateServiceTaskConfig: (id, updates) => set((state) => ({
    serviceTaskConfigs: state.serviceTaskConfigs.map((c) =>
      c.id === id
        ? { ...c, ...updates, version: c.version + 1, updatedAt: new Date().toISOString() }
        : c
    )
  })),

  deleteServiceTaskConfig: (id) => set((state) => ({
    serviceTaskConfigs: state.serviceTaskConfigs.filter((c) => c.id !== id)
  })),

  // Реестры
  addRegistry: (registry) => set((state) => ({
    registries: [...state.registries, registry]
  })),

  updateRegistry: (id, updates) => set((state) => ({
    registries: state.registries.map((r) =>
      r.id === id
        ? { ...r, ...updates, version: r.version + 1, updatedAt: new Date().toISOString() }
        : r
    )
  })),

  deleteRegistry: (id) => set((state) => ({
    registries: state.registries.filter((r) => r.id !== id)
  })),

  // Пресеты
  addPreset: (preset) => set((state) => ({
    presets: [...state.presets, preset]
  })),

  updatePreset: (id, updates) => set((state) => ({
    presets: state.presets.map((p) =>
      p.id === id
        ? { ...p, ...updates, version: p.version + 1, updatedAt: new Date().toISOString() }
        : p
    )
  })),

  deletePreset: (id) => set((state) => ({
    presets: state.presets.filter((p) => p.id !== id)
  })),

  // Релизы
  addRelease: (release) => set((state) => ({
    releases: [...state.releases, release]
  })),

  promoteRelease: (id, toEnvironment) => set((state) => {
    const release = state.releases.find((r) => r.id === id);
    if (!release) return state;

    const newRelease: Release = {
      ...release,
      id: `${id}-promoted-${Date.now()}`,
      environment: toEnvironment,
      promotedFrom: id,
      createdAt: new Date().toISOString()
    };

    return {
      releases: [...state.releases, newRelease]
    };
  }),

  rollbackRelease: (projectId, environment) => set((state) => {
    // Найти предыдущий релиз для отката
    const projectReleases = state.releases
      .filter((r) => r.projectId === projectId && r.environment === environment)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (projectReleases.length < 2) return state;

    const previousRelease = projectReleases[1];
    const rollbackRelease: Release = {
      ...previousRelease,
      id: `rollback-${Date.now()}`,
      title: `Откат к ${previousRelease.version}`,
      createdAt: new Date().toISOString()
    };

    return {
      releases: [...state.releases, rollbackRelease]
    };
  }),

  // Аудит
  addAuditRecord: (record) => set((state) => ({
    auditRecords: [...state.auditRecords, record]
  }))
}));
