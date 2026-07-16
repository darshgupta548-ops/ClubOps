import { useState } from 'react';
import PlanningStepShell from '../../components/domain/planning/PlanningStepShell';
import { BasicInformationStep, BudgetStep, PlanningNotesStep, ResourcesStep, ReviewStep } from '../../components/domain/planning/PlanningSteps';
import PlanningSuccess from '../../components/domain/planning/PlanningSuccess';
import StarField from '../../theme/StarField';
import { useValidation, validationRules } from '../../components/domain/planning/useValidation';
import './PlanEvent.css';

const INITIAL_DETAILS = { name: '', description: '', venue: '', date: '', startTime: '', endTime: '', participants: '' };
const INITIAL_SELECTIONS = { resources: [], components: [] };
const INITIAL_BUDGET = { Electronics: '', Printing: '', Food: '', Publicity: '', Miscellaneous: '' };
const INITIAL_NOTES = { objectives: '', outcomes: '', internal: '', requirements: '' };

const RESOURCE_VALIDATION = (value, data) => {
  const hasResources = Array.isArray(value) && value.length > 0;
  const hasComponents = Array.isArray(data.components) && data.components.length > 0;
  return hasResources || hasComponents;
};

const BUDGET_VALIDATION = (value) => {
  return Object.values(value || {}).some((amount) => Number(amount) > 0);
};

export default function PlanEvent({ onReturnToDashboard }) {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [budget, setBudget] = useState(INITIAL_BUDGET);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [isComplete, setIsComplete] = useState(false);

  const { errors, validate, clearError, clearAllErrors } = useValidation();

  const hasValidBasics = Boolean(
    details.name.trim() &&
    details.venue.trim() &&
    details.date &&
    details.startTime &&
    details.endTime &&
    Number(details.participants) > 0 &&
    details.startTime < details.endTime
  );

  const hasSelectedResources = selections.resources.length + selections.components.length > 0;
  const hasBudgetEstimate = Object.values(budget).some((amount) => Number(amount) > 0);
  const hasObjectives = Boolean(notes.objectives.trim());

  const validateStep = () => {
    clearAllErrors();

    const stepValidation = {
      0: {
        name: [validationRules.required('Event name is required')],
        venue: [validationRules.required('Venue is required')],
        date: [validationRules.required('Date is required'), validationRules.futureDate('Date must be in the future')],
        startTime: [validationRules.required('Start time is required')],
        endTime: [
          validationRules.required('End time is required'),
          validationRules.custom((value, data) => !data.startTime || !value || value > data.startTime, 'End time must be after start time'),
        ],
        participants: [validationRules.required('Number of participants is required'), validationRules.min(1, 'At least 1 participant is required')],
      },
      1: {
        resources: [validationRules.custom(RESOURCE_VALIDATION, 'Select at least one resource or component')],
      },
      2: {
        budget: [validationRules.custom(BUDGET_VALIDATION, 'Add at least one budget estimate')],
      },
      3: {
        objectives: [validationRules.required('A planning objective helps your team stay aligned')],
      },
    };

    const schema = stepValidation[step];
    if (!schema) return true;

    const data = step === 0 ? details : step === 1 ? selections : step === 2 ? { budget } : notes;
    return validate(schema, data);
  };

  const updateDetails = (field, value) => {
    setDetails((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      clearError(field);
    }
  };

  const updateNotes = (field, value) => {
    setNotes((current) => ({ ...current, [field]: value }));
    if (field === 'objectives' && errors.objectives) {
      clearError('objectives');
    }
  };

  const toggleSelection = (type, value) => {
    setSelections((current) => ({
      ...current,
      [type]: current[type].includes(value) ? current[type].filter((item) => item !== value) : [...current[type], value],
    }));
    if (errors.resources) {
      clearError('resources');
    }
  };

  const addSelection = (type, value) => {
    setSelections((current) => ({
      ...current,
      [type]: current[type].includes(value) ? current[type] : [...current[type], value],
    }));
    if (errors.resources) {
      clearError('resources');
    }
  };

  const updateBudget = (newBudget) => {
    setBudget(newBudget);
    if (errors.budget) {
      clearError('budget');
    }
  };

  const next = () => {
    if (!validateStep()) return;

    if (step === 4) {
      setIsComplete(true);
      return;
    }

    setStep((current) => current + 1);
  };

  const back = () => {
    if (step === 0) {
      onReturnToDashboard();
      return;
    }
    setStep((current) => current - 1);
  };

  const stepCanContinue = [hasValidBasics, hasSelectedResources, hasBudgetEstimate, hasObjectives, true][step];

  const config = [
    {
      title: 'Begin with the shape of the event.',
      description: 'A few essentials give your team a shared starting point.',
      content: <BasicInformationStep details={details} onChange={updateDetails} errors={errors} />,
    },
    {
      title: 'Choose what brings it to life.',
      description: 'Collect the resources and components your team expects to need.',
      content: <ResourcesStep selections={selections} onToggle={toggleSelection} onAdd={addSelection} error={errors.resources} />,
    },
    {
      title: 'Give the plan an early estimate.',
      description: 'These are working numbers—not an allocation or university approval.',
      content: <BudgetStep budget={budget} onChange={updateBudget} error={errors.budget} />,
    },
    {
      title: 'Leave your team a clear brief.',
      description: 'A little context now makes the next decisions easier.',
      content: <PlanningNotesStep notes={notes} onChange={updateNotes} errors={errors} />,
    },
    {
      title: 'Review the plan before it begins.',
      description: 'You can refine every detail later in the Event Workspace.',
      content: <ReviewStep details={details} selections={selections} budget={budget} notes={notes} />,
      nextLabel: 'Create Event',
    },
  ][step];

  return (
    <main className="co-plan-event co-grain">
      <StarField />
      <div className="co-plan-event__surface">
        {isComplete ? (
          <PlanningSuccess eventName={details.name} onReturnToDashboard={onReturnToDashboard} />
        ) : (
          <PlanningStepShell
            step={step}
            title={config.title}
            description={config.description}
            onBack={back}
            onNext={next}
            nextLabel={config.nextLabel}
            canContinue={stepCanContinue}
          >
            {config.content}
          </PlanningStepShell>
        )}
      </div>
    </main>
  );
}
