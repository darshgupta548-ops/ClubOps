import { PremiumInput, PremiumTextarea } from './PremiumInput';
import { DateTimePicker } from './DateTimePicker';
import { PremiumSelectionGrid } from './PremiumSelectionCard';
import { PremiumBudget } from './PremiumBudget';
import { NotebookTextarea } from './NotebookTextarea';

const RESOURCES = ['Telescope', 'Projector', 'PA System', 'Banner'];
const COMPONENTS = ['ESP32', 'Arduino', 'Breadboard', 'Sensors', 'Servo Motors', 'Jumper Wires'];

const RESOURCE_ITEMS = RESOURCES.map((r) => ({ value: r, label: r }));
const COMPONENT_ITEMS = COMPONENTS.map((c) => ({ value: c, label: c }));

export function BasicInformationStep({ details, onChange, errors = {} }) {
  return (
    <div className="co-plan-event__form-grid">
      <div className="is-wide">
        <PremiumInput
          label="Event name"
          value={details.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g. Star Night 2026"
          error={errors.name}
          autoFocus
        />
      </div>
      <div className="is-wide">
        <PremiumTextarea
          label="A short description"
          value={details.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="What are you bringing to life?"
          rows={3}
        />
      </div>
      <PremiumInput
        label="Venue"
        value={details.venue}
        onChange={(e) => onChange('venue', e.target.value)}
        placeholder="Observatory lawn"
        error={errors.venue}
      />
      <PremiumInput
        label="Expected participants"
        type="number"
        min="1"
        value={details.participants}
        onChange={(e) => onChange('participants', e.target.value)}
        placeholder="60"
        error={errors.participants}
      />
      <div className="is-wide">
        <DateTimePicker
          label="Date & Time"
          value={{ date: details.date, startTime: details.startTime, endTime: details.endTime }}
          onChange={(value) => {
            onChange('date', value.date);
            onChange('startTime', value.startTime);
            onChange('endTime', value.endTime);
          }}
          dateError={errors.date}
          startError={errors.startTime}
          endError={errors.endTime}
        />
      </div>
    </div>
  );
}

export function ResourcesStep({ selections, onToggle, onAdd, error }) {
  const toggleResource = (value) => {
    onToggle('resources', value);
  };

  const toggleComponent = (value) => {
    onToggle('components', value);
  };

  return (
    <div className="co-plan-event__selection-card">
      <PremiumSelectionGrid
        title="Resources"
        items={RESOURCE_ITEMS}
        selectedItems={selections.resources}
        onToggle={toggleResource}
        onAddCustom={(value) => onAdd('resources', value)}
        error={error}
      />
      <PremiumSelectionGrid
        title="Components"
        items={COMPONENT_ITEMS}
        selectedItems={selections.components}
        onToggle={toggleComponent}
        onAddCustom={(value) => onAdd('components', value)}
        error={error}
      />
    </div>
  );
}

export function BudgetStep({ budget, onChange, error }) {
  return <PremiumBudget budget={budget} onChange={onChange} error={error} />;
}

export function PlanningNotesStep({ notes, onChange, errors = {} }) {
  return (
    <div className="co-plan-event__notes">
      <NotebookTextarea
        label="Objectives"
        value={notes.objectives}
        onChange={(e) => onChange('objectives', e.target.value)}
        placeholder="What should this event achieve?"
        minHeight={120}
        error={errors.objectives}
      />
      <NotebookTextarea
        label="Expected outcomes"
        value={notes.outcomes}
        onChange={(e) => onChange('outcomes', e.target.value)}
        placeholder="What will success look like?"
        minHeight={120}
      />
      <NotebookTextarea
        label="Internal notes"
        value={notes.internal}
        onChange={(e) => onChange('internal', e.target.value)}
        placeholder="Anything the team should remember."
        minHeight={100}
      />
      <NotebookTextarea
        label="Special requirements"
        value={notes.requirements}
        onChange={(e) => onChange('requirements', e.target.value)}
        placeholder="Permissions, accessibility, safety or other needs."
        minHeight={100}
      />
    </div>
  );
}

function ReviewCard({ title, children, subtle }) {
  return (
    <article className={`co-plan-event__review-card ${subtle ? 'is-subtle' : ''}`}>
      <h2>{title}</h2>
      <div>{children}</div>
    </article>
  );
}

export function ReviewStep({ details, selections, budget, notes }) {
  const total = Object.values(budget).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const selectedItems = [...selections.resources, ...selections.components];
  const timeDisplay = details.startTime && details.endTime ? `${details.startTime} – ${details.endTime}` : 'Time to be decided';

  const budgetEntries = Object.entries(budget).filter(([, amount]) => Number(amount) > 0);

  return (
    <div className="co-plan-event__review-grid">
      <ReviewCard title="Event brief">
        <p className="co-plan-event__brief-keyline">{details.description || 'Capture the event mission and the value this launch will unlock for your club.'}</p>
        <dl className="co-plan-event__brief-list">
          <div>
            <dt>What</dt>
            <dd>{details.name || 'Untitled event'}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{details.date ? details.date.split('-').reverse().join('/') : 'Date TBD'} · {timeDisplay}</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{details.venue || 'Venue TBD'}</dd>
          </div>
          <div>
            <dt>Attendance</dt>
            <dd>{details.participants ? `${details.participants} expected` : 'Estimate needed'}</dd>
          </div>
        </dl>
      </ReviewCard>
      <ReviewCard title="Resources & components" subtle>
        {selectedItems.length ? (
          <div className="co-plan-event__review-selected-items">
            {selectedItems.map((item) => (
              <span key={item} className="co-plan-event__review-pill">{item}</span>
            ))}
          </div>
        ) : (
          <p className="co-plan-event__review-empty">No resources selected yet.</p>
        )}
      </ReviewCard>
      <ReviewCard title="Estimated budget">
        <div className="co-plan-event__review-budget-top">
          <span className="co-plan-event__review-budget-label">Total estimate</span>
          <strong>₹{total.toLocaleString('en-IN')}</strong>
        </div>
        <div className="co-plan-event__review-budget-list">
          {budgetEntries.length ? (
            budgetEntries.map(([category, amount]) => (
              <div key={category} className="co-plan-event__review-budget-item">
                <span>{category}</span>
                <strong>₹{Number(amount).toLocaleString('en-IN')}</strong>
              </div>
            ))
          ) : (
            <p className="co-plan-event__review-empty">No budget entries added yet.</p>
          )}
        </div>
      </ReviewCard>
      <ReviewCard title="Planning notes" subtle>
        <div className="co-plan-event__review-notes-grid">
          <div>
            <h3>Objectives</h3>
            <p>{notes.objectives || 'Define the outcome you want the event to deliver.'}</p>
          </div>
          <div>
            <h3>Outcomes</h3>
            <p>{notes.outcomes || 'Describe what success should look like after the event.'}</p>
          </div>
          <div>
            <h3>Requirements</h3>
            <p>{notes.requirements || 'Add any permissions, safety needs, or venue constraints.'}</p>
          </div>
        </div>
      </ReviewCard>
    </div>
  );
}
