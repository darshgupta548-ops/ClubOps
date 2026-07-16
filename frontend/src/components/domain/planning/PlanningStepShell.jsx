const STEP_LABELS = ['Basics', 'Resources', 'Budget', 'Notes', 'Review'];

export default function PlanningStepShell({ step, title, description, children, onBack, onNext, nextLabel = 'Continue', canContinue = true }) {
  return (
    <section className="co-plan-event__shell" aria-labelledby="plan-event-title">
      <header className="co-plan-event__progress">
        <div>
          <span className="co-plan-event__kicker">Event initialization</span>
          <p className="co-plan-event__subtext">Build the foundation of your Event Workspace with a clear, guided brief.</p>
        </div>
        <span className="co-plan-event__counter">Step {step + 1} of 5</span>
      </header>
      <ol className="co-plan-event__steps" aria-label="Event planning steps">
        {STEP_LABELS.map((label, index) => (
          <li key={label} className={index === step ? 'is-current' : index < step ? 'is-complete' : ''}>
            <span className="co-plan-event__step-badge">{index + 1}</span>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>
      <div className="co-plan-event__heading">
        <h1 id="plan-event-title">{title}</h1>
        <p>{description}</p>
      </div>
      <div className="co-plan-event__body">{children}</div>
      <footer className="co-plan-event__footer">
        <button type="button" className="co-plan-event__back" onClick={onBack}>{step === 0 ? 'Return to dashboard' : 'Back'}</button>
        <button type="button" className="co-plan-event__continue" onClick={onNext} disabled={!canContinue}>{nextLabel}<span aria-hidden="true">→</span></button>
      </footer>
    </section>
  );
}
