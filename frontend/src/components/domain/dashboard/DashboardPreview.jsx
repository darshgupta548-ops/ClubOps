import DashboardCard from './DashboardCard';
import DashboardHeader from './DashboardHeader';
import DashboardTimeline from './DashboardTimeline';
import DashboardActiveEvents from './DashboardActiveEvents';
import './DashboardPreview.css';

/**
 * Presentation-only workspace launcher. Data is supplied by its caller so a
 * future DashboardContainer can replace mock data with the Flask API without
 * changing the layout components.
 */
export default function DashboardPreview({ data, user, onPlanEvent, onOpenEvent }) {
  return (
    <main className="co-workspace" aria-label="ClubOps workspace">
      <DashboardHeader user={user} />
      <section className="co-workspace__intro" aria-labelledby="workspace-title">
        <p>Workspace</p>
        <h1 id="workspace-title">Everything for your next event.</h1>
      </section>

      <DashboardTimeline event={data.timelineEvent} />

      <DashboardActiveEvents events={data.activeEvents} onOpenEvent={onOpenEvent} />

      <section className="co-workspace__launcher" aria-label="Event workspace modules">
        {data.modules.map((module) => (
          <DashboardCard
            key={module.id}
            module={module}
            onOpen={module.id === 'plan' ? onPlanEvent : module.id === 'active' ? () => onOpenEvent?.(data.activeEvents[0]?.id) : undefined}
          />
        ))}
      </section>
    </main>
  );
}
