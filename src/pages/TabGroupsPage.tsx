import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { PresetCard } from '@/components/PresetCard';
import './TabGroupsPage.css';

export function TabGroupsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { presets, selectedEnvironment, setSelectedTenant } = useAppStore();

  useEffect(() => {
    if (tenantId) {
      setSelectedTenant(tenantId);
    }
  }, [tenantId, setSelectedTenant]);

  const isEditAllowed = selectedEnvironment === 'dev';

  // Фильтруем только tabGroup пресеты для выбранного тенанта
  const tabGroupPresets = presets.filter(
    (p) => p.type === 'tabGroup' && p.tenantId === tenantId
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Табы (TabGroups)</h1>
          <p className="page-description">
            Группы табов для структурирования интерфейса UserTask
          </p>
        </div>
        <div className="header-actions">
          {isEditAllowed && (
            <button className="btn btn-primary">
              <Plus size={18} />
              Создать TabGroup
            </button>
          )}
        </div>
      </div>

      <div className="tabgroups-grid">
        {tabGroupPresets.length === 0 ? (
          <div className="empty-state">
            <p>TabGroup пресеты не найдены</p>
            {isEditAllowed && (
              <button className="btn btn-primary">
                <Plus size={18} />
                Создать первый TabGroup
              </button>
            )}
          </div>
        ) : (
          tabGroupPresets.map((preset) => (
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
