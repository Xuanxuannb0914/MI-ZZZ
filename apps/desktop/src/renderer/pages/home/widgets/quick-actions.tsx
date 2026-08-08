import type { LucideIcon } from '@game-guide-hub/icons';
import {
  BookOpen,
  Bot,
  CalendarDays,
  Disc3,
  PackageOpen,
  Radio,
  Swords,
  UsersRound,
  Zap,
} from '@game-guide-hub/icons';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motionPresets } from '../../../shared/animation/motion-presets';

interface QuickAction {
  readonly label: string;
  readonly to: string;
  readonly icon: LucideIcon;
  readonly comingSoon?: boolean;
}

const actions: readonly QuickAction[] = [
  { label: '角色图鉴', to: '/agents', icon: UsersRound },
  { label: '配队推荐', to: '/agents', icon: Swords },
  { label: '驱动盘', to: '/guides', icon: Disc3 },
  { label: '音擎', to: '/guides', icon: Radio },
  { label: '材料查询', to: '/daily', icon: PackageOpen },
  { label: '每日养成', to: '/daily', icon: CalendarDays },
  { label: '攻略中心', to: '/guides', icon: BookOpen },
  { label: '兑换码', to: '/guides', icon: Zap },
  { label: 'AI 助手', to: '/zzz', icon: Bot, comingSoon: true },
];

export const QuickActions = memo(function QuickActions() {
  return (
    <nav className="workspace-quick-actions" aria-label="快捷入口">
      {actions.map(({ label, to, icon: Icon, comingSoon }) =>
        comingSoon ? (
          <button type="button" key={label} className="workspace-quick-action" disabled>
            <Icon aria-hidden="true" size={16} />
            <span>{label}</span>
            <small>即将上线</small>
          </button>
        ) : (
          <motion.div key={label} {...motionPresets.hoverButton}>
            <Link to={to} className="workspace-quick-action">
              <Icon aria-hidden="true" size={16} />
              <span>{label}</span>
            </Link>
          </motion.div>
        ),
      )}
    </nav>
  );
});
