import { useState, forwardRef } from 'react';

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
  const [hasValue, setHasValue] = useState(Boolean(value));

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
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

  return (
    <div className="co-premium-input">
      <div className={`co-premium-input__wrapper co-premium-input__wrapper--date ${isFocused ? 'is-focused' : ''} ${error ? 'is-error' : ''}`}>
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="co-premium-input__field co-premium-input__field--date"
          {...props}
        />
        <svg className="co-premium-input__date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        {label && (
          <label className={`co-premium-input__label ${hasValue || isFocused ? 'is-floating' : ''}`}>
            {label}
          </label>
        )}
      </div>
      {error && <span className="co-premium-input__error">{error}</span>}
    </div>
  );
});

DatePickerInput.displayName = 'DatePickerInput';
