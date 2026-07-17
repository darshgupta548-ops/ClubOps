import { useState, useRef, useEffect, useCallback } from 'react';

export function TimePicker({ value, onChange, error, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value ? parseInt(value.split(':')[0]) : 12);
  const [minutes, setMinutes] = useState(value ? parseInt(value.split(':')[1]) : 0);
  const [period, setPeriod] = useState(value ? value.includes('PM') ? 'PM' : 'AM' : 'AM');
  const pickerRef = useRef(null);

  const formatTime = useCallback((h, m, p) => {
    const displayHour = p === 'AM' ? (h === 12 ? 12 : h) : (h === 12 ? 12 : h + 12);
    const hourStr = displayHour.toString().padStart(2, '0');
    const minStr = m.toString().padStart(2, '0');
    return `${hourStr}:${minStr}`;
  }, []);

  const handleTimeChange = useCallback((newHours, newMinutes, newPeriod) => {
    const timeStr = formatTime(newHours, newMinutes, newPeriod);
    onChange(timeStr);
  }, [onChange, formatTime]);

  const handleHourChange = (delta) => {
    let newHour = hours + delta;
    if (newHour > 12) newHour = 1;
    if (newHour < 1) newHour = 12;
    setHours(newHour);
    handleTimeChange(newHour, minutes, period);
  };

  const handleMinuteChange = (delta) => {
    let newMinute = minutes + delta;
    if (newMinute > 59) newMinute = 0;
    if (newMinute < 0) newMinute = 59;
    setMinutes(newMinute);
    handleTimeChange(hours, newMinute, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    handleTimeChange(hours, minutes, newPeriod);
  };

  const handleClickOutside = (e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayValue = value || 'Select time';

  return (
    <div className="co-time-picker">
      {label && <label className="co-time-picker__label">{label}</label>}
      <div className="co-time-picker__wrapper">
        <button
          type="button"
          className={`co-time-picker__trigger ${error ? 'is-error' : ''} ${isOpen ? 'is-open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="co-time-picker__value">{displayValue}</span>
          <span className="co-time-picker__arrow">▼</span>
        </button>
        {isOpen && (
          <div className="co-time-picker__popup" ref={pickerRef}>
            <div className="co-time-picker__content">
              <div className="co-time-picker__section">
                <span className="co-time-picker__section-label">Hour</span>
                <div className="co-time-picker__controls">
                  <button
                    type="button"
                    className="co-time-picker__control"
                    onClick={() => handleHourChange(1)}
                  >
                    ▲
                  </button>
                  <span className="co-time-picker__number">{hours.toString().padStart(2, '0')}</span>
                  <button
                    type="button"
                    className="co-time-picker__control"
                    onClick={() => handleHourChange(-1)}
                  >
                    ▼
                  </button>
                </div>
              </div>
              <div className="co-time-picker__section">
                <span className="co-time-picker__section-label">Minute</span>
                <div className="co-time-picker__controls">
                  <button
                    type="button"
                    className="co-time-picker__control"
                    onClick={() => handleMinuteChange(1)}
                  >
                    ▲
                  </button>
                  <span className="co-time-picker__number">{minutes.toString().padStart(2, '0')}</span>
                  <button
                    type="button"
                    className="co-time-picker__control"
                    onClick={() => handleMinuteChange(-1)}
                  >
                    ▼
                  </button>
                </div>
              </div>
              <div className="co-time-picker__section">
                <span className="co-time-picker__section-label">Period</span>
                <button
                  type="button"
                  className="co-time-picker__period-toggle"
                  onClick={togglePeriod}
                >
                  {period}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && <span className="co-time-picker__error">{error}</span>}
    </div>
  );
}
