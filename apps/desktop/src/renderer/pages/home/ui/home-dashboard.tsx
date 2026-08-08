import { motion } from 'framer-motion';
import { motionPresets } from '../../../shared/animation/motion-presets';
import { AiAssistantWidget } from '../widgets/ai-assistant-widget';
import { AnnouncementsWidget } from '../widgets/announcements-widget';
import { CharacterRecommendationsWidget } from '../widgets/character-recommendations-widget';
import { ContinueReadingWidget } from '../widgets/continue-reading-widget';
import { DailyPlannerWidget } from '../widgets/daily-planner-widget';
import { EventCenterWidget } from '../widgets/event-center-widget';
import { FavoritesWidget } from '../widgets/favorites-widget';
import { GuideCenterWidget } from '../widgets/guide-center-widget';

const reveal = motionPresets.sectionReveal;

export function HomeDashboard() {
  return (
    <motion.div
      className="workspace-dashboard"
      initial="initial"
      animate="animate"
      variants={motionPresets.cardStagger}
    >
      <div className="workspace-primary-grid">
        <motion.div variants={reveal}>
          <DailyPlannerWidget />
        </motion.div>
        <motion.div variants={reveal}>
          <EventCenterWidget />
        </motion.div>
        <motion.div variants={reveal}>
          <AnnouncementsWidget />
        </motion.div>
      </div>
      <motion.div variants={reveal}>
        <CharacterRecommendationsWidget />
      </motion.div>
      <div className="workspace-insight-grid">
        <motion.div variants={reveal}>
          <GuideCenterWidget />
        </motion.div>
        <motion.div variants={reveal}>
          <ContinueReadingWidget />
        </motion.div>
        <motion.div variants={reveal}>
          <FavoritesWidget />
        </motion.div>
      </div>
      <motion.div variants={reveal}>
        <AiAssistantWidget />
      </motion.div>
    </motion.div>
  );
}
