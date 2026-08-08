import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from '../../shared/ui/loading-state';

const HomePage = lazy(() => import('../../pages/home/home-page'));
const LandingPage = lazy(() => import('../../pages/landing/landing-page'));
const AgentsPage = lazy(() => import('../../pages/agents/agents-page'));
const AgentDetailPage = lazy(() => import('../../pages/agent-detail/agent-detail-page'));
const GuidesPage = lazy(() => import('../../pages/guides/guides-page'));
const GuideDetailPage = lazy(() => import('../../pages/guide-detail/guide-detail-page'));
const SearchPage = lazy(() => import('../../pages/search/search-page'));
const NewsPage = lazy(() => import('../../pages/news/news-page'));
const DailyPage = lazy(() => import('../../pages/daily/daily-page'));
const EventsPage = lazy(() => import('../../pages/events/events-page'));
const FavoritesPage = lazy(() => import('../../pages/favorites/favorites-page'));
const SettingsPage = lazy(() => import('../../pages/settings/settings-page'));
const GamePlaceholderPage = lazy(
  () => import('../../pages/game-placeholder/game-placeholder-page'),
);

interface AppRoutesProps {
  readonly includeLanding?: boolean;
}

export function AppRoutes({ includeLanding = false }: AppRoutesProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        {includeLanding ? (
          <Route path="/" element={<LandingPage />} />
        ) : (
          <Route path="/" element={<Navigate replace to="/zzz" />} />
        )}
        <Route path="/zzz" element={<HomePage />} />
        <Route path="/home" element={<Navigate replace to="/zzz" />} />
        <Route
          path="/genshin"
          element={<GamePlaceholderPage gameName="原神" gameShortName="原神 / 开发中" />}
        />
        <Route
          path="/starrail"
          element={
            <GamePlaceholderPage gameName="崩坏：星穹铁道" gameShortName="星穹铁道 / 开发中" />
          }
        />
        <Route
          path="/wuwa"
          element={<GamePlaceholderPage gameName="鸣潮" gameShortName="鸣潮 / 开发中" />}
        />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/agent/:id" element={<AgentDetailPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/guide/:id" element={<GuideDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate replace to={includeLanding ? '/' : '/zzz'} />} />
      </Routes>
    </Suspense>
  );
}
