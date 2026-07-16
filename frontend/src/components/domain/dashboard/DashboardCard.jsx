import { useRef, useState } from 'react';

const MODULE_ICONS = {
  plan: '⌁',
  active: '◐',
  budget: '◒',
  resources: '⌂',
  documentation: '▤',
  gallery: '◫',
};

const SWIPE_THRESHOLD = 72;
const STACK_SIZE = 5;

function PhotoStack({ albums }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState(0);
  const startPoint = useRef(null);

  const visibleAlbums = Array.from({ length: Math.min(STACK_SIZE, albums.length) }, (_, index) => (
    albums[(currentIndex + index) % albums.length]
  ));

  const releaseCard = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(drag.x) < SWIPE_THRESHOLD) {
      setDrag({ x: 0, y: 0 });
      return;
    }

    setExitDirection(Math.sign(drag.x));
    window.setTimeout(() => {
      setCurrentIndex((index) => (index + 1) % albums.length);
      setDrag({ x: 0, y: 0 });
      setExitDirection(0);
    }, 320);
  };

  const handlePointerDown = (event) => {
    if (exitDirection) return;
    startPoint.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !startPoint.current) return;
    const x = event.clientX - startPoint.current.x;
    const y = event.clientY - startPoint.current.y;
    setDrag({ x, y: y * 0.18 });
  };

  const handlePointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    startPoint.current = null;
    releaseCard();
  };

  return (
    <div
      className={`co-dashboard-card__photo-stack ${isDragging ? 'is-dragging' : ''} ${exitDirection ? 'is-cycling' : ''}`}
      aria-label="Event album stack. Drag or swipe to browse albums."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {visibleAlbums.map((album, index) => {
        const isFront = index === 0;
        const stackRotation = index === 0 ? 0 : index % 2 === 0 ? -1.4 : 1.25;

        return (
          <div
            key={`${album.title}-${currentIndex}-${index}`}
            className={`co-dashboard-card__photo-card ${isFront ? 'is-front' : ''}`}
            style={{
              '--stack-x': `${index * 6}px`,
              '--stack-y': `${index * 6}px`,
              '--stack-rotation': `${stackRotation}deg`,
              '--stack-scale': 1 - index * 0.045,
              '--stack-opacity': 1 - index * 0.12,
              '--drag-x': isFront ? `${drag.x}px` : '0px',
              '--drag-y': isFront ? `${drag.y}px` : '0px',
              '--drag-rotation': isFront ? `${drag.x * 0.025}deg` : '0deg',
              '--exit-x': isFront && exitDirection ? `${exitDirection * 260}px` : '0px',
              '--idle-delay': `${index * 1.3}s`,
              zIndex: STACK_SIZE - index,
            }}
          >
            <div className="co-dashboard-card__photo-card-content">
              <div className={`co-dashboard-card__photo-card-image co-dashboard-card__photo-card-image--${album.art}`} />
              <div className="co-dashboard-card__photo-card-overlay">
                <b>{album.title}</b>
                <small>{album.date} · {album.photos} photos{album.videos ? ` · ${album.videos} videos` : ''}</small>
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
