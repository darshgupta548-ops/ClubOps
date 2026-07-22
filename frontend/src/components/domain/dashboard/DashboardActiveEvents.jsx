export default function DashboardActiveEvents({ events = [], onOpenEvent }) {
  return (
    <section className="co-active-events" aria-labelledby="active-events-title">
      <div className="co-active-events__heading">
        <div>
          <p>Live workspace</p>
          <h2 id="active-events-title">Active events</h2>
        </div>
        <span>{events.length} {events.length === 1 ? 'event' : 'events'}</span>
      </div>

      {events.length ? (
        <div className="co-active-events__list">
          {events.map((event) => (
            <button key={event.id} type="button" className="co-active-events__item" onClick={() => onOpenEvent?.(event.id)}>
              <span className={`co-active-events__status co-active-events__status--${event.status}`} aria-hidden="true" />
              <span className="co-active-events__item-copy">
                <strong>{event.name}</strong>
                <small>{event.dateLabel} · {event.venue}</small>
              </span>
              <span className="co-active-events__item-progress"><i style={{ width: `${event.progress}%` }} /></span>
              <span className="co-active-events__open" aria-hidden="true">Open</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="co-active-events__empty">No active events yet. Start a plan when your next event takes shape.</p>
      )}
    </section>
  );
}
