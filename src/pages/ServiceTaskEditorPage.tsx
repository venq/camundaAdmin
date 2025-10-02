import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { ServiceTaskConfig } from '@/types';
import './ServiceTaskEditorPage.css';

export function ServiceTaskEditorPage() {
  const { tenantId, projectId, taskKey } = useParams<{
    tenantId: string;
    projectId: string;
    taskKey: string;
  }>();
  const { serviceTaskConfigs, selectedEnvironment, presets, addServiceTaskConfig, bpmnProcesses } = useAppStore();
  const [config, setConfig] = useState<ServiceTaskConfig | null>(
    serviceTaskConfigs.find((c) => c.serviceTaskKey === taskKey) || null
  );

  const [inputs, setInputs] = useState(config?.ioMapping.inputs || []);
  const [outputs, setOutputs] = useState(config?.ioMapping.outputs || []);

  // Автоматически создаем конфигурацию из default пресета, если её нет
  useEffect(() => {
    if (!config && taskKey) {
      // Находим default пресет для ServiceTask
      const defaultPreset = presets.find((p) => p.type === 'serviceTask' && p.isDefault && p.tenantId === tenantId);

      if (defaultPreset) {
        // Находим информацию о задаче из BPMN
        const bpmnTask = bpmnProcesses
          .flatMap((bp) => bp.serviceTasks)
          .find((t) => t.type === taskKey);

        // Создаем новую конфигурацию на основе пресета
        const newConfig: ServiceTaskConfig = {
          id: `stc-${Date.now()}`,
          serviceTaskKey: taskKey!,
          type: bpmnTask?.type || taskKey!,
          version: 1,
          ioMapping: defaultPreset.content.ioMapping || { inputs: [], outputs: [] },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'System'
        };

        // Добавляем в store
        addServiceTaskConfig(newConfig);
        setConfig(newConfig);
        setInputs(newConfig.ioMapping.inputs);
        setOutputs(newConfig.ioMapping.outputs);
      }
    }
  }, [config, taskKey, tenantId, projectId, presets, addServiceTaskConfig, bpmnProcesses]);

  if (!config) {
    return (
      <div className="page">
        <div className="empty-state">Загрузка конфигурации...</div>
      </div>
    );
  }

  const isEditAllowed = selectedEnvironment === 'dev';

  const addInput = () => {
    setInputs([...inputs, { name: '', value: '' }]);
  };

  const addOutput = () => {
    setOutputs([...outputs, { source: '', target: '' }]);
  };

  const isFeelExpression = (value: string) => {
    return typeof value === 'string' && value.startsWith('=');
  };

  return (
    <div className="page editor-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">ServiceTask: {config.type}</h1>
          <p className="page-description">
            {config.serviceTaskKey} (версия {config.version})
          </p>
        </div>
        <div className="header-actions">
          {isEditAllowed && (
            <button className="btn btn-primary">
              <Save size={18} />
              Сохранить
            </button>
          )}
        </div>
      </div>

      <div className="service-task-content">
        <div className="editor-section card">
          <h2 className="section-title">Тип сервис-таски</h2>
          <div className="form-field">
            <label>Тип (zeebe:taskDefinition type)</label>
            <input
              type="text"
              className="input"
              value={config.type}
              disabled
              title="Тип задаётся в BPMN и не может быть изменён здесь"
            />
            <small className="field-hint">
              Тип задаётся в BPMN-схеме (zeebe:taskDefinition type) и не может быть изменён здесь
            </small>
          </div>
        </div>

        <div className="editor-section card">
          <div className="section-header">
            <h2 className="section-title">I/O Mapping — Входы (Inputs)</h2>
            {isEditAllowed && (
              <button className="btn btn-sm btn-primary" onClick={addInput}>
                <Plus size={16} />
                Добавить вход
              </button>
            )}
          </div>

          <div className="io-table">
            {inputs.length === 0 ? (
              <div className="empty-state-sm">Входы не заданы (опционально)</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Тип</th>
                    {isEditAllowed && <th style={{ width: '50px' }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {inputs.map((input, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="input input-sm"
                          value={input.name}
                          disabled={!isEditAllowed}
                          placeholder="variableName"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-sm"
                          value={typeof input.value === 'string' ? input.value : ''}
                          disabled={!isEditAllowed}
                          placeholder="value или =expression"
                        />
                      </td>
                      <td>
                        <span
                          className={`badge ${isFeelExpression(input.value as string) ? 'badge-warning' : 'badge-info'}`}
                        >
                          {isFeelExpression(input.value as string) ? 'FEEL' : 'String'}
                        </span>
                      </td>
                      {isEditAllowed && (
                        <td>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => setInputs(inputs.filter((_, i) => i !== idx))}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="feel-hint">
            <strong>FEEL выражения:</strong> Строки, начинающиеся с <code>=</code>, интерпретируются
            движком как FEEL-выражения (например, <code>=applicantIncome</code>)
          </div>
        </div>

        <div className="editor-section card">
          <div className="section-header">
            <h2 className="section-title">I/O Mapping — Выходы (Outputs)</h2>
            {isEditAllowed && (
              <button className="btn btn-sm btn-primary" onClick={addOutput}>
                <Plus size={16} />
                Добавить выход
              </button>
            )}
          </div>

          <div className="io-table">
            {outputs.length === 0 ? (
              <div className="empty-state-sm">Выходы не заданы (опционально)</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Target</th>
                    {isEditAllowed && <th style={{ width: '50px' }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {outputs.map((output, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          className="input input-sm"
                          value={output.source}
                          disabled={!isEditAllowed}
                          placeholder="sourceVariable"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-sm"
                          value={output.target}
                          disabled={!isEditAllowed}
                          placeholder="targetVariable"
                        />
                      </td>
                      {isEditAllowed && (
                        <td>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => setOutputs(outputs.filter((_, i) => i !== idx))}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="editor-section card">
          <h2 className="section-title">Информация о конфигурации</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Автор:</span>
              <span className="info-value">{config.author}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Создана:</span>
              <span className="info-value">
                {new Date(config.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Обновлена:</span>
              <span className="info-value">
                {new Date(config.updatedAt).toLocaleString('ru-RU')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Версия:</span>
              <span className="info-value">{config.version}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
