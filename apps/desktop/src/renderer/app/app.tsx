import { Navigate, useLocation } from 'react-router-dom';
import { useStartup } from '../hooks/use-startup';
import { ErrorBoundary } from '../shared/ui/error-boundary';
import { LandingLayout } from './layouts/landing-layout';
import { MainLayout } from './layouts/main-layout';
import { StartupRoutes, WorkspaceRoutes } from './router/routes';

export function App() {
  const location = useLocation();
  const { applicationReady } = useStartup();
  const isStartupRoute = ['/', '/startup', '/games'].includes(location.pathname);
  const isGameHubRoute = location.pathname === '/games';

  const layout =
    isGameHubRoute || !applicationReady ? (
      isStartupRoute ? (
        <LandingLayout>
          <StartupRoutes />
        </LandingLayout>
      ) : (
        <Navigate replace to="/startup" />
      )
    ) : (
      <ErrorBoundary>
        <MainLayout>
          <WorkspaceRoutes />
        </MainLayout>
      </ErrorBoundary>
    );

  return (
    <>
      {layout}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}
