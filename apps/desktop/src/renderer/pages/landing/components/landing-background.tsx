const particles = Array.from({ length: 22 }, (_, index) => index);

export function LandingBackground() {
  return (
    <div className="landing-background" aria-hidden="true">
      <div className="landing-aurora landing-aurora-one" />
      <div className="landing-aurora landing-aurora-two" />
      <div className="landing-grid" />
      <div className="landing-vignette" />
      <div className="landing-particles">
        {particles.map((particle) => (
          <span key={particle} className={`landing-particle landing-particle-${particle + 1}`} />
        ))}
      </div>
    </div>
  );
}
