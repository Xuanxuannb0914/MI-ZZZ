import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { workspaceRoutes } from '../../shared/config/workspace-routes';
import { LoadingState } from '../../shared/ui/loading-state';

const HomePage = lazy(() => import('../../pages/home/home-page'));
const LandingPage = lazy(() => import('../../pages/landing/landing-page'));
const GameHubPage = lazy(() => import('../../pages/landing/game-hub-page'));
const DevelopmentPage = lazy(() => import('../../pages/development/development-page'));
const DataCenterPage = lazy(() => import('../../pages/data-center/data-center-page'));
const GachaAnalyticsPage = lazy(() => import('../../pages/gacha/gacha-analytics-page'));
const CommunityFeedPage = lazy(() => import('../../pages/community/community-feed-page'));
const AgentsPage = lazy(() => import('../../pages/agents/agents-page'));
const AgentDetailPage = lazy(() => import('../../pages/agent-detail/agent-detail-page'));
const GuidesPage = lazy(() => import('../../pages/guides/guides-page'));
const GuideDetailPage = lazy(() => import('../../pages/guide-detail/guide-detail-page'));
const SearchPage = lazy(() => import('../../pages/search/search-page'));
const NewsPage = lazy(() => import('../../pages/news/news-page'));
const DailyPage = lazy(() => import('../../pages/daily/daily-page'));
const EventsPage = lazy(() => import('../../pages/events/events-page'));
const MaterialsPage = lazy(() => import('../../pages/materials/materials-page'));
const WEnginesPage = lazy(() => import('../../pages/w-engines/w-engines-page'));
const DriveDiscsPage = lazy(() => import('../../pages/drive-discs/drive-discs-page'));
const TeamsPage = lazy(() => import('../../pages/teams/teams-page'));
const EventDetailPage = lazy(() => import('../../pages/event-detail/event-detail-page'));
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
        <Route path={workspaceRoutes.home} element={<HomePage />} />
        <Route path="/home" element={<Navigate replace to={workspaceRoutes.home} />} />
        <Route path={workspaceRoutes.guides} element={<GuidesPage />} />
        <Route path={`${workspaceRoutes.guides}/:id`} element={<GuideDetailPage />} />

        <Route path={workspaceRoutes.development.overview} element={<DevelopmentPage />} />
        <Route path={workspaceRoutes.development.characters} element={<AgentsPage />} />
        <Route
          path={`${workspaceRoutes.development.characters}/:id`}
          element={<AgentDetailPage />}
        />
        <Route path={workspaceRoutes.development.wEngines} element={<WEnginesPage />} />
        <Route path={`${workspaceRoutes.development.wEngines}/:id`} element={<WEnginesPage />} />
        <Route path={workspaceRoutes.development.driveDiscs} element={<DriveDiscsPage />} />
        <Route
          path={`${workspaceRoutes.development.driveDiscs}/:id`}
          element={<DriveDiscsPage />}
        />
        <Route path={workspaceRoutes.development.materials} element={<MaterialsPage />} />
        <Route path={`${workspaceRoutes.development.materials}/:id`} element={<MaterialsPage />} />
        <Route path={workspaceRoutes.development.teams} element={<TeamsPage />} />
        <Route path={`${workspaceRoutes.development.teams}/:id`} element={<TeamsPage />} />
        <Route path={workspaceRoutes.development.calculator} element={<DailyPage />} />

        <Route path={workspaceRoutes.data.overview} element={<DataCenterPage />} />
        <Route path={workspaceRoutes.data.gacha} element={<GachaAnalyticsPage />} />
        <Route path={workspaceRoutes.data.characters} element={<AgentsPage />} />
        <Route path={`${workspaceRoutes.data.characters}/:id`} element={<AgentDetailPage />} />
        <Route path={workspaceRoutes.data.wEngines} element={<WEnginesPage />} />
        <Route path={`${workspaceRoutes.data.wEngines}/:id`} element={<WEnginesPage />} />
        <Route path={workspaceRoutes.data.versions} element={<EventsPage />} />

        <Route path={workspaceRoutes.community.feed} element={<CommunityFeedPage />} />

        <Route path={workspaceRoutes.encyclopedia.characters} element={<AgentsPage />} />
        <Route
          path={`${workspaceRoutes.encyclopedia.characters}/:id`}
          element={<AgentDetailPage />}
        />
        <Route path={workspaceRoutes.encyclopedia.wEngines} element={<WEnginesPage />} />
        <Route path={`${workspaceRoutes.encyclopedia.wEngines}/:id`} element={<WEnginesPage />} />
        <Route path={workspaceRoutes.encyclopedia.driveDiscs} element={<DriveDiscsPage />} />
        <Route
          path={`${workspaceRoutes.encyclopedia.driveDiscs}/:id`}
          element={<DriveDiscsPage />}
        />

        <Route path={workspaceRoutes.events} element={<EventsPage />} />
        <Route path={`${workspaceRoutes.events}/:id`} element={<EventDetailPage />} />
        <Route path={workspaceRoutes.favorites} element={<FavoritesPage />} />
        <Route path={workspaceRoutes.search} element={<SearchPage />} />

        {/* Legacy deep links stay available while primary navigation uses task-based routes. */}
        <Route path="/zzz/agents" element={<AgentsPage />} />
        <Route path="/zzz/agents/:id" element={<AgentDetailPage />} />
        <Route path="/zzz/events" element={<EventsPage />} />
        <Route path="/zzz/events/:id" element={<EventDetailPage />} />
        <Route path="/zzz/planner" element={<DailyPage />} />
        <Route path="/zzz/materials" element={<MaterialsPage />} />
        <Route path="/zzz/materials/:id" element={<MaterialsPage />} />
        <Route path="/zzz/w-engines" element={<WEnginesPage />} />
        <Route path="/zzz/w-engines/:id" element={<WEnginesPage />} />
        <Route path="/zzz/drive-discs" element={<DriveDiscsPage />} />
        <Route path="/zzz/drive-discs/:id" element={<DriveDiscsPage />} />
        <Route path="/zzz/teams" element={<TeamsPage />} />
        <Route path="/zzz/teams/:id" element={<TeamsPage />} />
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
        <Route path="/materials" element={<Navigate replace to="/zzz/materials" />} />
        <Route path="/events" element={<Navigate replace to="/zzz/events" />} />
        <Route path="/favorites" element={<Navigate replace to="/zzz/favorites" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate replace to="/zzz" />} />
      </Routes>
    </Suspense>
  );
}
