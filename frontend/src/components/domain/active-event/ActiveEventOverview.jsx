const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

export default function ActiveEventOverview({ event, attendance }) {
  const remaining = event.budget.allocated - event.budget.spent;
  const cards = [
    { label: 'Budget remaining', value: formatCurrency(remaining), detail: `${formatCurrency(event.budget.spent)} spent of ${formatCurrency(event.budget.allocated)}`, progress: (event.budget.spent / event.budget.allocated) * 100 },
    { label: 'Resources ready', value: `${event.resources.confirmed}/${event.resources.total}`, detail: `${event.resources.pending} awaiting confirmation`, progress: (event.resources.confirmed / event.resources.total) * 100 },
    { label: 'Attendance', value: `${attendance}/${event.attendance.expected}`, detail: attendance ? 'Checked in so far' : 'Expected participants', progress: (attendance / event.attendance.expected) * 100 },
    { label: 'Documentation', value: `${event.documentation.complete}/${event.documentation.total}`, detail: 'Operational records complete', progress: (event.documentation.complete / event.documentation.total) * 100 },
  ];

  return <section className="co-event-overview" aria-label="Event overview">{cards.map((card) => <article key={card.label} className="co-event-summary"><span>{card.label}</span><strong>{card.value}</strong><small>{card.detail}</small><i><b style={{ width: `${card.progress}%` }} /></i></article>)}</section>;
}
