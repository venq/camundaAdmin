import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Save, Plus, Trash2, EyeOff, GripVertical, X } from 'lucide-react';
import type { UserTaskConfig } from '@/types';
import { PresetCard } from '@/components/PresetCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './UserTaskEditorPage.css';

interface SortableComponentItemProps {
  comp: any;
  onDelete: () => void;
  isEditAllowed: boolean;
}

function SortableComponentItem({ comp, onDelete, isEditAllowed }: SortableComponentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: comp.componentId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="component-item">
      {isEditAllowed && (
        <div {...attributes} {...listeners} className="drag-handle">
          <GripVertical size={16} />
        </div>
      )}
      <span className="component-type badge badge-info">{comp.type}</span>
      <span className="component-label">{comp.label}</span>
      {comp._component && (
        <span className="component-preset" title="Использует пресет">
          📦 {comp._component}
        </span>
      )}
      {isEditAllowed && (
        <button
          className="btn-icon btn-danger component-delete"
          onClick={onDelete}
          title="Удалить компонент"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export function UserTaskEditorPage() {
  const { tenantId, projectId, taskKey } = useParams<{
    tenantId: string;
    projectId: string;
    taskKey: string;
  }>();
  const navigate = useNavigate();

  const { userTaskConfigs, selectedEnvironment, presets, addUserTaskConfig, bpmnProcesses, projects, setSelectedTenant, registries } = useAppStore();
  const [config, setConfig] = useState<UserTaskConfig | null>(
    userTaskConfigs.find((c) => c.taskDefinitionKey === taskKey) || null
  );

  const [activeTab, setActiveTab] = useState<string>('metadata');
  const [activeTabGroupId, setActiveTabGroupId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [showTabGroupModal, setShowTabGroupModal] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showLeftPanelComponentModal, setShowLeftPanelComponentModal] = useState(false);
  const [selectedTabForComponents, setSelectedTabForComponents] = useState<{ groupId: string; tabId: string } | null>(null);
  const [showRolePopup, setShowRolePopup] = useState<{ type: 'executor' | 'manager' | 'workgroup'; show: boolean }>({ type: 'executor', show: false });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Получаем данные для breadcrumb
  const project = projects.find((p) => p.id === projectId);
  // Находим BPMN процесс, в котором есть эта задача
  const bpmnProcess = bpmnProcesses.find((bp) =>
    bp.projectId === projectId &&
    (bp.userTasks.some(ut => ut.taskDefinitionKey === taskKey) ||
     bp.serviceTasks.some(st => st.serviceTaskKey === taskKey))
  );
  const processId = bpmnProcess?.id;

  // Получаем реестр ролей
  const userRolesRegistry = registries.find((r) => r.tenantId === tenantId && r.registryId === 'roles');
  const userRoles = userRolesRegistry?.items || [];

  // Получаем реестр ролей руководителей
  const managerRolesRegistry = registries.find((r) => r.tenantId === tenantId && r.registryId === 'managerRoles');
  const managerRoles = managerRolesRegistry?.items || [];

  // Для группы исполнителей объединяем оба реестра
  const availableExecutorRoles = [...userRoles, ...managerRoles];
  const availableManagerRoles = managerRoles;

  // Получаем реестр рабочих групп
  const workGroupsRegistry = registries.find((r) => r.tenantId === tenantId && r.registryId === 'workgroups');
  const availableWorkGroups = workGroupsRegistry?.items || [];

  // Устанавливаем selectedTenant для отображения левого меню
  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  // Автоматически создаем конфигурацию из default пресета, если её нет
  useEffect(() => {
    if (!config && taskKey) {
      // Находим default пресет для UserTask
      const defaultPreset = presets.find((p) => p.type === 'userTask' && p.isDefault && p.tenantId === tenantId);

      if (defaultPreset) {
        // Находим информацию о задаче из BPMN
        const bpmnTask = bpmnProcesses
          .flatMap((bp) => bp.userTasks)
          .find((t) => t.taskDefinitionKey === taskKey);

        // Создаем новую конфигурацию на основе пресета
        const newConfig: UserTaskConfig = {
          id: `utc-${Date.now()}`,
          taskDefinitionKey: taskKey!,
          version: 1,
          metadata: {
            title: bpmnTask?.name || taskKey!,
            description: `Автоматически созданная конфигурация для ${taskKey}`,
            assignee: '',
            executorGroups: [],
            managerGroups: [],
            workGroups: [],
            decision: taskKey!.split('.').pop()
          },
          decisions: defaultPreset.content.decisions || [],
          leftPanel: defaultPreset.content.leftPanel || [],
          tabGroups: defaultPreset.content.tabGroups || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'System'
        };

        // Добавляем в store
        addUserTaskConfig(newConfig);
        setConfig(newConfig);
      }
    }
  }, [config, taskKey, tenantId, projectId, presets, addUserTaskConfig, bpmnProcesses]);

  if (!config) {
    return (
      <div className="page">
        <div className="empty-state">Загрузка конфигурации...</div>
      </div>
    );
  }

  const isEditAllowed = selectedEnvironment === 'dev';

  const selectTabGroup = (groupId: string) => {
    setActiveTabGroupId(groupId);
    // Автоматически выбираем первый таб в группе
    const group = config?.tabGroups.find(g => g.tabGroupId === groupId);
    if (group && group.tabs.length > 0) {
      setActiveTabId(group.tabs[0].tabId);
    } else {
      setActiveTabId(null);
    }
  };

  const addTabGroupFromPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId && p.type === 'tabGroup');
    if (!preset || !config) return;

    const newTabGroup = {
      ...preset.content,
      tabGroupId: `${preset.content.tabGroupId}-${Date.now()}`,
      pos: config.tabGroups.length + 1
    };

    setConfig({
      ...config,
      tabGroups: [...config.tabGroups, newTabGroup]
    });
    setShowTabGroupModal(false);
  };

  const addComponentToTab = (componentPresetId: string) => {
    if (!selectedTabForComponents || !config) return;

    const preset = presets.find(p => p.id === componentPresetId && p.type === 'component');
    if (!preset) return;

    const newComponent = {
      componentId: `${preset.presetId}-${Date.now()}`,
      type: preset.content.type || 'unknown',
      _component: preset.presetId,
      label: preset.content.title || preset.name,
      pos: 1,
      ...preset.content
    };

    const updatedTabGroups = config.tabGroups.map(group => {
      if (group.tabGroupId === selectedTabForComponents.groupId) {
        return {
          ...group,
          tabs: group.tabs.map(tab => {
            if (tab.tabId === selectedTabForComponents.tabId) {
              return {
                ...tab,
                components: [...tab.components, newComponent]
              };
            }
            return tab;
          })
        };
      }
      return group;
    });

    setConfig({
      ...config,
      tabGroups: updatedTabGroups
    });
    setShowComponentModal(false);
    setSelectedTabForComponents(null);
  };

  const addNewTab = (groupId: string) => {
    if (!config) return;

    const group = config.tabGroups.find(g => g.tabGroupId === groupId);
    if (!group) return;

    const newTab = {
      tabId: `tab-${Date.now()}`,
      title: `Новый таб ${group.tabs.length + 1}`,
      pos: group.tabs.length + 1,
      visible: true,
      components: []
    };

    const updatedTabGroups = config.tabGroups.map(g => {
      if (g.tabGroupId === groupId) {
        return {
          ...g,
          tabs: [...g.tabs, newTab]
        };
      }
      return g;
    });

    setConfig({
      ...config,
      tabGroups: updatedTabGroups
    });
  };

  const removeTab = (groupId: string, tabId: string) => {
    if (!config) return;

    const updatedTabGroups = config.tabGroups.map(group => {
      if (group.tabGroupId === groupId) {
        return {
          ...group,
          tabs: group.tabs.filter(tab => tab.tabId !== tabId)
        };
      }
      return group;
    });

    setConfig({
      ...config,
      tabGroups: updatedTabGroups
    });
  };

  const removeTabGroup = (groupId: string) => {
    if (!config) return;

    setConfig({
      ...config,
      tabGroups: config.tabGroups.filter(g => g.tabGroupId !== groupId)
    });
  };

  const removeComponent = (groupId: string, tabId: string, componentId: string) => {
    if (!config) return;

    const updatedTabGroups = config.tabGroups.map(group => {
      if (group.tabGroupId === groupId) {
        return {
          ...group,
          tabs: group.tabs.map(tab => {
            if (tab.tabId === tabId) {
              return {
                ...tab,
                components: tab.components.filter(comp => comp.componentId !== componentId)
              };
            }
            return tab;
          })
        };
      }
      return group;
    });

    setConfig({
      ...config,
      tabGroups: updatedTabGroups
    });
  };

  const addComponentToLeftPanel = (componentPresetId: string) => {
    if (!config) return;

    const preset = presets.find(p => p.id === componentPresetId && p.type === 'component');
    if (!preset) return;

    const newComponent = {
      componentId: `${preset.presetId}-${Date.now()}`,
      type: preset.content.type || 'unknown',
      _component: preset.presetId,
      label: preset.content.title || preset.name,
      pos: config.leftPanel.length + 1,
      ...preset.content
    };

    setConfig({
      ...config,
      leftPanel: [...config.leftPanel, newComponent]
    });
    setShowLeftPanelComponentModal(false);
  };

  const removeLeftPanelComponent = (componentId: string) => {
    if (!config) return;

    setConfig({
      ...config,
      leftPanel: config.leftPanel.filter(comp => comp.componentId !== componentId)
    });
  };

  const handleLeftPanelDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!config || !over || active.id === over.id) return;

    const oldIndex = config.leftPanel.findIndex(c => c.componentId === active.id);
    const newIndex = config.leftPanel.findIndex(c => c.componentId === over.id);

    setConfig({
      ...config,
      leftPanel: arrayMove(config.leftPanel, oldIndex, newIndex),
    });
  };

  const handleTabComponentsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!config || !over || active.id === over.id || !activeTabGroupId || !activeTabId) return;

    const updatedTabGroups = config.tabGroups.map(group => {
      if (group.tabGroupId === activeTabGroupId) {
        return {
          ...group,
          tabs: group.tabs.map(tab => {
            if (tab.tabId === activeTabId) {
              const oldIndex = tab.components.findIndex(c => c.componentId === active.id);
              const newIndex = tab.components.findIndex(c => c.componentId === over.id);
              return {
                ...tab,
                components: arrayMove(tab.components, oldIndex, newIndex),
              };
            }
            return tab;
          })
        };
      }
      return group;
    });

    setConfig({
      ...config,
      tabGroups: updatedTabGroups,
    });
  };

  return (
    <div className="page editor-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="breadcrumb-link" onClick={() => navigate(`/tenants/${tenantId}/projects`)}>
              Процессы
            </span>
            {' / '}
            <span className="breadcrumb-link" onClick={() => navigate(`/tenants/${tenantId}/projects/${projectId}`)}>
              {project?.name}
            </span>
            {' / '}
            <span className="breadcrumb-link" onClick={() => navigate(`/tenants/${tenantId}/projects/${projectId}/bpmn/${processId}`)}>
              {bpmnProcess?.name}
            </span>
            {' / '}
            <span>{config.metadata.title}</span>
          </h1>
          <p className="page-description">
            {config.taskDefinitionKey} (версия {config.version})
          </p>
        </div>
        <div className="header-actions">
          {isEditAllowed && (
            <button className="btn btn-primary">
              <Save size={18} />
              Сохранить
            </button>
          )}
        </div>
      </div>

      <div className="editor-layout">
        <nav className="editor-tabs">
          <button
            className={`editor-tab ${activeTab === 'metadata' ? 'active' : ''}`}
            onClick={() => setActiveTab('metadata')}
          >
            Метаданные
          </button>
          <button
            className={`editor-tab ${activeTab === 'decisions' ? 'active' : ''}`}
            onClick={() => setActiveTab('decisions')}
          >
            Решения ({config.decisions.length})
          </button>
          <button
            className={`editor-tab ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            Структура экранов
          </button>
          <button
            className={`editor-tab ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            Тесты
          </button>
        </nav>

        <div className="editor-content">
          {activeTab === 'metadata' && (
            <div className="editor-section">
              <h2 className="section-title">Метаданные задачи</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label>Название задачи</label>
                  <input
                    type="text"
                    className="input"
                    value={config.metadata.title}
                    disabled={!isEditAllowed}
                  />
                </div>
                <div className="form-field full-width">
                  <label>Описание</label>
                  <textarea
                    className="textarea"
                    value={config.metadata.description}
                    disabled={!isEditAllowed}
                  />
                </div>
                <div className="form-field full-width">
                  <label>Assignee</label>
                  <input
                    type="text"
                    className="input"
                    value={config.metadata.assignee || ''}
                    placeholder="Login или FEEL expression (например: =initiator.login)"
                    disabled={!isEditAllowed}
                  />
                  <small className="field-hint">
                    Введите login ответственного или FEEL expression (начинается с "=")
                  </small>
                </div>
                <div className="form-field full-width">
                  <label>
                    Группа исполнителей
                    {isEditAllowed && (
                      <button
                        className="btn-icon-small"
                        onClick={() => setShowRolePopup({ type: 'executor', show: true })}
                        style={{ marginLeft: '8px' }}
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </label>
                  <div className="group-selector">
                    {(config.metadata.executorGroups || []).map((groupCode: string, index: number) => {
                      const role = availableExecutorRoles.find((r: any) => r.code === groupCode || r.itemId === groupCode);
                      return (
                        <div key={index} className="group-tag">
                          <span className="group-code">{groupCode}</span>
                          {role && <span className="group-name"> - {role.name || role.label}</span>}
                          {isEditAllowed && (
                            <button
                              className="btn-icon-small"
                              onClick={() => {
                                const newGroups = [...(config.metadata.executorGroups || [])];
                                newGroups.splice(index, 1);
                                setConfig({ ...config, metadata: { ...config.metadata, executorGroups: newGroups } });
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="form-field full-width">
                  <label>
                    Группа руководителей
                    {isEditAllowed && (
                      <button
                        className="btn-icon-small"
                        onClick={() => setShowRolePopup({ type: 'manager', show: true })}
                        style={{ marginLeft: '8px' }}
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </label>
                  <div className="group-selector">
                    {(config.metadata.managerGroups || []).map((groupCode: string, index: number) => {
                      const role = availableManagerRoles.find((r: any) => r.code === groupCode || r.itemId === groupCode);
                      return (
                        <div key={index} className="group-tag">
                          <span className="group-code">{groupCode}</span>
                          {role && <span className="group-name"> - {role.name || role.label}</span>}
                          {isEditAllowed && (
                            <button
                              className="btn-icon-small"
                              onClick={() => {
                                const newGroups = [...(config.metadata.managerGroups || [])];
                                newGroups.splice(index, 1);
                                setConfig({ ...config, metadata: { ...config.metadata, managerGroups: newGroups } });
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="form-field full-width">
                  <label>
                    Рабочая группа
                    {isEditAllowed && (
                      <button
                        className="btn-icon-small"
                        onClick={() => setShowRolePopup({ type: 'workgroup', show: true })}
                        style={{ marginLeft: '8px' }}
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </label>
                  <div className="group-selector">
                    {(config.metadata.workGroups || []).map((groupCode: string, index: number) => {
                      const workGroup = availableWorkGroups.find((wg: any) => wg.code === groupCode || wg.itemId === groupCode);
                      return (
                        <div key={index} className="group-tag">
                          <span className="group-code">{groupCode}</span>
                          {workGroup && <span className="group-name"> - {workGroup.name || workGroup.label}</span>}
                          {isEditAllowed && (
                            <button
                              className="btn-icon-small"
                              onClick={() => {
                                const newGroups = [...(config.metadata.workGroups || [])];
                                newGroups.splice(index, 1);
                                setConfig({ ...config, metadata: { ...config.metadata, workGroups: newGroups } });
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'decisions' && (
            <div className="editor-section">
              <div className="section-header">
                <h2 className="section-title">Решения</h2>
                {isEditAllowed && (
                  <button className="btn btn-sm btn-primary">
                    <Plus size={16} />
                    Добавить решение
                  </button>
                )}
              </div>

              <div className="decisions-list">
                {config.decisions.map((decision) => (
                  <div key={decision.decisionId} className="decision-card card">
                    <div className="decision-header">
                      <div className="decision-info">
                        <h3 className="decision-title">{decision.title}</h3>
                        <code className="decision-id">{decision.decisionId}</code>
                      </div>
                      {isEditAllowed && (
                        <button className="btn-icon btn-danger">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="decision-properties">
                      <div className="property-row">
                        <span className="property-label">Тип:</span>
                        <span className={`badge badge-${decision.type === 'ACCEPT' ? 'success' : decision.type === 'REJECT' ? 'danger' : 'warning'}`}>
                          {decision.type}
                        </span>
                      </div>
                      <div className="property-row">
                        <span className="property-label">Валидация:</span>
                        <span>{decision.validate ? 'Да' : 'Нет'}</span>
                      </div>
                      {decision.comment && (
                        <>
                          <div className="property-row">
                            <span className="property-label">Комментарий:</span>
                            <span>
                              {decision.comment.visible ? 'Видимый' : 'Скрытый'}
                              {decision.comment.require && ', обязательный'}
                              {decision.comment.readonly && ', только чтение'}
                            </span>
                          </div>
                          {decision.comment.permissions && decision.comment.permissions.length > 0 && (
                            <div className="property-row">
                              <span className="property-label">Права на комментарий:</span>
                              <span>{decision.comment.permissions.map(p => p.readRole).join(', ')}</span>
                            </div>
                          )}
                        </>
                      )}
                      {decision.properties?.transient && (
                        <div className="property-row">
                          <span className="property-label">Transient:</span>
                          <span>Да</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-section" style={{ marginTop: '24px' }}>
                <div className="form-field full-width">
                  <label>Решение по задаче</label>
                  <input
                    type="text"
                    className="input"
                    value={config.metadata.decision || ''}
                    placeholder={taskKey?.split('.').pop() || ''}
                    onChange={(e) => {
                      if (isEditAllowed) {
                        setConfig({
                          ...config,
                          metadata: { ...config.metadata, decision: e.target.value }
                        });
                      }
                    }}
                    disabled={!isEditAllowed}
                  />
                  <small className="field-hint">
                    По умолчанию используется последняя часть ID задачи: {taskKey?.split('.').pop()}
                  </small>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="editor-section">
              <h2 className="section-title">Структура экранов</h2>

              <div className="structure-layout">
                <div className="structure-panel">
                  <div className="panel-header">
                    <h3 className="panel-title">Левая панель</h3>
                    {isEditAllowed && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowLeftPanelComponentModal(true)}
                      >
                        <Plus size={14} />
                        Добавить компонент
                      </button>
                    )}
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleLeftPanelDragEnd}
                  >
                    <SortableContext
                      items={config.leftPanel.map(c => c.componentId)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="components-list">
                        {config.leftPanel.map((comp) => (
                          <SortableComponentItem
                            key={comp.componentId}
                            comp={comp}
                            onDelete={() => removeLeftPanelComponent(comp.componentId)}
                            isEditAllowed={isEditAllowed}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                <div className="structure-panel">
                  <div className="panel-header">
                    <h3 className="panel-title">Правая панель (TabGroups)</h3>
                    {isEditAllowed && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowTabGroupModal(true)}
                      >
                        <Plus size={14} />
                        Добавить TabGroup
                      </button>
                    )}
                  </div>

                  <div className="tabgroups-list">
                    {/* 1-й уровень: TabGroups */}
                    <div className="tabgroup-headers-row">
                      {config.tabGroups.map((group) => (
                        <div
                          key={group.tabGroupId}
                          className={`tabgroup-header ${activeTabGroupId === group.tabGroupId ? 'expanded' : ''}`}
                          onClick={() => selectTabGroup(group.tabGroupId)}
                        >
                          <div className="tabgroup-header-left">
                            <span className="tabgroup-title">{group.title}</span>
                            <span className="badge badge-info">{group.tabs.length}</span>
                          </div>
                          {isEditAllowed && (
                            <div className="tabgroup-actions">
                              <button
                                className="btn-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addNewTab(group.tabGroupId);
                                }}
                                title="Добавить таб"
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                className="btn-icon btn-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTabGroup(group.tabGroupId);
                                }}
                                title="Удалить группу табов"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 2-й уровень: Табы активной TabGroup */}
                    {activeTabGroupId && config.tabGroups.find(g => g.tabGroupId === activeTabGroupId) && (
                      <div className="tabs-list">
                        {config.tabGroups
                          .find(g => g.tabGroupId === activeTabGroupId)!
                          .tabs.map((tab) => (
                            <div
                              key={tab.tabId}
                              className={`tab-item ${activeTabId === tab.tabId ? 'active' : ''}`}
                              onClick={() => setActiveTabId(tab.tabId)}
                            >
                              <span className="tab-title">{tab.title}</span>
                              <span className="badge badge-success">{tab.components.length}</span>
                              {isEditAllowed && (
                                <div className="tab-actions">
                                  <button
                                    className="btn-icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTabForComponents({ groupId: activeTabGroupId, tabId: tab.tabId });
                                      setShowComponentModal(true);
                                    }}
                                    title="Добавить компонент"
                                  >
                                    <Plus size={14} />
                                  </button>
                                  <button
                                    className="btn-icon btn-danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeTab(activeTabGroupId, tab.tabId);
                                    }}
                                    title="Удалить таб"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Контент активного таба */}
                    {activeTabGroupId && activeTabId && (
                      <div className="tab-content">
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleTabComponentsDragEnd}
                        >
                          <SortableContext
                            items={config.tabGroups
                              .find(g => g.tabGroupId === activeTabGroupId)
                              ?.tabs.find(t => t.tabId === activeTabId)
                              ?.components.map(c => c.componentId) || []}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="components-list">
                              {config.tabGroups
                                .find(g => g.tabGroupId === activeTabGroupId)
                                ?.tabs.find(t => t.tabId === activeTabId)
                                ?.components.map((comp) => (
                                  <SortableComponentItem
                                    key={comp.componentId}
                                    comp={comp}
                                    onDelete={() => removeComponent(activeTabGroupId, activeTabId, comp.componentId)}
                                    isEditAllowed={isEditAllowed}
                                  />
                                ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="editor-section">
              <div className="section-header">
                <h2 className="section-title">Unit-тесты конфигурации</h2>
                <button className="btn btn-sm btn-primary">
                  Запустить тесты
                </button>
              </div>
              <div className="tests-placeholder">
                <p>Тесты конфигурации запускаются автоматически при релизе</p>
                <ul>
                  <li>Уникальность ID</li>
                  <li>Валидность ссылок на компоненты и реестры</li>
                  <li>Наличие обязательных разделов</li>
                  <li>Отсутствие пустых табов</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isEditAllowed && (
        <div className="readonly-overlay">
          <EyeOff size={20} />
          <span>Редактирование доступно только в окружении DEV</span>
        </div>
      )}

      {/* Модальное окно для выбора TabGroup пресета */}
      {showTabGroupModal && (
        <div className="modal-overlay" onClick={() => setShowTabGroupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Выберите TabGroup пресет</h2>
              <button className="btn-icon" onClick={() => setShowTabGroupModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="presets-list">
                {presets
                  .filter(p => p.type === 'tabGroup' && p.tenantId === tenantId)
                  .map(preset => (
                    <div
                      key={preset.id}
                      className="preset-item"
                      onClick={() => addTabGroupFromPreset(preset.id)}
                    >
                      <h3>{preset.name}</h3>
                      <p>{preset.description}</p>
                      <span className="badge badge-info">
                        {preset.content.tabs?.length || 0} табов
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для выбора Component пресета */}
      {showComponentModal && (
        <div className="modal-overlay" onClick={() => setShowComponentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Выберите компонент</h2>
              <button className="btn-icon" onClick={() => setShowComponentModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-presets-grid">
                {presets
                  .filter(p => p.type === 'component' && p.tenantId === tenantId)
                  .filter(preset => {
                    // Проверяем, нет ли уже компонента с таким типом в активном табе
                    if (!activeTabGroupId || !activeTabId) return true;
                    const activeTab = config.tabGroups
                      .find(g => g.tabGroupId === activeTabGroupId)
                      ?.tabs.find(t => t.tabId === activeTabId);
                    if (!activeTab) return true;

                    const componentType = preset.content.type;
                    return !activeTab.components.some(c => c.type === componentType);
                  })
                  .map(preset => (
                    <div key={preset.id} onClick={() => addComponentToTab(preset.id)}>
                      <PresetCard
                        preset={preset}
                        isEditAllowed={false}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для выбора Component пресета для левой панели */}
      {showLeftPanelComponentModal && (
        <div className="modal-overlay" onClick={() => setShowLeftPanelComponentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Выберите компонент для левой панели</h2>
              <button className="btn-icon" onClick={() => setShowLeftPanelComponentModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-presets-grid">
                {presets
                  .filter(p => p.type === 'component' && p.tenantId === tenantId)
                  .filter(preset => {
                    // Проверяем, нет ли уже компонента с таким типом в левой панели
                    const componentType = preset.content.type;
                    return !config.leftPanel.some(c => c.type === componentType);
                  })
                  .map(preset => (
                    <div key={preset.id} onClick={() => addComponentToLeftPanel(preset.id)}>
                      <PresetCard
                        preset={preset}
                        isEditAllowed={false}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Попап выбора роли */}
      {showRolePopup.show && (
        <div className="modal-overlay" onClick={() => setShowRolePopup({ ...showRolePopup, show: false })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {showRolePopup.type === 'executor' && 'Добавить группу исполнителей'}
                {showRolePopup.type === 'manager' && 'Добавить группу руководителей'}
                {showRolePopup.type === 'workgroup' && 'Добавить рабочую группу'}
              </h3>
              <button className="btn-icon" onClick={() => setShowRolePopup({ ...showRolePopup, show: false })}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="role-list">
                {(showRolePopup.type === 'workgroup' ? availableWorkGroups :
                  showRolePopup.type === 'manager' ? availableManagerRoles :
                  availableExecutorRoles)
                  .sort((a: any, b: any) => {
                    const codeA = a.code || a.itemId;
                    const codeB = b.code || b.itemId;
                    return codeA.localeCompare(codeB);
                  })
                  .map((role: any) => {
                  const roleCode = role.code || role.itemId;
                  const isSelected =
                    showRolePopup.type === 'executor' ? config?.metadata.executorGroups?.includes(roleCode) :
                    showRolePopup.type === 'manager' ? config?.metadata.managerGroups?.includes(roleCode) :
                    config?.metadata.workGroups?.includes(roleCode);

                  return (
                    <div
                      key={roleCode}
                      className={`role-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (!config) return;

                        if (showRolePopup.type === 'executor') {
                          const newGroups = [...(config.metadata.executorGroups || [])];
                          if (!newGroups.includes(roleCode)) {
                            newGroups.push(roleCode);
                            setConfig({ ...config, metadata: { ...config.metadata, executorGroups: newGroups } });
                          }
                        } else if (showRolePopup.type === 'manager') {
                          const newGroups = [...(config.metadata.managerGroups || [])];
                          if (!newGroups.includes(roleCode)) {
                            newGroups.push(roleCode);
                            setConfig({ ...config, metadata: { ...config.metadata, managerGroups: newGroups } });
                          }
                        } else {
                          const newGroups = [...(config.metadata.workGroups || [])];
                          if (!newGroups.includes(roleCode)) {
                            newGroups.push(roleCode);
                            setConfig({ ...config, metadata: { ...config.metadata, workGroups: newGroups } });
                          }
                        }
                        setShowRolePopup({ ...showRolePopup, show: false });
                      }}
                    >
                      <code>{roleCode}</code>
                      <span> - {role.name || role.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
