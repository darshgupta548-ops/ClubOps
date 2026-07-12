export default function DashboardTimeline({ event }) {
  if (!event) {
    return (
      <section className="co-timeline co-timeline--empty">
        <div>
          <p className="co-timeline__label">Your timeline</p>
          <h2>Start with an event.</h2>
          <p>Create your first event and ClubOps will shape the workspace around it.</p>
        </div>
        <button type="button">Plan an event</button>
      </section>
    );
  }

  return (
    <section className="co-timeline" aria-labelledby="timeline-title">
      <div className="co-timeline__heading">
        <div>
          <p className="co-timeline__label">Event timeline</p>
          <h2 id="timeline-title">{event.title}</h2>
          <p>{event.date} · {event.venue}</p>
        </div>
        <span className={`co-timeline__status co-timeline__status--${event.status}`}>{event.statusLabel}</span>
      </div>
      <ol className="co-timeline__steps">
        {event.steps.map((step, index) => (
          <li key={step.label} className={step.state}>
            <span className="co-timeline__marker">{index + 1}</span>
            <div><strong>{step.label}</strong><small>{step.detail}</small></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
