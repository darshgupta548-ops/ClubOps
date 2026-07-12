import { useState, useRef, useEffect } from 'react';

const MODULE_ICONS = {
  plan: '⌁',
  active: '◐',
  budget: '◒',
  resources: '⌂',
  documentation: '▤',
  gallery: '◫',
};

function PhotoStack({ albums }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const handleMouseDown = (e) => {
    if (isAnimating) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;
    setDragX(deltaX);
    setDragY(deltaY);
    setRotation(deltaX * 0.03);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 120;
    if (Math.abs(dragX) > threshold) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % albums.length);
        setDragX(0);
        setDragY(0);
        setRotation(0);
        setTimeout(() => setIsAnimating(false), 400);
      }, 300);
    } else {
      setDragX(0);
      setDragY(0);
      setRotation(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragX, dragY]);

  const visibleAlbums = [];
  for (let i = 0; i < 5; i++) {
    visibleAlbums.push(albums[(currentIndex + i) % albums.length]);
  }

  return (
    <div 
      className="co-dashboard-card__photo-stack"
      onMouseDown={handleMouseDown}
    >
      {visibleAlbums.map((album, i) => {
        const isFront = i === 0;
        const stackIndex = i;
        const baseRotation = (stackIndex - 2) * 1.5;
        const baseOffsetX = (stackIndex - 2) * 6;
        const baseOffsetY = stackIndex * 4;
        const scale = 1 - stackIndex * 0.06;
        const opacity = stackIndex === 0 ? 1 : 1 - stackIndex * 0.15;
        const zIndex = 10 - stackIndex;
        
        const finalRotation = isFront ? rotation : baseRotation;
        const finalOffsetX = isFront ? baseOffsetX + dragX : baseOffsetX;
        const finalOffsetY = isFront ? baseOffsetY + dragY - Math.abs(dragX) * 0.1 : baseOffsetY;
        const finalScale = isFront ? scale + Math.abs(dragX) * 0.0008 : scale;
        const finalOpacity = isFront ? 1 : opacity;
        const shadowIntensity = isDragging && isFront ? 1.3 : 1;

        return (
          <div
            key={`${album.name}-${currentIndex}-${i}`}
            className="co-dashboard-card__photo-card"
            style={{
              transform: `translate(${finalOffsetX}px, ${finalOffsetY}px) rotate(${finalRotation}deg) scale(${finalScale})`,
              opacity: finalOpacity,
              zIndex,
              transition: isDragging || isAnimating ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
              '--shadow-intensity': shadowIntensity,
            }}
          >
            <div className="co-dashboard-card__photo-card-content">
              <div className="co-dashboard-card__photo-card-image" />
              <div className="co-dashboard-card__photo-card-overlay">
                <b>{album.name}</b>
                <small>{album.photos} Photos{album.videos > 0 && ` • ${album.videos} Videos`}</small>
                <small className="co-dashboard-card__photo-card-date">{album.date}</small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardCard({ module }) {
  return (
    <button
      className={`co-dashboard-card co-dashboard-card--${module.tone}`}
      type="button"
      style={{ '--float-delay': `${module.floatDelay}s` }}
    >
      <span className="co-dashboard-card__icon" aria-hidden="true">{MODULE_ICONS[module.id]}</span>
      <span className="co-dashboard-card__content">
        <span className="co-dashboard-card__eyebrow">{module.eyebrow}</span>
        <strong>{module.title}</strong>
        <CardPreview module={module} />
      </span>
      <span className="co-dashboard-card__arrow" aria-hidden="true">↗</span>
    </button>
  );
}

function CardPreview({ module }) {
  switch (module.id) {
    case 'plan':
      return <div className="co-dashboard-card__preview co-dashboard-card__preview--workspace"><h3>{module.preview.draftEvent}</h3><p>{module.preview.planningPhase}</p><div className="co-dashboard-card__next-action"><small>Next</small><span>{module.preview.nextAction}</span></div>{module.preview.draftSaved && <small className="co-dashboard-card__draft-saved">Draft saved</small>}<span className="co-dashboard-card__action co-dashboard-card__action--primary co-dashboard-card__action--large">Continue Planning <b>→</b></span><span className="co-dashboard-card__action co-dashboard-card__action--secondary">+ Create New Event</span></div>;
    case 'active':
      return <div className="co-dashboard-card__preview co-dashboard-card__panels co-dashboard-card__panels--active"><InfoPanel label="Event" value={module.preview.event} /><InfoPanel label="Phase" value={module.preview.phase} /><InfoPanel label="Date" value={module.preview.date} /><InfoPanel label="Tasks" value={`${module.preview.pendingTasks} pending`} /></div>;
    case 'budget':
      return <div className="co-dashboard-card__preview"><div className="co-dashboard-card__panels"><InfoPanel label="Allocated" value={module.preview.allocated} /><InfoPanel label="Spent" value={module.preview.spent} primary /><InfoPanel label="Remaining" value={module.preview.remaining} /></div><div className="co-dashboard-card__embedded"><small>Next expense</small><b>{module.preview.nextExpense}</b></div><span className="co-dashboard-card__progress"><i style={{ width: `${module.preview.progress}%` }} /></span></div>;
    case 'resources':
      return <div className="co-dashboard-card__preview"><div className="co-dashboard-card__panels"><InfoPanel label="Available" value={module.preview.available} /><InfoPanel label="Reserved" value={module.preview.reserved} /><InfoPanel label="Pending" value={module.preview.requests} /></div><div className="co-dashboard-card__embedded-list"><small>Recent reservations</small>{module.preview.recentReservations.map((item, i) => <span key={i} className="co-dashboard-card__resource-item"><i className={item.status === 'confirmed' ? 'is-confirmed' : 'is-pending'} />{item.name}</span>)}<small>Awaiting approval</small>{module.preview.awaitingApproval.map((item, i) => <span key={i} className="co-dashboard-card__resource-item"><i className="is-pending" />{item.name}</span>)}</div></div>;
    case 'documentation':
      return <div className="co-dashboard-card__preview"><div className="co-dashboard-card__panels"><InfoPanel label="Pending reports" value={module.preview.pendingReports} /><InfoPanel label="Last report" value={module.preview.lastReport} /></div><div className="co-dashboard-card__embedded-list"><small>Recent activity</small>{module.preview.recentActivity.map((item, i) => <span key={i}>{item}</span>)}<small>Review queue</small><span>{module.preview.reviewQueue}</span></div><div className="co-dashboard-card__embedded"><small>Export history</small><b>{module.preview.exportHistory}</b></div></div>;
    case 'gallery':
      return <div className="co-dashboard-card__preview"><PhotoStack albums={module.preview.albums} /></div>;
    default:
      return null;
  }
}

function InfoPanel({ label, value, primary }) {
  return <span className="co-dashboard-card__panel"><small>{label}</small><b className={primary ? 'is-primary' : ''}>{value}</b></span>;
}
