import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StarField from '../../theme/StarField';
import DashboardPreview from '../../components/domain/DashboardPreview';
import './Landing.css';

/**
 * Entry point into ClubOps.
 *
 * Guest: "Your workspace already exists. Authenticate to enter it."
 *   — dashboard is visible but blurred and locked, scroll is disabled.
 * Authenticated: the same blur dissolves as the user scrolls, revealing
 *   the real workspace beneath — one continuous surface, not a page swap.
 *
 * The blur/opacity are scroll-driven (not a canned CSS animation) so the
 * dissolve is under the user's own hand — calm and directly controlled,
 * per the brief's "elegant notebook, not a game" instruction.
 */
export default function Landing() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0 = fully locked, 1 = fully revealed

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const vh = window.innerHeight;
      const p = Math.min(Math.max(el.scrollTop / (vh * 0.9), 0), 1);
      setProgress(p);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const blurPx = isAuthenticated ? 22 - progress * 22 : 22;
  const scrimOpacity = isAuthenticated ? 0.55 - progress * 0.55 : 0.55;
  const heroTranslate = isAuthenticated ? progress * -40 : 0;
  const heroOpacity = isAuthenticated ? 1 - progress * 1.3 : 1;

  return (
    <div
      className="co-landing co-grain"
      ref={scrollRef}
      style={{ overflowY: isAuthenticated ? 'auto' : 'hidden' }}
    >
      <StarField />

      <div className="co-landing__wordmark">ClubOps</div>

      {/* The workspace beneath — always mounted, revealed via blur/scrim */}
      <div className="co-landing__stage" style={{ filter: `blur(${blurPx}px)` }}>
        <DashboardPreview />
      </div>
      <div className="co-landing__scrim" style={{ opacity: scrimOpacity }} />

      {/* Hero content — pinned for guests, drifts up and fades for authenticated users */}
      <div
        className="co-landing__hero"
        style={{
          transform: `translateY(${heroTranslate}px)`,
          opacity: heroOpacity,
          pointerEvents: isAuthenticated && progress > 0.6 ? 'none' : 'auto',
        }}
      >
        {isAuthenticated ? (
          <>
            <p className="co-landing__eyebrow">Welcome back,</p>
            <h1 className="co-landing__name">{user.name}</h1>
            <button className="co-landing__continue" type="button">
              Continue to Dashboard
            </button>
            <span className="co-landing__hint">↓ Continue</span>
          </>
        ) : (
          <>
            <p className="co-landing__eyebrow">Welcome,</p>
            <h1 className="co-landing__name">Space Builder</h1>
            <p className="co-landing__tagline">
              Your workspace already exists. Authenticate to enter it.
            </p>
            <div className="co-landing__actions">
              <button className="co-landing__btn co-landing__btn--primary" type="button">
                Sign In
              </button>
              <button className="co-landing__btn co-landing__btn--ghost" type="button">
                Create Account
              </button>
            </div>
          </>
        )}
      </div>

      {/* Scroll spacer so authenticated users have distance to reveal into */}
      {isAuthenticated && <div className="co-landing__spacer" />}
    </div>
  );
}
