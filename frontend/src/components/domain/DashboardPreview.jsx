import './DashboardPreview.css';

/**
 * Placeholder content for the workspace that sits behind the Landing blur.
 * Structure matches the approved v0 design reference (clubops-phi.vercel.app),
 * built here as real, semantic markup rather than inherited code — this is
 * still mock data until Roadmap #5/#6 wire it to GET /api/events etc.
 */

const TASKS = [
  { label: 'Confirm observatory booking for Star Night', meta: 'Due 2:00 PM', tag: 'Priority' },
  { label: 'Review budget request from Outreach team', meta: 'Due 4:30 PM' },
  { label: 'Send RSVP reminder to 42 members', meta: 'Due today' },
  { label: 'Approve volunteer shift schedule', meta: 'Done 11:10 AM', done: true },
];

const CONTINUE_WORKING = [
  { title: 'Star Night 2026 — Run of Show', meta: 'Event plan · edited 12m ago' },
  { title: 'Semester Impact Report', meta: 'Draft · edited 1h ago' },
  { title: 'Telescope Workshop Budget', meta: 'Spreadsheet · edited yesterday' },
];

const UPCOMING_EVENTS = [
  { day: '14', month: 'Feb', title: 'Star Night 2026', time: '7:30 PM', venue: 'Rooftop Observatory', attendees: 128 },
  { day: '21', month: 'Feb', title: 'Telescope Building Workshop', time: '4:00 PM', venue: 'Lab 204', attendees: 40 },
  { day: '02', month: 'Mar', title: 'Guest Lecture — Deep Field Imaging', time: '6:00 PM', venue: 'Auditorium A', attendees: 210 },
];

const PENDING_REPORTS = [
  { title: 'Post-Event Report — Nebula Nights', meta: 'Overdue by 1 day', status: 'overdue' },
  { title: 'Monthly Attendance Summary', meta: 'Due in 2 days', status: 'draft' },
  { title: 'Grant Utilization Report', meta: 'Due in 5 days', status: 'draft' },
];

const QUICK_ACTIONS = ['New Event', 'Draft Report', 'Invite Member', 'Announcement'];

export default function DashboardPreview() {
  const openTasks = TASKS.filter((t) => !t.done).length;

  return (
    <div className="co-preview">
      <div className="co-preview__topbar">
        <span className="co-preview__brand">ClubOps</span>
        <span className="co-preview__avatar">D</span>
      </div>

      <div className="co-preview__intro">
        <p className="co-preview__greeting">Good evening · Tuesday, Feb 10</p>
        <h2>What needs you right now</h2>
        <p className="co-preview__summary">
          {openTasks} tasks · {UPCOMING_EVENTS.length} events this week
        </p>
        <div className="co-preview__quickActions">
          {QUICK_ACTIONS.map((action) => (
            <span key={action}>{action}</span>
          ))}
        </div>
      </div>

      <div className="co-preview__grid">
        <div className="co-preview__card">
          <h3>Today's Tasks · {openTasks} remaining</h3>
          <ul>
            {TASKS.map((t) => (
              <li key={t.label} className={t.done ? 'is-done' : ''}>
                <span>{t.label}</span>
                <span className="co-preview__meta">
                  {t.meta}
                  {t.tag && <em>{t.tag}</em>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="co-preview__card">
          <h3>Continue Working</h3>
          <ul>
            {CONTINUE_WORKING.map((item) => (
              <li key={item.title}>
                <span>{item.title}</span>
                <span className="co-preview__meta">{item.meta}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="co-preview__card co-preview__card--wide">
          <h3>Upcoming Events</h3>
          <ul className="co-preview__events">
            {UPCOMING_EVENTS.map((e) => (
              <li key={e.title}>
                <span className="co-preview__dateBadge">
                  <em>{e.day}</em>
                  {e.month}
                </span>
                <span className="co-preview__eventInfo">
                  <strong>{e.title}</strong>
                  <span className="co-preview__meta">
                    {e.time} · {e.venue} · {e.attendees}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="co-preview__card">
          <h3>Pending Reports · {PENDING_REPORTS.length} open</h3>
          <ul>
            {PENDING_REPORTS.map((r) => (
              <li key={r.title}>
                <span>{r.title}</span>
                <span className={`co-preview__meta co-preview__meta--${r.status}`}>{r.meta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
