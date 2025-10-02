import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { FolderKanban, Database, Box, LayoutGrid, Layers, History, User, ChevronDown, Rocket } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './Layout.css';

export function Layout() {
  const { user, tenants, selectedTenantId, selectedEnvironment, setSelectedEnvironment, setSelectedTenant } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);

  const isActive = (path: string) => location.pathname.includes(path);

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId);
    setIsTenantDropdownOpen(false);
    navigate(`/tenants/${tenantId}/projects`);
  };

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTenantDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Camunda Admin</h1>
            <span className="header-subtitle">Конфигурация задач BPMN</span>
          </div>
          <div className="header-center">
            <div className="tenant-selector" ref={dropdownRef}>
              <button
                className="tenant-selector-button"
                onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
              >
                <span className="tenant-selector-label">
                  {selectedTenant ? selectedTenant.name : 'Выберите тенант'}
                </span>
                <ChevronDown size={16} className={`tenant-selector-icon ${isTenantDropdownOpen ? 'open' : ''}`} />
              </button>
              {isTenantDropdownOpen && (
                <div className="tenant-dropdown">
                  {tenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      className={`tenant-dropdown-item ${tenant.id === selectedTenantId ? 'active' : ''}`}
                      onClick={() => handleTenantSelect(tenant.id)}
                    >
                      <div className="tenant-dropdown-item-name">{tenant.name}</div>
                      <div className="tenant-dropdown-item-desc">{tenant.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="header-right">
            <div className="environment-selector">
              <label>Окружение:</label>
              <select
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value as any)}
                className="select"
              >
                <option value="dev">DEV</option>
                <option value="test">TEST</option>
                <option value="stage">STAGE</option>
                <option value="prod">PROD</option>
              </select>
            </div>
            <div className="user-info">
              <User size={18} />
              <span>{user?.name}</span>
              <span className="user-role badge badge-info">{user?.role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            {selectedTenantId && (
              <>
                <Link
                  to={`/tenants/${selectedTenantId}/projects`}
                  className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
                >
                  <FolderKanban size={18} />
                  <span>Процессы</span>
                </Link>

                <Link
                  to={`/tenants/${selectedTenantId}/registries`}
                  className={`nav-link ${isActive('/registries') ? 'active' : ''}`}
                >
                  <Database size={18} />
                  <span>Реестры</span>
                </Link>

                <Link
                  to={`/tenants/${selectedTenantId}/components`}
                  className={`nav-link ${isActive('/components') ? 'active' : ''}`}
                >
                  <Box size={18} />
                  <span>Компоненты</span>
                </Link>

                <Link
                  to={`/tenants/${selectedTenantId}/tabgroups`}
                  className={`nav-link ${isActive('/tabgroups') ? 'active' : ''}`}
                >
                  <LayoutGrid size={18} />
                  <span>Табы</span>
                </Link>

                <Link
                  to={`/tenants/${selectedTenantId}/presets`}
                  className={`nav-link ${isActive('/presets') ? 'active' : ''}`}
                >
                  <Layers size={18} />
                  <span>Пресеты</span>
                </Link>

                <Link
                  to={`/tenants/${selectedTenantId}/releases`}
                  className={`nav-link ${isActive('/releases') ? 'active' : ''}`}
                >
                  <Rocket size={18} />
                  <span>Релизы</span>
                </Link>
              </>
            )}

            <div className="nav-divider" />

            <Link
              to="/audit"
              className={`nav-link ${isActive('/audit') ? 'active' : ''}`}
            >
              <History size={18} />
              <span>Аудит</span>
            </Link>
          </nav>
        </aside>

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
