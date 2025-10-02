import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TenantsPage } from '@/pages/TenantsPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { BpmnViewerPage } from '@/pages/BpmnViewerPage';
import { UserTaskEditorPage } from '@/pages/UserTaskEditorPage';
import { ServiceTaskEditorPage } from '@/pages/ServiceTaskEditorPage';
import { RegistriesPage } from '@/pages/RegistriesPage';
import { ComponentsPage } from '@/pages/ComponentsPage';
import { TabGroupsPage } from '@/pages/TabGroupsPage';
import { PresetsPage } from '@/pages/PresetsPage';
import { ReleasesPage } from '@/pages/ReleasesPage';
import { AuditPage } from '@/pages/AuditPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/tenants" replace />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="tenants/:tenantId/projects" element={<ProjectsPage />} />
          <Route path="tenants/:tenantId/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="tenants/:tenantId/projects/:projectId/bpmn/:processId" element={<BpmnViewerPage />} />
          <Route
            path="tenants/:tenantId/projects/:projectId/user-tasks/:taskKey"
            element={<UserTaskEditorPage />}
          />
          <Route
            path="tenants/:tenantId/projects/:projectId/service-tasks/:taskKey"
            element={<ServiceTaskEditorPage />}
          />
          <Route path="tenants/:tenantId/registries" element={<RegistriesPage />} />
          <Route path="tenants/:tenantId/components" element={<ComponentsPage />} />
          <Route path="tenants/:tenantId/tabgroups" element={<TabGroupsPage />} />
          <Route path="tenants/:tenantId/presets" element={<PresetsPage />} />
          <Route path="tenants/:tenantId/projects/:projectId/releases" element={<ReleasesPage />} />
          <Route path="audit" element={<AuditPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
