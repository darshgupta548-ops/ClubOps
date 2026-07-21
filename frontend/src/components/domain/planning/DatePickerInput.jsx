import { useId, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export const DatePickerInput = forwardRef(({ 
  label, 
  value, 
  onChange, 
  onFocus, 
  onBlur,
  error,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const inputRef = useRef(null);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  useImperativeHandle(ref, () => inputRef.current);

  const handleChange = (e) => {
    onChange?.(e);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    input.focus({ preventScroll: true });
    try {
      input.showPicker?.();
    } catch {
      // Browsers without showPicker retain their native focus and keyboard flow.
    }
  };

  return (
    <div className="co-premium-input">
      {label && <label htmlFor={inputId} className="co-premium-input__label">{label}</label>}
      <div
        className={`co-premium-input__wrapper co-premium-input__wrapper--date ${isFocused ? 'is-focused' : ''} ${error ? 'is-error' : ''}`}
        onClick={openPicker}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="date"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="co-premium-input__field co-premium-input__field--date"
          {...props}
        />
        <button
          type="button"
          className="co-premium-input__date-button"
          onClick={(event) => {
            event.stopPropagation();
            openPicker();
          }}
          aria-label="Open date picker"
        >
          <svg className="co-premium-input__date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </button>
      </div>
      {error && <span className="co-premium-input__error">{error}</span>}
    </div>
  );
});

DatePickerInput.displayName = 'DatePickerInput';



