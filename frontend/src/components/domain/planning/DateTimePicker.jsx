import { useState, forwardRef } from 'react';

const formatDisplayDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB');
};

const parseDisplayDate = (value) => {
  const trimmed = value.trim();
  const match = /^([0-3]\d)\/([0-1]\d)\/(\d{4})$/u.exec(trimmed);
  if (!match) return null;
  const [, day, month, year] = match;
  const normalized = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};

export const DateTimePicker = forwardRef(({ label, value = {}, onChange, dateError, startError, endError, use24Hour = true, ...props }, ref) => {
  const [displayDate, setDisplayDate] = useState(formatDisplayDate(value.date));
  const [startTime, setStartTime] = useState(value.startTime || '');
  const [endTime, setEndTime] = useState(value.endTime || '');

  const handleDateChange = (e) => {
    const newDisplay = e.target.value;
    setDisplayDate(newDisplay);

    if (!newDisplay) {
      onChange?.({ date: '', startTime, endTime });
      return;
    }

    const parsed = parseDisplayDate(newDisplay);
    onChange?.({ date: parsed || '', startTime, endTime });
  };

  const handleStartTimeChange = (e) => {
    const nextStart = e.target.value;
    setStartTime(nextStart);
    onChange?.({ date: value.date, startTime: nextStart, endTime });
  };

  const handleEndTimeChange = (e) => {
    const nextEnd = e.target.value;
    setEndTime(nextEnd);
    onChange?.({ date: value.date, startTime, endTime: nextEnd });
  };

  const isTimeError = startTime && endTime && startTime >= endTime;

  return (
    <div className="co-date-time-picker">
      {label && <label className="co-date-time-picker__label">{label}</label>}
      <div className="co-date-time-picker__grid">
        <div className="co-date-time-picker__field">
          <label className="co-date-time-picker__field-label">Date</label>
          <input
            ref={ref}
            type="text"
            value={displayDate}
            onChange={handleDateChange}
            placeholder="DD/MM/YYYY"
            className={`co-date-time-picker__input ${dateError ? 'is-error' : ''}`}
            {...props}
          />
          <span className="co-date-time-picker__hint">Future dates only</span>
        </div>
        <div className="co-date-time-picker__field">
          <label className="co-date-time-picker__field-label">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            className={`co-date-time-picker__input ${startError ? 'is-error' : ''}`}
            step={use24Hour ? '60' : '300'}
          />
        </div>
        <div className="co-date-time-picker__field">
          <label className="co-date-time-picker__field-label">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            className={`co-date-time-picker__input ${endError || isTimeError ? 'is-error' : ''}`}
            step={use24Hour ? '60' : '300'}
          />
        </div>
      </div>
      {dateError && <span className="co-date-time-picker__error">{dateError}</span>}
      {(startError || endError || isTimeError) && (
        <span className="co-date-time-picker__error">{startError || endError || (isTimeError && 'End time must be after start time')}</span>
      )}
    </div>
  );
});

DateTimePicker.displayName = 'DateTimePicker';
