import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Plus, Settings, Trash2, FolderKanban } from 'lucide-react';
import { format } from 'date-fns';
import './TenantsPage.css';

export function TenantsPage() {
  const { tenants, setSelectedTenant, user } = useAppStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenant(tenantId);
    navigate(`/tenants/${tenantId}/projects`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Тенанты</h1>
          <p className="page-description">
            Управление тенантами и их окружениями
          </p>
        </div>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary">
            <Plus size={18} />
            Создать тенант
          </button>
        )}
      </div>

      <div className="page-content">
        <div className="search-bar">
          <input
            type="text"
            className="input"
            placeholder="Поиск тенантов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tenants-grid">
          {filteredTenants.map((tenant) => (
            <div key={tenant.id} className="tenant-card card">
              <div className="tenant-header">
                <h3 className="tenant-name">{tenant.name}</h3>
                <div className="tenant-actions">
                  {user?.role === 'Admin' && (
                    <>
                      <button className="btn-icon" title="Настройки">
                        <Settings size={16} />
                      </button>
                      <button className="btn-icon btn-danger" title="Удалить">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="tenant-description">{tenant.description}</p>

              <div className="tenant-environments">
                <span className="label">Окружения:</span>
                <div className="env-badges">
                  {tenant.environments.map((env) => (
                    <span key={env} className="badge badge-info">
                      {env.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="tenant-meta">
                <span className="meta-item">
                  Обновлён: {format(new Date(tenant.updatedAt), 'dd.MM.yyyy HH:mm')}
                </span>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={() => handleSelectTenant(tenant.id)}
              >
                <FolderKanban size={18} />
                Открыть процессы
              </button>
            </div>
          ))}
        </div>

        {filteredTenants.length === 0 && (
          <div className="empty-state">
            <p>Тенанты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
