const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

function Module({ title, eyebrow, children, className = '' }) {
  return <section className={`co-event-module ${className}`}><header><p>{eyebrow}</p><h2>{title}</h2></header>{children}</section>;
}

export default function ActiveEventModules({ event, attendance, onAttendanceChange }) {
  const remaining = event.budget.allocated - event.budget.spent;
  return (
    <section className="co-event-modules" aria-label="Operational modules">
      <Module title="Timeline" eyebrow="Run of show" className="co-event-module--timeline"><ol className="co-event-timeline">{event.timeline.map((item) => <li key={`${item.time}-${item.title}`} className={item.state}><time>{item.time}</time><span /><div><strong>{item.title}</strong><small>{item.detail}</small></div></li>)}</ol></Module>
      <Module title="Budget" eyebrow="Finance"><div className="co-event-budget-total"><span>Remaining</span><strong>{formatCurrency(remaining)}</strong><small>of {formatCurrency(event.budget.allocated)} working budget</small></div><ul className="co-event-list">{event.budgetItems.map((item) => <li key={item.label}><span>{item.label}</span><strong>{formatCurrency(item.value)}</strong></li>)}</ul></Module>
      <Module title="Resources" eyebrow="Readiness"><ul className="co-event-list co-event-list--status">{event.resourcesList.map((item) => <li key={item.name}><span><i className={item.state === 'Ready' ? 'is-ready' : 'is-pending'} />{item.name}</span><strong>{item.state}</strong></li>)}</ul><p className="co-event-module__footnote">{event.resources.confirmed} confirmed · {event.resources.pending} pending</p></Module>
      <Module title="Documentation" eyebrow="Records"><ul className="co-event-list co-event-list--status">{event.documents.map((item) => <li key={item.name}><span><i className={item.state === 'Ready' ? 'is-ready' : 'is-pending'} />{item.name}</span><strong>{item.state}</strong></li>)}</ul><p className="co-event-module__footnote">{event.documentation.complete} of {event.documentation.total} records complete</p></Module>
      <Module title="Attendance" eyebrow="Live count" className="co-event-module--attendance"><div className="co-event-attendance"><div><span>Checked in</span><strong>{attendance}</strong><small>Expected: {event.attendance.expected}</small></div><div className="co-event-attendance__actions"><button type="button" onClick={() => onAttendanceChange(Math.max(0, attendance - 1))} aria-label="Decrease attendance">−</button><button type="button" onClick={() => onAttendanceChange(attendance + 1)} aria-label="Increase attendance">+</button></div></div><i className="co-event-attendance__bar"><b style={{ width: `${Math.min(100, (attendance / event.attendance.expected) * 100)}%` }} /></i></Module>
    </section>
  );
}
