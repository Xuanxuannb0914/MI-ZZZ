import { PageTransition } from '../../shared/ui/page-transition';
import { HomeDashboard } from './ui/home-dashboard';
import { HomeHero } from './ui/home-hero';

export default function HomePage() {
  return (
    <PageTransition>
      <div className="zzz-workspace-page zzz-workspace-page-streamlined">
        <HomeHero />
        <HomeDashboard />
      </div>
    </PageTransition>
  );
}
