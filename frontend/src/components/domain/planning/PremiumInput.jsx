import { useId, useState, forwardRef } from 'react';

const hasFieldValue = (value) => value !== undefined && value !== null && String(value).length > 0;

export const PremiumInput = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onFocus, 
  onBlur,
  error,
  icon,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const hasValue = hasFieldValue(value);

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

  return (
    <div className="co-premium-input">
      {label && <label htmlFor={inputId} className="co-premium-input__label">{label}</label>}
      <div className={`co-premium-input__wrapper ${icon ? 'has-icon' : ''} ${isFocused ? 'is-focused' : ''} ${error ? 'is-error' : ''}`}>
        {icon && <span className="co-premium-input__icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="co-premium-input__field"
          {...props}
        />
      </div>
      {error && <span className="co-premium-input__error">{error}</span>}
    </div>
  );
});

PremiumInput.displayName = 'PremiumInput';

export const PremiumTextarea = forwardRef(({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  onFocus, 
  onBlur,
  error,
  rows = 4,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const hasValue = hasFieldValue(value);

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

  return (
    <div className="co-premium-input">
      {label && <label htmlFor={inputId} className="co-premium-input__label">{label}</label>}
      <div className={`co-premium-input__wrapper co-premium-input__wrapper--textarea ${isFocused ? 'is-focused' : ''} ${error ? 'is-error' : ''}`}>
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          className="co-premium-input__field"
          {...props}
        />
      </div>
      {error && <span className="co-premium-input__error">{error}</span>}
    </div>
  );
});

PremiumTextarea.displayName = 'PremiumTextarea';
