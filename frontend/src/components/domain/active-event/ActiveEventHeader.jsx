export default function ActiveEventHeader({ event, onReturn }) {
  return (
    <header className="co-event-header">
      <button type="button" className="co-event-header__back" onClick={onReturn}>← All events</button>
      <div className="co-event-header__body">
        <div>
          <p className="co-event-header__eyebrow">Event operations</p>
          <div className="co-event-header__title-row"><h1>{event.name}</h1><span className={`co-event-header__status co-event-header__status--${event.status}`}>{event.statusLabel}</span></div>
          <p className="co-event-header__meta"><span>{event.dateTime}</span><span>{event.venue}</span></p>
        </div>
        <div className="co-event-header__actions"><button type="button" className="co-event-header__action">Add update</button><button type="button" className="co-event-header__action is-primary">Open run sheet</button></div>
      </div>
      <div className="co-event-header__progress"><div><span>Operational progress</span><strong>{event.progress}%</strong></div><i><b style={{ width: `${event.progress}%` }} /></i><small>{event.phase}</small></div>
    </header>
  );
}
