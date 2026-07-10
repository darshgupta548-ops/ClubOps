import { useEffect, useRef, useMemo } from 'react';
import './StarField.css';

/**
 * Premium night sky rendered on HTML5 Canvas for performance.
 * Three layers of stars with natural distribution, clustering, and subtle animation.
 * Atmosphere inspired by Stellarium, ESO Observatory, and professional astrophotography.
 */

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateLayer(count, rand, layerConfig) {
  const stars = [];
  const { minRadius, maxRadius, minOpacity, maxOpacity, depth } = layerConfig;
  
  // Organic distribution with regions and empty spaces
  const regions = 12;
  for (let r = 0; r < regions; r++) {
    if (rand() > 0.55) continue; // Some regions empty
    
    const regionX = rand();
    const regionY = rand();
    const regionSize = 0.15 + rand() * 0.25;
    const starsInRegion = Math.floor((count / regions) * 0.6) + Math.floor(rand() * 4);
    
    for (let i = 0; i < starsInRegion; i++) {
      const angle = rand() * Math.PI * 2;
      const distance = rand() * regionSize;
      const x = regionX + Math.cos(angle) * distance;
      const y = regionY + Math.sin(angle) * distance;
      
      // Color temperature: cool blue-white, warm-white, neutral
      const colorRoll = rand();
      let r, g, b;
      if (colorRoll > 0.80) {
        // Cool blue-white (O/B type stars)
        r = 200 + rand() * 20;
        g = 220 + rand() * 25;
        b = 250 + rand() * 5;
      } else if (colorRoll > 0.60) {
        // Warm-white (G/K type stars like our Sun)
        r = 255 + rand() * 0;
        g = 250 + rand() * 5;
        b = 230 + rand() * 15;
      } else {
        // Neutral white (A/F type stars)
        r = 240 + rand() * 15;
        g = 240 + rand() * 15;
        b = 250 + rand() * 5;
      }
      
      const radius = minRadius + rand() * (maxRadius - minRadius);
      const opacity = minOpacity + rand() * (maxOpacity - minOpacity);
      
      // Only brightest stars can twinkle (top 5%)
      const canTwinkle = radius > (minRadius + maxRadius) * 0.7 && opacity > (minOpacity + maxOpacity) * 0.6 && rand() > 0.85;
      
      stars.push({
        x: Math.max(0.02, Math.min(0.98, x)),
        y: Math.max(0.02, Math.min(0.98, y)),
        radius,
        r, g, b,
        opacity,
        baseOpacity: opacity,
        canTwinkle,
        twinklePhase: rand() * Math.PI * 2,
        twinkleSpeed: 0.3 + rand() * 0.5,
        driftX: (rand() - 0.5) * 0.02 * depth,
        driftY: (rand() - 0.5) * 0.015 * depth,
        driftPhase: rand() * Math.PI * 2,
        depth,
      });
    }
  }
  
  // Add isolated scattered stars
  const isolatedCount = Math.floor(count * 0.15);
  for (let i = 0; i < isolatedCount; i++) {
    const radius = minRadius + rand() * (maxRadius - minRadius) * 0.8;
    const opacity = minOpacity + rand() * (maxOpacity - minOpacity) * 0.8;
    
    const colorRoll = rand();
    let r, g, b;
    if (colorRoll > 0.7) {
      r = 230 + rand() * 10;
      g = 228 + rand() * 10;
      b = 222 + rand() * 10;
    } else {
      r = 235 + rand() * 8;
      g = 233 + rand() * 8;
      b = 228 + rand() * 8;
    }
    
    stars.push({
      x: rand(),
      y: rand(),
      radius,
      r, g, b,
      opacity,
      baseOpacity: opacity,
      canTwinkle: false,
      twinklePhase: 0,
      twinkleSpeed: 0,
      driftX: (rand() - 0.5) * 0.01 * depth,
      driftY: (rand() - 0.5) * 0.008 * depth,
      driftPhase: rand() * Math.PI * 2,
      depth: depth * 0.5,
    });
  }
  
  return stars;
}

export default function StarField() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  []);
  
  const layers = useMemo(() => {
    const rand = seededRandom(42);
    
    return [
      // Layer 1: Tiny dim stars (background)
      generateLayer(160, rand, {
        minRadius: 0.5,
        maxRadius: 0.8,
        minOpacity: 0.04,
        maxOpacity: 0.08,
        depth: 0.3,
      }),
      // Layer 2: Medium stars (midground)
      generateLayer(70, rand, {
        minRadius: 0.9,
        maxRadius: 1.3,
        minOpacity: 0.08,
        maxOpacity: 0.15,
        depth: 0.6,
      }),
      // Layer 3: Bright stars (foreground)
      generateLayer(25, rand, {
        minRadius: 1.4,
        maxRadius: 2.0,
        minOpacity: 0.14,
        maxOpacity: 0.28,
        depth: 1.0,
      }),
    ];
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationTime = 0;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const render = (timestamp) => {
      if (prefersReducedMotion) {
        animationTime = 0;
      } else {
        animationTime = timestamp * 0.0001; // Very slow time scale
      }
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw constellation lines
      ctx.strokeStyle = 'rgba(220, 230, 240, 0.04)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      const lines = [
        [[0.04, 0.12], [0.09, 0.22], [0.07, 0.34]],
        [[0.93, 0.15], [0.88, 0.08], [0.96, 0.28]],
      ];
      lines.forEach(line => {
        ctx.moveTo(line[0][0] * width, line[0][1] * height);
        line.forEach(point => {
          ctx.lineTo(point[0] * width, point[1] * height);
        });
      });
      ctx.stroke();
      
      // Draw each layer
      layers.forEach(layer => {
        layer.forEach(star => {
          const driftX = Math.sin(animationTime * 0.5 + star.driftPhase) * star.driftX * width;
          const driftY = Math.cos(animationTime * 0.5 + star.driftPhase) * star.driftY * height;
          
          const x = star.x * width + driftX;
          const y = star.y * height + driftY;
          
          // Twinkle effect - very gentle
          let currentOpacity = star.opacity;
          if (star.canTwinkle && !prefersReducedMotion) {
            const twinkle = Math.sin(animationTime * star.twinkleSpeed + star.twinklePhase);
            currentOpacity = star.baseOpacity * (1 + twinkle * 0.08);
          }
          
          // Draw star - crisp point for small stars, circle for larger
          if (star.radius < 0.7) {
            // Tiny stars as crisp points
            ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${currentOpacity})`;
            ctx.fillRect(x - star.radius * 0.5, y - star.radius * 0.5, star.radius, star.radius);
          } else {
            // Larger stars as circles
            ctx.beginPath();
            ctx.arc(x, y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${currentOpacity})`;
            ctx.fill();
          }
          
          // Subtle glow only on brightest 3-5% of stars
          if (star.radius > 1.5 && currentOpacity > 0.18) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.radius * 2.5);
            gradient.addColorStop(0, `rgba(${star.r}, ${star.g}, ${star.b}, ${currentOpacity * 0.12})`);
            gradient.addColorStop(0.5, `rgba(${star.r}, ${star.g}, ${star.b}, ${currentOpacity * 0.04})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(x, y, star.radius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    animationRef.current = requestAnimationFrame(render);
    
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
