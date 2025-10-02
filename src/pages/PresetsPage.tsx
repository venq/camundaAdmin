import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Plus } from 'lucide-react';
import { PresetCard } from '@/components/PresetCard';

export function PresetsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const { presets, tenants, selectedEnvironment, setSelectedTenant } = useAppStore();
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  const tenant = tenants.find((t) => t.id === tenantId);
  const tenantPresets = presets.filter((p) => p.tenantId === tenantId);

  const filteredPresets =
    filterType === 'all'
      ? tenantPresets
      : tenantPresets.filter((p) => p.type === filterType);

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
          <h1 className="page-title">
            <span
              className="breadcrumb-link"
              onClick={() => navigate(`/tenants/${tenantId}/projects`)}
            >
              {tenant.name}
            </span>
            {' / '}
            <span>Пресеты</span>
          </h1>
          <p className="page-description">
            Шаблоны задач, компонентов и конфигураций
          </p>
        </div>
        <div className="header-actions">
          {isEditAllowed && (
            <button className="btn btn-primary">
              <Plus size={18} />
              Создать пресет
            </button>
          )}
        </div>
      </div>

      <div className="page-content">
        <div className="filter-bar">
          <div className="filter-group">
            <label>Тип пресета:</label>
            <select
              className="select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Все типы</option>
              <option value="userTask">Пользовательская задача</option>
              <option value="serviceTask">Сервисная задача</option>
              <option value="component">Компонент</option>
              <option value="tabGroup">Группа табов</option>
            </select>
          </div>
        </div>

        <div className="presets-grid">
          {filteredPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isEditAllowed={isEditAllowed}
              onCopy={() => console.log('Copy preset:', preset.id)}
              onEdit={() => console.log('Edit preset:', preset.id)}
              onDelete={() => console.log('Delete preset:', preset.id)}
            />
          ))}
        </div>

        {filteredPresets.length === 0 && (
          <div className="empty-state">
            <p>Пресеты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
