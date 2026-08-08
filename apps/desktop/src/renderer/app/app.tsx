import { Navigate, useLocation } from 'react-router-dom';
import { useStartup } from '../hooks/use-startup';
import { LandingLayout } from './layouts/landing-layout';
import { MainLayout } from './layouts/main-layout';
import { AppRoutes } from './router/routes';

export function App() {
  const location = useLocation();
  const { applicationReady } = useStartup();
  const isLandingRoute = location.pathname === '/';

  if (!applicationReady) {
    return isLandingRoute ? (
      <LandingLayout>
        <AppRoutes includeLanding />
      </LandingLayout>
    ) : (
      <Navigate replace to="/" />
    );
  }

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}
