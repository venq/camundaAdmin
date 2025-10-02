import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Rocket, ChevronRight, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import './ReleasesPage.css';

export function ReleasesPage() {
  const { tenantId, projectId } = useParams<{ tenantId: string; projectId: string }>();
  const { releases, projects, tenants } = useAppStore();

  const tenant = tenants.find((t) => t.id === tenantId);
  const project = projects.find((p) => p.id === projectId);
  const projectReleases = releases
    .filter((r) => r.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!tenant || !project) {
    return (
      <div className="page">
        <div className="empty-state">Процесс не найден</div>
      </div>
    );
  }

  const environmentChain = tenant.environments;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{project.name} / Релизы</h1>
          <p className="page-description">
            Управление релизами и продвижение по окружениям
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Rocket size={18} />
            Создать релиз из DEV
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="environment-chain card">
          <h3 className="chain-title">Цепочка окружений</h3>
          <div className="chain-flow">
            {environmentChain.map((env, idx) => (
              <div key={env} className="chain-item">
                <div className={`chain-env ${env}`}>
                  <span className="env-name">{env.toUpperCase()}</span>
                  <span className="env-badge badge badge-info">
                    {projectReleases.filter((r) => r.environment === env).length} релизов
                  </span>
                </div>
                {idx < environmentChain.length - 1 && (
                  <ChevronRight size={24} className="chain-arrow" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="releases-list">
          <h3 className="list-title">История релизов</h3>

          {projectReleases.map((release) => (
            <div key={release.id} className="release-card card">
              <div className="release-header">
                <div className="release-info">
                  <h4 className="release-version">{release.version}</h4>
                  <h5 className="release-title">{release.title}</h5>
                </div>
                <div className="release-badges">
                  <span className={`badge badge-${release.environment === 'prod' ? 'success' : 'info'}`}>
                    {release.environment.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="release-description">{release.description}</p>

              <div className="release-checklist">
                <div className="checklist-title">Чек-лист готовности:</div>
                <div className="checklist-items">
                  {release.checklist.map((item) => (
                    <div key={item.id} className="checklist-item">
                      {item.status === 'passed' ? (
                        <CheckCircle2 size={16} className="check-icon passed" />
                      ) : (
                        <AlertCircle size={16} className="check-icon failed" />
                      )}
                      <span className="check-text">{item.title}</span>
                      {item.message && (
                        <span className="check-message">({item.message})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="release-meta">
                <div className="meta-item">
                  <span className="meta-label">Автор:</span>
                  <span className="meta-value">{release.author}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Создан:</span>
                  <span className="meta-value">
                    {format(new Date(release.createdAt), 'dd.MM.yyyy HH:mm')}
                  </span>
                </div>
                {release.promotedFrom && (
                  <div className="meta-item">
                    <span className="meta-label">Продвинут из:</span>
                    <span className="meta-value badge badge-info">
                      {releases.find((r) => r.id === release.promotedFrom)?.environment.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="release-actions">
                {release.environment !== 'prod' && (
                  <button className="btn btn-sm btn-primary">
                    <ChevronRight size={16} />
                    Продвинуть дальше
                  </button>
                )}
                <button className="btn btn-sm btn-secondary">
                  <RotateCcw size={16} />
                  Откатить к этой версии
                </button>
              </div>
            </div>
          ))}

          {projectReleases.length === 0 && (
            <div className="empty-state">
              <p>Релизы еще не созданы</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
