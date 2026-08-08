import { motion as themeMotion } from '@game-guide-hub/theme';

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const standardEase: [number, number, number, number] = [0.2, 0, 0, 1];

export const motionDurations = {
  fast: themeMotion.durationSeconds.fast,
  normal: themeMotion.durationSeconds.normal,
  slow: themeMotion.durationSeconds.slow,
  route: themeMotion.durationSeconds.route,
  cinematic: themeMotion.durationSeconds.cinematic,
  ambient: themeMotion.durationSeconds.ambient,
} as const;

export const motionPresets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: motionDurations.normal, ease: standardEase },
  },
  slide: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: motionDurations.slow, ease: premiumEase },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.985 },
    transition: { duration: motionDurations.normal, ease: premiumEase },
  },
  float: {
    animate: { y: [0, -4, 0] },
    transition: {
      duration: motionDurations.ambient,
      ease: 'easeInOut',
      repeat: Number.POSITIVE_INFINITY,
    },
  },
  hoverCard: {
    whileHover: { y: -4, scale: 1.01 },
    whileTap: { y: -1, scale: 0.99 },
    transition: { duration: motionDurations.normal, ease: premiumEase },
  },
  hoverButton: {
    whileHover: { y: -1, scale: 1.01 },
    whileTap: { y: 0, scale: 0.98 },
    transition: { duration: motionDurations.fast, ease: standardEase },
  },
  hoverIcon: {
    whileHover: { scale: 1.06, rotate: 2 },
    whileTap: { scale: 0.95 },
    transition: { duration: motionDurations.fast, ease: standardEase },
  },
  page: {
    initial: { opacity: 0, y: 12, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -6, filter: 'blur(5px)' },
    transition: { duration: motionDurations.route, ease: premiumEase },
  },
  sidebar: {
    expanded: { x: 0, opacity: 1 },
    collapsed: { x: -18, opacity: 0 },
    transition: { duration: motionDurations.normal, ease: premiumEase },
  },
  dialog: {
    initial: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.985, filter: 'blur(5px)' },
    transition: { duration: motionDurations.normal, ease: premiumEase },
  },
  cardStagger: {
    animate: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
  },
  sectionReveal: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: motionDurations.slow, ease: premiumEase },
  },
} as const;

export const pageMotion = motionPresets.page;
export const cardHoverMotion = motionPresets.hoverCard;
export const buttonHoverMotion = motionPresets.hoverButton;
export const sidebarExpandMotion = motionPresets.sidebar;
