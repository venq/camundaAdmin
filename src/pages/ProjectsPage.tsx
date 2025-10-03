import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Plus, FileText, Edit, Trash2, Database, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { pluralizeBpmnProcesses, pluralizeTasks } from '@/utils/pluralize';
import './ProjectsPage.css';

export function ProjectsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const { projects, tenants, user, setSelectedProject, setSelectedTenant, bpmnProcesses } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProject, setDeletingProject] = useState<any>(null);

  // Устанавливаем выбранный тенант
  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  const tenant = tenants.find((t) => t.id === tenantId);
  const tenantProjects = projects.filter((p) => p.tenantId === tenantId);

  const filteredProjects = tenantProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenProject = (projectId: string) => {
    setSelectedProject(projectId);
    navigate(`/tenants/${tenantId}/projects/${projectId}`);
  };

  const getProjectStats = (projectId: string) => {
    const projectProcesses = bpmnProcesses.filter((bp) => bp.projectId === projectId);
    const totalTasks = projectProcesses.reduce(
      (sum, p) => sum + p.userTasks.length + p.serviceTasks.length,
      0
    );
    const configuredTasks = projectProcesses.reduce(
      (sum, p) =>
        sum +
        p.userTasks.filter((t) => t.status === 'configured').length +
        p.serviceTasks.filter((t) => t.status === 'configured').length,
      0
    );
    const newTasks = projectProcesses.reduce(
      (sum, p) =>
        sum +
        p.userTasks.filter((t) => t.status === 'new').length +
        p.serviceTasks.filter((t) => t.status === 'new').length,
      0
    );
    const completionPercentage = totalTasks > 0 ? Math.round((configuredTasks / totalTasks) * 100) : 0;

    return { totalTasks, configuredTasks, newTasks, completionPercentage };
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setEditName(project.name);
    setShowEditModal(true);
  };

  const handleSaveProject = () => {
    // TODO: Сохранение изменений процесса
    console.log('Saving project:', editingProject.id, 'New name:', editName);
    setShowEditModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (project: any) => {
    setDeletingProject(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = () => {
    // TODO: Удаление процесса
    console.log('Deleting project:', deletingProject.id);
    setShowDeleteModal(false);
    setDeletingProject(null);
  };

  if (!tenant) {
    return (
      <div className="page">
        <div className="empty-state">Тенант не найден</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Процессы</h1>
          <p className="page-description">Управление BPMN-процессами и конфигурациями</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/tenants/${tenantId}/registries`)}
          >
            <Database size={18} />
            Реестры
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/tenants/${tenantId}/presets`)}
          >
            <Layers size={18} />
            Пресеты
          </button>
          {user?.role === 'Admin' && (
            <button className="btn btn-primary">
              <Plus size={18} />
              Создать процесс
            </button>
          )}
        </div>
      </div>

      <div className="page-content">
        <div className="search-bar">
          <input
            type="text"
            className="input"
            placeholder="Поиск процессов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project.id);

            return (
              <div key={project.id} className="project-card-wrapper">
                {/* Цветная шапка с типом */}
                <div className="project-card-type-header">
                  <span>Процесс</span>
                  <div className="project-card-actions">
                    <button
                      className="btn-icon btn-icon-white"
                      title="Редактировать"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit size={16} />
                    </button>
                    {user?.role === 'Admin' && (
                      <button
                        className="btn-icon btn-icon-white btn-danger"
                        title="Удалить"
                        onClick={() => handleDeleteProject(project)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="project-card card">
                  <div className="project-header">
                    <h3
                      className="project-name clickable"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      {project.name}
                    </h3>
                  </div>

                  <p className="project-description">{project.description}</p>

                <div className="project-stats">
                  <div className="stat-item">
                    <span className="stat-label">Прогресс настройки:</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${stats.completionPercentage}%` }}
                      />
                      <span className="progress-text">{stats.completionPercentage}%</span>
                    </div>
                  </div>

                  <div className="stat-row">
                    <div className="stat-badge">
                      <FileText size={14} />
                      <span>
                        {pluralizeBpmnProcesses(bpmnProcesses.filter((bp) => bp.projectId === project.id).length)}
                      </span>
                    </div>
                    <div className="stat-badge">
                      <span>{pluralizeTasks(stats.totalTasks)}</span>
                    </div>
                    <div className="stat-badge" title="Настроенных задач">
                      <CheckCircle2 size={14} className="stat-icon configured" />
                      <span>{stats.configuredTasks}</span>
                    </div>
                    {stats.newTasks > 0 && (
                      <div className="stat-badge" title="Новых задач">
                        <AlertCircle size={14} className="stat-icon new" />
                        <span>{stats.newTasks}</span>
                      </div>
                    )}
                  </div>
                </div>

                  <div className="project-meta">
                    <div className="project-meta-item">
                      <span className="project-meta-label">Обновлён:</span>
                      <span>{new Date(project.updatedAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="empty-state">
            <p>Процессы не найдены</p>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования процесса */}
      {showEditModal && editingProject && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Редактирование процесса</h2>
              <button className="btn-icon" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>Название процесса</label>
                <input
                  type="text"
                  className="input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Введите название процесса"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Отмена
              </button>
              <button className="btn btn-primary" onClick={handleSaveProject}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && deletingProject && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Удаление процесса</h2>
              <button className="btn-icon" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Вы уверены, что хотите удалить процесс <strong>«{deletingProject.name}»</strong>?</p>
              <p className="warning-text">Это действие нельзя отменить. Все BPMN-процессы и конфигурации будут удалены.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Отмена
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteProject}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
