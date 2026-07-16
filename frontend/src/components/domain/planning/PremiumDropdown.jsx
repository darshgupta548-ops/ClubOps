import { useState, useRef, useEffect, forwardRef } from 'react';

export const PremiumDropdown = forwardRef(({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  searchable = false,
  error,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const filteredOptions = searchable 
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="co-premium-dropdown" ref={dropdownRef}>
      <div 
        className={`co-premium-dropdown__trigger ${isOpen ? 'is-open' : ''} ${error ? 'is-error' : ''}`}
        onClick={handleToggle}
        ref={ref}
        {...props}
      >
        <span className="co-premium-dropdown__value">{displayValue}</span>
        <span className="co-premium-dropdown__arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="co-premium-dropdown__menu">
          {searchable && (
            <div className="co-premium-dropdown__search">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="co-premium-dropdown__search-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          <div className="co-premium-dropdown__options">
            {filteredOptions.length === 0 ? (
              <div className="co-premium-dropdown__empty">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`co-premium-dropdown__option ${option.value === value ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                  {option.value === value && <span className="co-premium-dropdown__check">✓</span>}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      
      {error && <span className="co-premium-dropdown__error">{error}</span>}
    </div>
  );
});

PremiumDropdown.displayName = 'PremiumDropdown';
