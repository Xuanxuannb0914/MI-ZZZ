import { PageTransition } from '../../shared/ui/page-transition';
import { HomeDashboard } from './ui/home-dashboard';
import { HomeHero } from './ui/home-hero';
import { WorkspaceUtilityRail } from './widgets/workspace-utility-rail';

export default function HomePage() {
  return (
    <PageTransition>
      <div className="zzz-workspace-page">
        <div className="workspace-main-column">
          <HomeHero />
          <HomeDashboard />
        </div>
        <WorkspaceUtilityRail />
      </div>
    </PageTransition>
  );
}
