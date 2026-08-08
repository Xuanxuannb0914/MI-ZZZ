import { motion } from 'framer-motion';
import { motionPresets } from '../../../shared/animation/motion-presets';
import { CharacterRecommendationsWidget } from '../widgets/character-recommendations-widget';
import { DailyPlannerWidget } from '../widgets/daily-planner-widget';
import { EventCenterWidget } from '../widgets/event-center-widget';
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
      <div className="workspace-priority-grid">
        <motion.div variants={reveal}>
          <DailyPlannerWidget />
        </motion.div>
        <motion.div variants={reveal}>
          <EventCenterWidget />
        </motion.div>
      </div>
      <div className="workspace-recommendation-grid">
        <motion.div variants={reveal}>
          <GuideCenterWidget />
        </motion.div>
        <motion.div variants={reveal}>
          <CharacterRecommendationsWidget />
        </motion.div>
      </div>
    </motion.div>
  );
}
