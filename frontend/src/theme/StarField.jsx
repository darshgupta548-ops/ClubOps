import { useMemo } from 'react';
import './StarField.css';

/**
 * Extremely subtle background atmosphere.
 * Purpose: ambient depth, not decoration. Users should
 * almost forget it's there. No planets, no glow, no nebulas —
 * just sparse points and a few faint constellation lines near the edges.
 */

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateStars(count, rand) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    size: 0.6 + rand() * 1.2,
    delay: rand() * 8,
    duration: 4 + rand() * 5,
  }));
}

// A handful of stars near the edges are linked with faint lines,
// echoing a constellation without depicting one literally.
const CONSTELLATION_EDGE_POINTS = [
  [4, 12], [9, 22], [7, 34],
  [93, 15], [88, 8], [96, 28],
];

export default function StarField() {
  const stars = useMemo(() => generateStars(60, seededRandom(42)), []);

  return (
    <div className="co-starfield" aria-hidden="true">
      <svg className="co-starfield__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={CONSTELLATION_EDGE_POINTS.slice(0, 3).map(p => p.join(',')).join(' ')}
          fill="none"
        />
        <polyline
          points={CONSTELLATION_EDGE_POINTS.slice(3, 6).map(p => p.join(',')).join(' ')}
          fill="none"
        />
      </svg>
      {stars.map((s) => (
        <span
          key={s.id}
          className="co-starfield__star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
