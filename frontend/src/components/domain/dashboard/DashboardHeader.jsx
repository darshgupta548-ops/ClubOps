import { useEffect, useState } from 'react';

function formatDateTime(date) {
  return {
    date: new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(date),
    time: new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(date),
  };
}

export default function DashboardHeader({ user }) {
  const [now, setNow] = useState(() => new Date());
  const name = user?.name || 'Space Builder';
  const { date, time } = formatDateTime(now);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="co-workspace-header">
      <div>
        <p className="co-workspace-header__eyebrow">Good evening,</p>
        <h2>{name}</h2>
        <p className="co-workspace-header__time"><time dateTime={now.toISOString()}>{date}</time><span>·</span><time dateTime={now.toISOString()}>{time}</time></p>
      </div>
      <div className="co-workspace-header__actions">
        <button className="co-workspace-header__notification" type="button" aria-label="Notifications">
          <span aria-hidden="true">◌</span>
          <i aria-hidden="true" />
        </button>
        <button className="co-workspace-header__avatar" type="button" aria-label={`${name}'s profile`}>
          {name.slice(0, 1).toUpperCase()}
        </button>
      </div>
    </header>
  );
}
