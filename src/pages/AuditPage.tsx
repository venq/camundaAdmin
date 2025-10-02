import { useState } from 'react';
import { useAppStore } from '@/store';
import { Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import './AuditPage.css';

export function AuditPage() {
  const { auditRecords, tenants } = useAppStore();
  const [filterTenant, setFilterTenant] = useState<string>('all');
  const [filterObjectType, setFilterObjectType] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredRecords = auditRecords.filter((record) => {
    if (filterTenant !== 'all' && record.tenantId !== filterTenant) return false;
    if (filterObjectType !== 'all' && record.objectType !== filterObjectType) return false;
    if (filterAction !== 'all' && record.action !== filterAction) return false;
    return true;
  });

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'create':
        return 'badge-success';
      case 'update':
        return 'badge-info';
      case 'delete':
        return 'badge-danger';
      case 'promote':
      case 'rollback':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  const getObjectTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'userTask':
        return 'badge-info';
      case 'serviceTask':
        return 'badge-warning';
      case 'registry':
        return 'badge-success';
      case 'preset':
        return 'badge-info';
      case 'release':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Аудит изменений</h1>
          <p className="page-description">
            История всех изменений в системе (срок хранения: 1 год)
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={18} />
            Экспорт аудита
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="audit-filters card">
          <div className="filters-title">
            <Filter size={18} />
            <span>Фильтры</span>
          </div>
          <div className="filters-grid">
            <div className="filter-field">
              <label>Тенант:</label>
              <select
                className="select"
                value={filterTenant}
                onChange={(e) => setFilterTenant(e.target.value)}
              >
                <option value="all">Все тенанты</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label>Тип объекта:</label>
              <select
                className="select"
                value={filterObjectType}
                onChange={(e) => setFilterObjectType(e.target.value)}
              >
                <option value="all">Все типы</option>
                <option value="userTask">UserTask</option>
                <option value="serviceTask">ServiceTask</option>
                <option value="registry">Реестр</option>
                <option value="preset">Пресет</option>
                <option value="release">Релиз</option>
              </select>
            </div>

            <div className="filter-field">
              <label>Действие:</label>
              <select
                className="select"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              >
                <option value="all">Все действия</option>
                <option value="create">Создание</option>
                <option value="update">Изменение</option>
                <option value="delete">Удаление</option>
                <option value="promote">Продвижение</option>
                <option value="rollback">Откат</option>
              </select>
            </div>
          </div>

          <div className="filter-summary">
            Найдено записей: <strong>{filteredRecords.length}</strong>
          </div>
        </div>

        <div className="audit-timeline">
          {filteredRecords.map((record) => {
            const tenant = tenants.find((t) => t.id === record.tenantId);
            return (
              <div key={record.id} className="audit-record card">
                <div className="record-timestamp">
                  <span className="timestamp-date">
                    {format(new Date(record.timestamp), 'dd.MM.yyyy')}
                  </span>
                  <span className="timestamp-time">
                    {format(new Date(record.timestamp), 'HH:mm:ss')}
                  </span>
                </div>

                <div className="record-content">
                  <div className="record-header">
                    <div className="record-badges">
                      <span className={`badge ${getActionBadgeClass(record.action)}`}>
                        {record.action}
                      </span>
                      <span className={`badge ${getObjectTypeBadgeClass(record.objectType)}`}>
                        {record.objectType}
                      </span>
                    </div>
                    <span className="record-author">{record.author}</span>
                  </div>

                  <div className="record-details">
                    <div className="detail-row">
                      <span className="detail-label">Объект:</span>
                      <code className="detail-value">{record.objectId}</code>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Тенант:</span>
                      <span className="detail-value">{tenant?.name || record.tenantId}</span>
                    </div>
                    {record.projectId && (
                      <div className="detail-row">
                        <span className="detail-label">Процесс:</span>
                        <span className="detail-value">{record.projectId}</span>
                      </div>
                    )}
                  </div>

                  {record.changes && Object.keys(record.changes).length > 0 && (
                    <div className="record-changes">
                      <div className="changes-title">Изменения:</div>
                      <div className="changes-list">
                        {Object.entries(record.changes).map(([key, change]: [string, any]) => (
                          <div key={key} className="change-item">
                            <code className="change-field">{key}:</code>
                            <span className="change-value">
                              <span className="old-value">{String(change.old)}</span>
                              <span className="arrow">→</span>
                              <span className="new-value">{String(change.new)}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="empty-state">
              <p>Записи аудита не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
