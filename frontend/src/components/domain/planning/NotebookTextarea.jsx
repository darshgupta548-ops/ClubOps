import { useState, forwardRef } from 'react';

export const NotebookTextarea = forwardRef(({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  onFocus, 
  onBlur,
  error,
  minHeight = 120,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="co-notebook-textarea">
      {label && <label className="co-notebook-textarea__label">{label}</label>}
      <div className={`co-notebook-textarea__wrapper ${isFocused ? 'is-focused' : ''} ${error ? 'is-error' : ''}`}>
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={{ minHeight }}
          className="co-notebook-textarea__field"
          {...props}
        />
        <div className="co-notebook-textarea__lines" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="co-notebook-textarea__line" />
          ))}
        </div>
      </div>
      {error && <span className="co-notebook-textarea__error">{error}</span>}
    </div>
  );
});

NotebookTextarea.displayName = 'NotebookTextarea';
