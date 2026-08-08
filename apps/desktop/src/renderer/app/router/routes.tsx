import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingState } from '../../shared/ui/loading-state';

const HomePage = lazy(() => import('../../pages/home/home-page'));
const LandingPage = lazy(() => import('../../pages/landing/landing-page'));
const GameHubPage = lazy(() => import('../../pages/landing/game-hub-page'));
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

export function StartupRoutes() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/startup" />} />
        <Route path="/startup" element={<LandingPage />} />
        <Route path="/games" element={<GameHubPage />} />
        <Route path="*" element={<Navigate replace to="/startup" />} />
      </Routes>
    </Suspense>
  );
}

export function WorkspaceRoutes() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/zzz" />} />
        <Route path="/zzz" element={<HomePage />} />
        <Route path="/home" element={<Navigate replace to="/zzz" />} />
        <Route path="/zzz/guides" element={<GuidesPage />} />
        <Route path="/zzz/guides/:id" element={<GuideDetailPage />} />
        <Route path="/zzz/agents" element={<AgentsPage />} />
        <Route path="/zzz/agents/:id" element={<AgentDetailPage />} />
        <Route path="/zzz/events" element={<EventsPage />} />
        <Route path="/zzz/planner" element={<DailyPage />} />
        <Route path="/zzz/favorites" element={<FavoritesPage />} />
        <Route path="/zzz/search" element={<SearchPage />} />
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
        <Route path="/agents" element={<Navigate replace to="/zzz/agents" />} />
        <Route path="/agent/:id" element={<AgentDetailPage />} />
        <Route path="/guides" element={<Navigate replace to="/zzz/guides" />} />
        <Route path="/guide/:id" element={<GuideDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/daily" element={<Navigate replace to="/zzz/planner" />} />
        <Route path="/events" element={<Navigate replace to="/zzz/events" />} />
        <Route path="/favorites" element={<Navigate replace to="/zzz/favorites" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate replace to="/zzz" />} />
      </Routes>
    </Suspense>
  );
}
