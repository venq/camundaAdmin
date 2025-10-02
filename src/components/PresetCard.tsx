import { Edit, Trash2, Copy } from 'lucide-react';
import type { Preset } from '@/types';
import { pluralizeTabs, pluralizeComponents, pluralizeProperties } from '@/utils/pluralize';
import './PresetCard.css';

interface PresetCardProps {
  preset: Preset;
  isEditAllowed: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
}

export function PresetCard({ preset, isEditAllowed, onEdit, onDelete, onCopy }: PresetCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'userTask':
        return 'Пользовательская задача';
      case 'serviceTask':
        return 'Сервисная задача';
      case 'component':
        return 'Компонент';
      case 'tabGroup':
        return 'Группа табов';
      default:
        return type;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'userTask':
        return 'badge-success';
      case 'serviceTask':
        return 'badge-warning';
      case 'component':
        return 'badge-info';
      case 'tabGroup':
        return 'badge-purple';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="preset-card-wrapper">
      {/* Цветная шапка с типом */}
      <div className={`preset-card-type-header ${getTypeBadgeClass(preset.type)}`}>
        <span>{getTypeLabel(preset.type)}</span>
        {isEditAllowed && (
          <div className="preset-card-actions">
            {onCopy && (
              <button className="btn-icon btn-icon-white" onClick={onCopy} title="Копировать">
                <Copy size={16} />
              </button>
            )}
            {onEdit && (
              <button className="btn-icon btn-icon-white" onClick={onEdit} title="Редактировать">
                <Edit size={16} />
              </button>
            )}
            {onDelete && (
              <button className="btn-icon btn-icon-white btn-danger" onClick={onDelete} title="Удалить">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className={`preset-card card ${preset.isDefault ? 'is-default' : ''}`}>
        <div className="preset-card-header">
        <div className="preset-card-title-section">
          <h3 className="preset-card-title">{preset.name}</h3>
          <code className="preset-card-id">{preset.presetId}</code>
        </div>
      </div>

      <p className="preset-card-description">{preset.description}</p>

      {/* Специфичный контент для разных типов */}
      {preset.type === 'tabGroup' && preset.content && (
        <div className="preset-card-preview">
          <div className="preset-card-preview-label">Структура:</div>
          <div className="preset-card-preview-content">
            <div className="preset-preview-field">
              <span className="preset-preview-label">Заголовок:</span>
              <span className="badge badge-secondary">{preset.content.title}</span>
            </div>
            {preset.content.tabs && (
              <div className="preset-preview-field">
                <span className="preset-preview-label">Табов:</span>
                <span className="badge badge-info">
                  {pluralizeTabs(preset.content.tabs.length)}
                </span>
              </div>
            )}
            {preset.content.tabs && preset.content.tabs.length > 0 && (
              <div className="preset-preview-tabs">
                {preset.content.tabs.map((tab: any, idx: number) => (
                  <div key={idx} className="preview-tab-item">
                    <span className="preview-tab-title">{tab.title}</span>
                    <span className="preview-tab-components">
                      ({pluralizeComponents(tab.components?.length || 0)})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {preset.type === 'component' && preset.content && (
        <div className="preset-card-preview">
          <div className="preset-card-preview-label">Содержимое:</div>
          <div className="preset-card-preview-content">
            {preset.content.type && (
              <div className="preset-preview-field">
                <span className="preset-preview-label">Тип:</span>
                <span className="badge badge-secondary">{preset.content.type}</span>
              </div>
            )}
            {preset.content.label && (
              <div className="preset-preview-field">
                <span className="preset-preview-label">Метка:</span>
                <span>{preset.content.label}</span>
              </div>
            )}
            {preset.content.properties && (
              <div className="preset-preview-field">
                <span className="preset-preview-label">Свойства:</span>
                <span className="badge badge-info">
                  {pluralizeProperties(Object.keys(preset.content.properties).length)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="preset-card-meta">
        <div className="preset-card-meta-item">
          <span className="badge badge-info" title="Версия">v{preset.version}</span>
        </div>
        <div className="preset-card-meta-item">
          <span className="preset-card-meta-label">Автор:</span>
          <span>{preset.author}</span>
        </div>
        <div className="preset-card-meta-item">
          <span className="preset-card-meta-label">Обновлён:</span>
          <span>{new Date(preset.updatedAt).toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
      </div>

    </div>
  );
}
