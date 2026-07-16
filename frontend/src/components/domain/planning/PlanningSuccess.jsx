export default function PlanningSuccess({ eventName, onReturnToDashboard }) {
  return (
    <section className="co-plan-event__success" aria-labelledby="event-initialized-title">
      <div className="co-plan-event__success-mark">✓</div>
      <span>Event workspace initialized</span>
      <h1 id="event-initialized-title">{eventName || 'Your event'} is now ready for the next stage.</h1>
      <p>
        Your event concept is established and the foundation is set. The next step is to submit the university proposal and unlock the full Event Workspace.
      </p>
      <div className="co-plan-event__success-actions">
        <button type="button" className="co-plan-event__workspace-button" disabled>
          Open Event Workspace
          <small>Coming soon</small>
        </button>
        <button type="button" className="co-plan-event__back" onClick={onReturnToDashboard}>
          Return to dashboard
        </button>
      </div>
    </section>
  );
}
