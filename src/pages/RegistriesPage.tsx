import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';
import './RegistriesPage.css';

export function RegistriesPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { registries, tenants, selectedEnvironment, setSelectedTenant } = useAppStore();
  const [selectedRegistry, setSelectedRegistry] = useState<string | null>(null);

  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  const tenant = tenants.find((t) => t.id === tenantId);
  const tenantRegistries = registries.filter((r) => r.tenantId === tenantId);
  const activeRegistry = tenantRegistries.find((r) => r.id === selectedRegistry);

  const isEditAllowed = selectedEnvironment === 'dev';

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
          <h1 className="page-title">{tenant.name} / Реестры</h1>
          <p className="page-description">
            Общие справочники для всех процессов тенанта
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={18} />
            Экспорт
          </button>
          <button className="btn btn-secondary">
            <Upload size={18} />
            Импорт
          </button>
          {isEditAllowed && (
            <button className="btn btn-primary">
              <Plus size={18} />
              Создать реестр
            </button>
          )}
        </div>
      </div>

      <div className="registries-layout">
        <aside className="registries-sidebar">
          <div className="registries-list">
            {tenantRegistries.map((registry) => (
              <div
                key={registry.id}
                className={`registry-item ${selectedRegistry === registry.id ? 'active' : ''}`}
                onClick={() => setSelectedRegistry(registry.id)}
              >
                <div className="registry-item-header">
                  <span className="registry-name">{registry.name}</span>
                  <span className="badge badge-info">v{registry.version}</span>
                </div>
                <div className="registry-item-meta">
                  <code className="registry-id">{registry.registryId}</code>
                  <span className="registry-count">{registry.items.length} элементов</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="registry-detail">
          {activeRegistry ? (
            <>
              <div className="detail-header">
                <div>
                  <h2 className="detail-title">{activeRegistry.name}</h2>
                  <p className="detail-description">{activeRegistry.description}</p>
                </div>
                <div className="detail-actions">
                  {isEditAllowed && (
                    <>
                      <button className="btn btn-sm btn-secondary">
                        <Edit size={16} />
                        Редактировать
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <Trash2 size={16} />
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="registry-info card">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Registry ID:</span>
                    <code className="info-value">{activeRegistry.registryId}</code>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Версия:</span>
                    <span className="info-value">{activeRegistry.version}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Автор:</span>
                    <span className="info-value">{activeRegistry.author}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Обновлён:</span>
                    <span className="info-value">
                      {format(new Date(activeRegistry.updatedAt), 'dd.MM.yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="registry-items card">
                <div className="items-header">
                  <h3 className="items-title">Элементы реестра</h3>
                  {isEditAllowed && (
                    <button className="btn btn-sm btn-primary">
                      <Plus size={16} />
                      Добавить элемент
                    </button>
                  )}
                </div>

                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Название</th>
                        <th>Значение</th>
                        {isEditAllowed && <th style={{ width: '100px' }}>Действия</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {activeRegistry.items.map((item) => (
                        <tr key={item.itemId}>
                          <td>
                            <code>{item.itemId}</code>
                          </td>
                          <td>{item.label}</td>
                          <td>
                            <code>{String(item.value)}</code>
                          </td>
                          {isEditAllowed && (
                            <td>
                              <div className="table-actions">
                                <button className="btn-icon">
                                  <Edit size={14} />
                                </button>
                                <button className="btn-icon btn-danger">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              Выберите реестр для просмотра
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
