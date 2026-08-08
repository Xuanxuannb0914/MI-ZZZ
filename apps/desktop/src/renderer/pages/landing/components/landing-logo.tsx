import { motion } from 'framer-motion';

export function LandingLogo() {
  return (
    <motion.div
      className="landing-logo"
      initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.16, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="landing-logo-orbit landing-logo-orbit-one" />
      <div className="landing-logo-orbit landing-logo-orbit-two" />
      <div className="landing-logo-core">G</div>
      <span className="landing-logo-scan landing-logo-scan-left">01</span>
      <span className="landing-logo-scan landing-logo-scan-right">NEO</span>
    </motion.div>
  );
}
