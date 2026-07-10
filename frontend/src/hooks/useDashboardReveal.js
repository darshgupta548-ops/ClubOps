import { useEffect, useState } from 'react';

/**
 * Converts a deliberate downward scroll or swipe into a dashboard reveal.
 * It is intentionally local UI state; authentication remains owned by
 * AuthContext and data access remains outside this hook.
 */
export default function useDashboardReveal(isAuthenticated) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setEntered(false);
      return undefined;
    }

    let wheelDistance = 0;
    let touchStartY = null;
    const enter = () => setEntered(true);

    const handleWheel = (event) => {
      if (event.deltaY <= 0) return;
      wheelDistance += event.deltaY;
      if (wheelDistance > 60) enter();
    };

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event) => {
      if (touchStartY === null) return;
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      if (touchStartY - currentY > 50) enter();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isAuthenticated]);

  return { entered, enterDashboard: () => setEntered(true) };
}
