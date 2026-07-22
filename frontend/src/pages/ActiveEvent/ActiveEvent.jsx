import { useState } from 'react';
import ActiveEventHeader from '../../components/domain/active-event/ActiveEventHeader';
import ActiveEventOverview from '../../components/domain/active-event/ActiveEventOverview';
import ActiveEventModules from '../../components/domain/active-event/ActiveEventModules';
import StarField from '../../theme/StarField';
import './ActiveEvent.css';

export default function ActiveEvent({ event, onReturnToDashboard }) {
  const [attendance, setAttendance] = useState(event.attendance.current);

  return (
    <main className="co-active-event co-grain">
      <StarField />
      <div className="co-active-event__surface">
        <ActiveEventHeader event={event} onReturn={onReturnToDashboard} />
        <ActiveEventOverview event={event} attendance={attendance} />
        <ActiveEventModules event={event} attendance={attendance} onAttendanceChange={setAttendance} />
      </div>
    </main>
  );
}
