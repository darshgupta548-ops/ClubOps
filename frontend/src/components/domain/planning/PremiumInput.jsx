import { useState, forwardRef } from 'react';

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
      <div className={`co-premium-input__wrapper ${isFocused ? 'is-focused' : ''} ${error ? 'is-error' : ''}`}>
        {icon && <span className="co-premium-input__icon">{icon}</span>}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={hasValue || isFocused ? '' : placeholder}
          className="co-premium-input__field"
          {...props}
        />
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
      <div className={`co-premium-input__wrapper co-premium-input__wrapper--textarea ${isFocused ? 'is-focused' : ''} ${error ? 'is-error' : ''}`}>
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={hasValue || isFocused ? '' : placeholder}
          rows={rows}
          className="co-premium-input__field"
          {...props}
        />
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

PremiumTextarea.displayName = 'PremiumTextarea';
