import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { AlertCircle, CheckCircle2, Plus, FileText, ZoomIn, ZoomOut, Maximize2, Home } from 'lucide-react';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import './BpmnViewerPage.css';

export function BpmnViewerPage() {
  const { tenantId, projectId, processId } = useParams<{
    tenantId: string;
    projectId: string;
    processId: string;
  }>();
  const navigate = useNavigate();
  const { bpmnProcesses, projects, tenants, selectedEnvironment, setSelectedTenant } = useAppStore();
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<BpmnViewer | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const tenant = tenants.find((t) => t.id === tenantId);
  const project = projects.find((p) => p.id === projectId);
  const bpmnProcess = bpmnProcesses.find((bp) => bp.id === processId);

  // Устанавливаем выбранный тенант при монтировании компонента
  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  // Функция для получения координат элемента из BPMN
  const getElementPosition = (taskKey: string, taskType: 'user' | 'service') => {
    if (!viewerInstance.current) return { x: 0, y: 0 };

    try {
      const elementRegistry = viewerInstance.current.get('elementRegistry');
      const allElements = elementRegistry.getAll();

      for (const el of allElements) {
        const isMatchingType =
          (taskType === 'user' && el.type === 'bpmn:UserTask') ||
          (taskType === 'service' && el.type === 'bpmn:ServiceTask');

        if (isMatchingType) {
          const taskDef = el.businessObject?.extensionElements?.values?.find(
            (ext: any) => ext.$type === 'zeebe:taskDefinition'
          );

          if (taskDef?.type === taskKey || el.id === taskKey) {
            // Возвращаем координаты элемента
            return { x: el.x || 0, y: el.y || 0 };
          }
        }
      }
    } catch (error) {
      console.error('Error getting element position:', error);
    }

    return { x: 0, y: 0 };
  };

  // Сортируем задачи по позиции на диаграмме (только после загрузки viewer)
  const sortedUserTasks = useMemo(() => {
    if (!viewerLoaded || !bpmnProcess?.userTasks) return bpmnProcess?.userTasks || [];

    return [...bpmnProcess.userTasks].sort((a, b) => {
      const posA = getElementPosition(a.taskDefinitionKey, 'user');
      const posB = getElementPosition(b.taskDefinitionKey, 'user');

      // Сначала по Y (сверху вниз), потом по X (слева направо)
      if (Math.abs(posA.y - posB.y) > 50) { // Порог 50px для одной "линии"
        return posA.y - posB.y;
      }
      return posA.x - posB.x;
    });
  }, [viewerLoaded, bpmnProcess?.userTasks]);

  const sortedServiceTasks = useMemo(() => {
    if (!viewerLoaded || !bpmnProcess?.serviceTasks) return bpmnProcess?.serviceTasks || [];

    return [...bpmnProcess.serviceTasks].sort((a, b) => {
      const posA = getElementPosition(a.type, 'service');
      const posB = getElementPosition(b.type, 'service');

      if (Math.abs(posA.y - posB.y) > 50) {
        return posA.y - posB.y;
      }
      return posA.x - posB.x;
    });
  }, [viewerLoaded, bpmnProcess?.serviceTasks]);

  useEffect(() => {
    if (!viewerRef.current || !bpmnProcess) return;

    // Создаем экземпляр BPMN Viewer с навигацией
    const viewer = new BpmnViewer({
      container: viewerRef.current,
      height: '100%',
      width: '100%',
      keyboard: {
        bindTo: document
      }
    });

    viewerInstance.current = viewer;

    // Функция для загрузки BPMN из файла
    const loadBpmnFile = async () => {
      try {
        // Пытаемся загрузить реальный BPMN файл
        const response = await fetch(`/bpmn/${bpmnProcess.fileName}`);
        if (response.ok) {
          const xml = await response.text();
          return xml;
        } else {
          // Если файл не найден, используем XML из моков
          return bpmnProcess.bpmnXml;
        }
      } catch (error) {
        console.warn('Не удалось загрузить BPMN файл, используем данные из моков');
        return bpmnProcess.bpmnXml;
      }
    };

    // Даем контейнеру время на рендеринг перед импортом XML
    const timer = setTimeout(() => {
      // Загружаем и отображаем BPMN
      loadBpmnFile().then((xml) => {
        viewer.importXML(xml)
          .then(() => {
            const canvas = viewer.get('canvas');
            canvas.zoom('fit-viewport');
            setViewerError(null);
            setViewerLoaded(true); // Устанавливаем флаг загрузки

            // Добавляем обработчик клика по элементам диаграммы
            const eventBus = viewer.get('eventBus');
            eventBus.on('element.click', (event: any) => {
              const element = event.element;
              if (element.type === 'bpmn:UserTask' || element.type === 'bpmn:ServiceTask') {
                // Получаем taskDefinitionKey из элемента
                // Способ 1: Пробуем zeebe:taskDefinition (с маленькой буквы!)
                const taskDef = element.businessObject?.extensionElements?.values?.find(
                  (ext: any) => ext.$type === 'zeebe:taskDefinition'
                );
                // Способ 2: Используем ID элемента напрямую
                const taskKey = taskDef?.type || element.id;

                if (taskKey) {
                  setSelectedElementId(taskKey);

                  // Скроллим к элементу в sidebar
                  setTimeout(() => {
                    const taskElement = document.querySelector(`[data-element-id="${taskKey}"]`);
                    if (taskElement) {
                      taskElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }, 100);
                }
              }
            });
          })
          .catch((err: Error) => {
            console.error('Ошибка загрузки BPMN:', err);
            setViewerError(err.message);
          });
      });
    }, 100); // Задержка 100ms для инициализации контейнера

    // Очистка при размонтировании
    return () => {
      clearTimeout(timer);
      viewer.destroy();
    };
  }, [bpmnProcess]);

  const handleTaskHover = (taskDefinitionKeyOrType: string, taskType: 'user' | 'service') => {
    // Устанавливаем выбранный элемент
    setSelectedElementId(taskDefinitionKeyOrType);

    // Центрируем элемент в диаграмме и подсвечиваем
    if (viewerInstance.current) {
      try {
        const elementRegistry = viewerInstance.current.get('elementRegistry');
        const canvas = viewerInstance.current.get('canvas');

        // Ищем элемент по taskDefinitionKey или type
        const allElements = elementRegistry.getAll();
        let foundElement = null;

        for (const el of allElements) {
          if (taskType === 'user' && el.type === 'bpmn:UserTask') {
            // Способ 1: ID элемента совпадает с taskDefinitionKey
            if (el.id === taskDefinitionKeyOrType) {
              foundElement = el;
              break;
            }
            // Способ 2: Ищем в zeebe:taskDefinition
            const taskDef = el.businessObject?.extensionElements?.values?.find(
              (ext: any) => ext.$type === 'zeebe:taskDefinition'
            );
            if (taskDef?.type === taskDefinitionKeyOrType) {
              foundElement = el;
              break;
            }
          } else if (taskType === 'service' && el.type === 'bpmn:ServiceTask') {
            // Для ServiceTask ищем в zeebe:taskDefinition
            const taskDef = el.businessObject?.extensionElements?.values?.find(
              (ext: any) => ext.$type === 'zeebe:taskDefinition'
            );

            if (taskDef?.type === taskDefinitionKeyOrType) {
              foundElement = el;
              break;
            }

            // Способ 2: ID элемента совпадает с type (для случаев без zeebe:taskDefinition)
            if (el.id === taskDefinitionKeyOrType) {
              foundElement = el;
              break;
            }
          }
        }

        if (foundElement) {
          // Плавно увеличиваем масштаб для выбранного элемента
          const currentZoom = canvas.zoom();
          const targetZoom = 1.5; // Фиксированный масштаб 150% для удобного просмотра

          // Анимируем zoom только если текущий масштаб меньше целевого
          if (currentZoom < targetZoom) {
            canvas.zoom(targetZoom, 'auto');
          }

          // Центрируем элемент
          setTimeout(() => {
            canvas.scrollToElement(foundElement, { top: 150 });
          }, 100);

          // Подсвечиваем элемент
          const selection = viewerInstance.current.get('selection');
          selection.select(foundElement);
        }
      } catch (error) {
        console.error('Error in handleTaskHover:', error);
      }
    }
  };

  const handleTaskClick = (taskKey: string, type: 'user' | 'service') => {
    if (type === 'user') {
      navigate(`/tenants/${tenantId}/projects/${projectId}/user-tasks/${taskKey}`);
    } else {
      navigate(`/tenants/${tenantId}/projects/${projectId}/service-tasks/${taskKey}`);
    }
  };

  const handleCreateDrafts = () => {
    alert('Мастер создания черновиков для всех отсутствующих нод запущен');
  };

  const handleZoomIn = () => {
    if (viewerInstance.current) {
      const zoomScroll = viewerInstance.current.get('zoomScroll');
      zoomScroll.stepZoom(1);
    }
  };

  const handleZoomOut = () => {
    if (viewerInstance.current) {
      const zoomScroll = viewerInstance.current.get('zoomScroll');
      zoomScroll.stepZoom(-1);
    }
  };

  const handleZoomReset = () => {
    if (viewerInstance.current) {
      const canvas = viewerInstance.current.get('canvas');
      canvas.zoom('fit-viewport');
    }
  };

  const handleZoomActual = () => {
    if (viewerInstance.current) {
      const canvas = viewerInstance.current.get('canvas');
      canvas.zoom(1);
    }
  };

  if (!project || !bpmnProcess) {
    return (
      <div className="page">
        <div className="empty-state">Процесс или BPMN процесс не найден</div>
      </div>
    );
  }

  const isEditAllowed = selectedEnvironment === 'dev';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span
              className="breadcrumb-link"
              onClick={() => navigate(`/tenants/${tenantId}/projects`)}
            >
              Процессы
            </span>
            {' / '}
            <span
              className="breadcrumb-link"
              onClick={() => navigate(`/tenants/${tenantId}/projects/${projectId}`)}
            >
              {project?.name}
            </span>
            {' / '}
            <span>{bpmnProcess.name}</span>
          </h1>
          <p className="page-description">
            {bpmnProcess.processId} • {bpmnProcess.fileName}
          </p>
        </div>
        <div className="header-actions">
          {isEditAllowed && (
            <button className="btn btn-primary" onClick={handleCreateDrafts}>
              <Plus size={18} />
              Создать черновики для всех нод
            </button>
          )}
          <button className="btn btn-secondary">
            <FileText size={18} />
            Экспорт BPMN
          </button>
        </div>
      </div>

      <div className="bpmn-layout">
        <div className="bpmn-viewer-container">
          {viewerError && (
            <div className="bpmn-error">
              <AlertCircle size={24} />
              <p>Ошибка загрузки BPMN: {viewerError}</p>
            </div>
          )}

          <div className="bpmn-canvas-wrapper">
            <div className="bpmn-canvas" ref={viewerRef}></div>

            <div className="bpmn-controls">
              <button
                className="bpmn-control-btn"
                onClick={handleZoomIn}
                title="Приблизить (+)"
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="bpmn-control-btn"
                onClick={handleZoomOut}
                title="Отдалить (-)"
              >
                <ZoomOut size={18} />
              </button>
              <button
                className="bpmn-control-btn"
                onClick={handleZoomReset}
                title="Вместить в экран (F)"
              >
                <Maximize2 size={18} />
              </button>
              <button
                className="bpmn-control-btn"
                onClick={handleZoomActual}
                title="100% масштаб (1)"
              >
                <Home size={18} />
              </button>
            </div>

            <div className="bpmn-hints">
              <div className="hint-item">🖱️ Колесо мыши - масштабирование</div>
              <div className="hint-item">✋ Левая кнопка - перетаскивание</div>
              <div className="hint-item">⌨️ + / - - зум</div>
            </div>
          </div>

          {!isEditAllowed && (
            <div className="readonly-banner">
              <AlertCircle size={16} />
              <span>Редактирование доступно только в окружении DEV</span>
            </div>
          )}
        </div>

        <aside className="bpmn-sidebar" ref={sidebarRef}>
          <div className="sidebar-section">
            <h3 className="sidebar-title">UserTasks ({sortedUserTasks.length})</h3>
            <div className="task-list">
              {sortedUserTasks.map((task) => (
                <div
                  key={task.id}
                  data-element-id={task.taskDefinitionKey}
                  className={`task-item ${task.status} ${selectedElementId === task.taskDefinitionKey ? 'selected' : ''}`}
                  onMouseEnter={() => handleTaskHover(task.taskDefinitionKey, 'user')}
                  onClick={() => handleTaskClick(task.taskDefinitionKey, 'user')}
                >
                  <div className="task-info">
                    <div className="task-name">{task.name}</div>
                    <div className="task-key">{task.taskDefinitionKey}</div>
                  </div>
                  <div className="task-status">
                    {task.status === 'configured' && (
                      <CheckCircle2 size={18} className="status-icon configured" />
                    )}
                    {task.status === 'new' && (
                      <AlertCircle size={18} className="status-icon new" />
                    )}
                    {task.status === 'extra' && (
                      <AlertCircle size={18} className="status-icon extra" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">ServiceTasks ({sortedServiceTasks.length})</h3>
            <div className="task-list">
              {sortedServiceTasks.map((task) => (
                <div
                  key={task.id}
                  data-element-id={task.type}
                  className={`task-item ${task.status} ${selectedElementId === task.type ? 'selected' : ''}`}
                  onMouseEnter={() => handleTaskHover(task.type, 'service')}
                  onClick={() => handleTaskClick(task.serviceTaskKey, 'service')}
                >
                  <div className="task-info">
                    <div className="task-name">{task.name}</div>
                    <div className="task-key">{task.type}</div>
                  </div>
                  <div className="task-status">
                    {task.status === 'configured' && (
                      <CheckCircle2 size={18} className="status-icon configured" />
                    )}
                    {task.status === 'new' && (
                      <AlertCircle size={18} className="status-icon new" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-legend">
            <div className="legend-title">Статусы:</div>
            <div className="legend-items">
              <div className="legend-item">
                <CheckCircle2 size={14} className="status-icon configured" />
                <span>Настроена</span>
              </div>
              <div className="legend-item">
                <AlertCircle size={14} className="status-icon new" />
                <span>Новая</span>
              </div>
              <div className="legend-item">
                <AlertCircle size={14} className="status-icon extra" />
                <span>Лишняя</span>
              </div>
            </div>
            <div className="legend-hint">
              💡 Наведение - показать на диаграмме<br/>
              Клик - редактировать
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
