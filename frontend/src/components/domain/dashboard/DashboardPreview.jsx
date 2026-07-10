import './DashboardPreview.css';

export default function DashboardPreview({ data, user }) {
  const openTasks = data.tasks.filter((task) => !task.done).length;
  const userInitial = user?.name?.[0]?.toUpperCase() || 'D';

  return (
    <div className="co-dashboard-preview">
      <DashboardHeader clubName={data.clubName} userInitial={userInitial} />
      <main className="co-dashboard-preview__content">
        <section className="co-dashboard-preview__intro">
          <p>Good evening · Tuesday, Feb 10</p>
          <h2>{data.greeting}</h2>
          <span>{openTasks} tasks · {data.upcomingEvents.length} events this week</span>
        </section>
        <QuickActions actions={data.quickActions} />
        <div className="co-dashboard-preview__grid">
          <DashboardCard title={`Today's Tasks · ${openTasks} remaining`} items={data.tasks} renderItem={(item) => <TaskItem task={item} />} />
          <DashboardCard title="Continue Working" items={data.continueWorking} renderItem={(item) => <MetaItem item={item} />} />
          <DashboardCard className="co-dashboard-preview__card--wide" title="Upcoming Events" items={data.upcomingEvents} renderItem={(item) => <EventItem event={item} />} />
          <DashboardCard title={`Pending Reports · ${data.pendingReports.length} open`} items={data.pendingReports} renderItem={(item) => <ReportItem report={item} />} />
        </div>
      </main>
    </div>
  );
}

function DashboardHeader({ clubName, userInitial }) {
  return <header className="co-dashboard-preview__header"><span>ClubOps</span><nav aria-label="Workspace"><span className="is-current">Overview</span><span>Events</span><span>Members</span><span>Reports</span></nav><span className="co-dashboard-preview__avatar" aria-label="Current user">{userInitial}</span><small>{clubName}</small></header>;
}

function QuickActions({ actions }) {
  return <div className="co-dashboard-preview__quick-actions">{actions.map((action) => <button key={action} type="button">{action}</button>)}</div>;
}

function DashboardCard({ title, items, renderItem, className = '' }) {
  return <section className={`co-dashboard-preview__card ${className}`}><h3>{title}</h3><ul>{items.map((item) => <li key={item.id || item.title}>{renderItem(item)}</li>)}</ul></section>;
}

function TaskItem({ task }) {
  return <><span className={task.done ? 'is-done' : ''}>{task.label}</span><span className="co-dashboard-preview__meta">{task.meta}{task.priority && <em>Priority</em>}</span></>;
}

function MetaItem({ item }) { return <><span>{item.title}</span><span className="co-dashboard-preview__meta">{item.meta}</span></>; }

function EventItem({ event }) {
  return <><span className="co-dashboard-preview__date-badge"><em>{event.day}</em>{event.month}</span><span className="co-dashboard-preview__event-info"><strong>{event.title}</strong><span className="co-dashboard-preview__meta">{event.time} · {event.venue} · {event.attendees}</span></span></>;
}

function ReportItem({ report }) { return <><span>{report.title}</span><span className={`co-dashboard-preview__meta co-dashboard-preview__meta--${report.status}`}>{report.meta}</span></>; }
