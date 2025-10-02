import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Plus, FileText, Upload, Download, Trash2, Edit, CheckCircle2, AlertCircle, Rocket } from 'lucide-react';
import { format } from 'date-fns';
import './ProjectDetailPage.css';

export function ProjectDetailPage() {
  const { tenantId, projectId } = useParams<{ tenantId: string; projectId: string }>();
  const navigate = useNavigate();
  const { projects, bpmnProcesses, tenants, selectedEnvironment, user, setSelectedTenant } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Устанавливаем выбранный тенант
  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  const tenant = tenants.find((t) => t.id === tenantId);
  const project = projects.find((p) => p.id === projectId);
  const projectBpmnProcesses = bpmnProcesses.filter((bp) => bp.projectId === projectId);

  const filteredProcesses = projectBpmnProcesses.filter(
    (process) =>
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.processId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEditAllowed = selectedEnvironment === 'dev';

  const getProcessStats = (process: typeof projectBpmnProcesses[0]) => {
    const totalTasks = process.userTasks.length + process.serviceTasks.length;
    const configuredTasks = [
      ...process.userTasks.filter((t) => t.status === 'configured'),
      ...process.serviceTasks.filter((t) => t.status === 'configured')
    ].length;
    const newTasks = [
      ...process.userTasks.filter((t) => t.status === 'new'),
      ...process.serviceTasks.filter((t) => t.status === 'new')
    ].length;

    return { totalTasks, configuredTasks, newTasks };
  };

  const handleOpenBpmn = (processId: string) => {
    navigate(`/tenants/${tenantId}/projects/${projectId}/bpmn/${processId}`);
  };

  if (!tenant || !project) {
    return (
      <div className="page">
        <div className="empty-state">Процесс не найден</div>
      </div>
    );
  }

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
            <span>{project.name}</span>
          </h1>
          <p className="page-description">{project.description}</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/tenants/${tenantId}/projects/${projectId}/releases`)}
          >
            <Rocket size={18} />
            Релизы
          </button>
          {isEditAllowed && (
            <>
              <button className="btn btn-secondary">
                <Upload size={18} />
                Загрузить BPMN
              </button>
              <button className="btn btn-primary">
                <Plus size={18} />
                Создать процесс
              </button>
            </>
          )}
        </div>
      </div>

      <div className="page-content">
        <div className="processes-section">
          <div className="section-header">
            <h2 className="section-title">BPMN Процессы и Подпроцессы</h2>
            <div className="search-bar">
              <input
                type="text"
                className="input"
                placeholder="Поиск процессов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="processes-list">
            {filteredProcesses.map((process) => {
              const stats = getProcessStats(process);
              const completionPercentage =
                stats.totalTasks > 0
                  ? Math.round((stats.configuredTasks / stats.totalTasks) * 100)
                  : 0;

              return (
                <div key={process.id} className="process-card-wrapper">
                  {/* Цветная шапка с типом */}
                  <div className="process-card-type-header">
                    <span><FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />BPMN Процесс</span>
                    {isEditAllowed && (
                      <div className="process-card-actions">
                        <button className="btn-icon btn-icon-white" title="Редактировать">
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon btn-icon-white" title="Скачать">
                          <Download size={16} />
                        </button>
                        <button className="btn-icon btn-icon-white btn-danger" title="Удалить">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="process-card card">
                    <div className="process-header">
                      <div className="process-info">
                        <h3 className="process-name clickable" onClick={() => handleOpenBpmn(process.id)}>
                          {process.name}
                        </h3>
                        <div className="process-meta">
                          <code className="process-id">{process.processId}</code>
                          <span className="process-file">
                            <FileText size={12} />
                            {process.fileName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {process.description && (
                      <p className="process-description">{process.description}</p>
                    )}

                  <div className="process-stats">
                    <div className="stat-item">
                      <span className="stat-label">Прогресс настройки:</span>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${completionPercentage}%` }}
                        />
                        <span className="progress-text">{completionPercentage}%</span>
                      </div>
                    </div>

                    <div className="stat-row">
                      <div className="stat-badge">
                        <span className="badge badge-info">
                          {process.userTasks.length} UserTasks
                        </span>
                      </div>
                      <div className="stat-badge">
                        <span className="badge badge-warning">
                          {process.serviceTasks.length} ServiceTasks
                        </span>
                      </div>
                      <div className="stat-badge">
                        <CheckCircle2 size={14} className="stat-icon configured" />
                        <span>{stats.configuredTasks} настроено</span>
                      </div>
                      {stats.newTasks > 0 && (
                        <div className="stat-badge">
                          <AlertCircle size={14} className="stat-icon new" />
                          <span>{stats.newTasks} новых</span>
                        </div>
                      )}
                    </div>
                  </div>

                    <div className="process-dates">
                      <span className="date-item">
                        Создан: {format(new Date(process.createdAt), 'dd.MM.yyyy')}
                      </span>
                      <span className="date-item">
                        Обновлён: {format(new Date(process.updatedAt), 'dd.MM.yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProcesses.length === 0 && (
            <div className="empty-state">
              {searchTerm ? (
                <p>Процессы не найдены по запросу "{searchTerm}"</p>
              ) : (
                <>
                  <p>В процессе еще нет BPMN процессов</p>
                  {isEditAllowed && (
                    <button className="btn btn-primary">
                      <Upload size={18} />
                      Загрузить первый BPMN файл
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="project-info-card card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Процессов:</span>
              <span className="info-value">{projectBpmnProcesses.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Всего задач:</span>
              <span className="info-value">
                {projectBpmnProcesses.reduce(
                  (sum, p) => sum + p.userTasks.length + p.serviceTasks.length,
                  0
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Создан:</span>
              <span className="info-value">
                {format(new Date(project.createdAt), 'dd.MM.yyyy HH:mm')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Обновлён:</span>
              <span className="info-value">
                {format(new Date(project.updatedAt), 'dd.MM.yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
