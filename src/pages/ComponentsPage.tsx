import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { PresetCard } from '@/components/PresetCard';
import './ComponentsPage.css';

export function ComponentsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { presets, selectedEnvironment, setSelectedTenant } = useAppStore();

  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  const isEditAllowed = selectedEnvironment === 'dev';

  // Фильтруем только component пресеты для выбранного тенанта
  const componentPresets = presets.filter(
    (p) => p.type === 'component' && p.tenantId === tenantId
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Компоненты</h1>
          <p className="page-description">
            Переиспользуемые компоненты для UserTask форм
          </p>
        </div>
        <div className="header-actions">
          {isEditAllowed && (
            <button className="btn btn-primary">
              <Plus size={18} />
              Создать компонент
            </button>
          )}
        </div>
      </div>

      <div className="components-grid">
        {componentPresets.length === 0 ? (
          <div className="empty-state">
            <p>Компоненты не найдены</p>
            {isEditAllowed && (
              <button className="btn btn-primary">
                <Plus size={18} />
                Создать первый компонент
              </button>
            )}
          </div>
        ) : (
          componentPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isEditAllowed={isEditAllowed}
              onCopy={() => console.log('Copy preset:', preset.id)}
              onEdit={() => console.log('Edit preset:', preset.id)}
              onDelete={() => console.log('Delete preset:', preset.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
