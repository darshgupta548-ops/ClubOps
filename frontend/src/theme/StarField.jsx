import { useEffect, useRef, useMemo } from 'react';
import './StarField.css';

/**
 * Premium night sky rendered on HTML5 Canvas for performance.
 * Three layers of stars with natural distribution, clustering, subtle color
 * temperatures, rare twinkling, and gentle depth-based parallax.
 */

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function getStarColor(rand) {
  const roll = rand();
  if (roll > 0.85) {
    return {
      r: 200 + rand() * 30,
      g: 215 + rand() * 30,
      b: 245 + rand() * 10,
    };
  }
  if (roll > 0.60) {
    return {
      r: 245 + rand() * 10,
      g: 235 + rand() * 12,
      b: 218 + rand() * 16,
    };
  }
  return {
    r: 230 + rand() * 18,
    g: 232 + rand() * 18,
    b: 245 + rand() * 10,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function generateLayer(count, rand, layerConfig) {
  const stars = [];
  const { minRadius, maxRadius, minOpacity, maxOpacity, depth } = layerConfig;

  const clusteredStars = Math.floor(count * 0.72);
  const isolatedStars = count - clusteredStars;
  const clusterCount = Math.max(3, Math.floor(clusteredStars / 16));

  for (let c = 0; c < clusterCount; c++) {
    const clusterCenterX = 0.08 + rand() * 0.84;
    const clusterCenterY = 0.08 + rand() * 0.84;
    const clusterRadius = 0.08 + rand() * 0.14;
    const segmentStars = Math.floor(clusteredStars / clusterCount) + Math.floor(rand() * 4);

    for (let i = 0; i < segmentStars; i++) {
      const angle = rand() * Math.PI * 2;
      const radiusScale = Math.pow(rand(), 1.4);
      const distance = radiusScale * clusterRadius;
      const x = clusterCenterX + Math.cos(angle) * distance;
      const y = clusterCenterY + Math.sin(angle) * distance;

      const starRadius = minRadius + rand() * (maxRadius - minRadius);
      const baseOpacity = minOpacity + rand() * (maxOpacity - minOpacity);
      const color = getStarColor(rand);
      const canTwinkle = starRadius > (minRadius + maxRadius) * 0.7 && baseOpacity > (minOpacity + maxOpacity) * 0.55 && rand() < 0.04;
      const canGlow = rand() < 0.045 && starRadius > (minRadius + maxRadius) * 0.8;

      stars.push({
        x: clamp(x, 0.01, 0.99),
        y: clamp(y, 0.01, 0.99),
        radius: starRadius,
        r: color.r,
        g: color.g,
        b: color.b,
        opacity: baseOpacity,
        baseOpacity,
        canTwinkle,
        canGlow,
        twinklePhase: rand() * Math.PI * 2,
        twinkleSpeed: 0.25 + rand() * 0.35,
        parallaxX: (rand() - 0.5) * 0.06 * depth,
        parallaxY: (rand() - 0.5) * 0.035 * depth,
        parallaxPhase: rand() * Math.PI * 2,
        parallaxSpeed: 0.12 + rand() * 0.08,
        depth,
      });
    }
  }

  for (let i = 0; i < isolatedStars; i++) {
    const x = rand();
    const y = rand();
    const starRadius = minRadius + rand() * (maxRadius - minRadius) * 0.85;
    const baseOpacity = minOpacity + rand() * (maxOpacity - minOpacity) * 0.85;
    const color = getStarColor(rand);
    const canTwinkle = rand() < 0.02 && starRadius > (minRadius + maxRadius) * 0.75;
    const canGlow = rand() < 0.02 && starRadius > (minRadius + maxRadius) * 0.85;

    stars.push({
      x,
      y,
      radius: starRadius,
      r: color.r,
      g: color.g,
      b: color.b,
      opacity: baseOpacity,
      baseOpacity,
      canTwinkle,
      canGlow,
      twinklePhase: rand() * Math.PI * 2,
      twinkleSpeed: 0.2 + rand() * 0.45,
      parallaxX: (rand() - 0.5) * 0.05 * depth,
      parallaxY: (rand() - 0.5) * 0.03 * depth,
      parallaxPhase: rand() * Math.PI * 2,
      parallaxSpeed: 0.08 + rand() * 0.06,
      depth,
    });
  }

  return stars;
}

export default function StarField() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const layers = useMemo(() => {
    const rand = seededRandom(42);
    return [
      generateLayer(180, rand, {
        minRadius: 0.4,
        maxRadius: 0.75,
        minOpacity: 0.03,
        maxOpacity: 0.07,
        depth: 0.25,
      }),
      generateLayer(80, rand, {
        minRadius: 0.8,
        maxRadius: 1.3,
        minOpacity: 0.07,
        maxOpacity: 0.14,
        depth: 0.55,
      }),
      generateLayer(30, rand, {
        minRadius: 1.3,
        maxRadius: 2.2,
        minOpacity: 0.14,
        maxOpacity: 0.26,
        depth: 1.0,
      }),
    ];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationTime = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBackground = (width, height) => {
      ctx.fillStyle = '#03050d';
      ctx.fillRect(0, 0, width, height);

      const skyGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        width * 0.02,
        width * 0.5,
        height * 0.25,
        width * 0.88,
      );
      skyGradient.addColorStop(0, 'rgba(52, 65, 98, 0.20)');
      skyGradient.addColorStop(0.35, 'rgba(18, 24, 42, 0.14)');
      skyGradient.addColorStop(1, 'rgba(3, 6, 12, 0.00)');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      const haze = ctx.createRadialGradient(
        width * 0.6,
        height * 0.3,
        width * 0.02,
        width * 0.6,
        height * 0.3,
        width * 0.65,
      );
      haze.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      haze.addColorStop(0.4, 'rgba(255, 255, 255, 0.01)');
      haze.addColorStop(1, 'rgba(4, 8, 18, 0.18)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);
    };

    const renderFrame = (timestamp) => {
      if (prefersReducedMotion) {
        animationTime = 0;
      } else {
        animationTime = timestamp * 0.00004;
      }

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);
      drawBackground(width, height);

      layers.forEach((layer) => {
        layer.forEach((star) => {
          const driftTime = animationTime * 0.9;
          const offsetX = Math.sin(driftTime * star.parallaxSpeed + star.parallaxPhase) * star.parallaxX * width;
          const offsetY = Math.cos(driftTime * star.parallaxSpeed + star.parallaxPhase) * star.parallaxY * height + Math.sin(animationTime * 0.18 + star.twinklePhase) * (0.8 * star.depth);
          const x = star.x * width + offsetX;
          const y = star.y * height + offsetY;

          let currentOpacity = star.opacity;
          if (star.canTwinkle && !prefersReducedMotion) {
            const twinkle = Math.sin(animationTime * star.twinkleSpeed + star.twinklePhase);
            currentOpacity = star.baseOpacity * (1 + twinkle * 0.08);
          }

          const color = `rgba(${star.r}, ${star.g}, ${star.b}, ${currentOpacity})`;
          const isTiny = star.radius < 0.7;
          const isMedium = star.radius >= 0.7 && star.radius < 1.7;

          if (isTiny) {
            ctx.fillStyle = color;
            ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
          } else if (isMedium) {
            const glowSize = star.radius * 1.8;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.6, color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);
          } else {
            ctx.beginPath();
            ctx.arc(x, y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          }

          if (star.canGlow && currentOpacity > 0.16) {
            const glowSize = Math.max(star.radius * 3.5, 6);
            const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
            glow.addColorStop(0, `rgba(${star.r}, ${star.g}, ${star.b}, ${currentOpacity * 0.16})`);
            glow.addColorStop(0.35, `rgba(${star.r}, ${star.g}, ${star.b}, ${currentOpacity * 0.06})`);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
          }
        });
      });

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(renderFrame);
      }
    };


    resize();
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      renderFrame(0);
    } else {
      animationRef.current = requestAnimationFrame(renderFrame);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [layers, prefersReducedMotion]);
  return (
    <div className="co-starfield" aria-hidden="true">
      <canvas ref={canvasRef} className="co-starfield__canvas" />
    </div>
  );
}
