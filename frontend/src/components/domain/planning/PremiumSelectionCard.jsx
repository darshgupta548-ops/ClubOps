import { useState } from 'react';

export const PremiumSelectionCard = ({ 
  icon, 
  title, 
  subtitle, 
  selected, 
  onClick, 
  disabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className={`co-premium-selection-card ${selected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''} ${disabled ? 'is-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="co-premium-selection-card__content">
        {icon && <span className="co-premium-selection-card__icon">{icon}</span>}
        <div className="co-premium-selection-card__text">
          <span className="co-premium-selection-card__title">{title}</span>
          {subtitle && <span className="co-premium-selection-card__subtitle">{subtitle}</span>}
        </div>
      </div>
      <div className="co-premium-selection-card__check">
        {selected && <span>✓</span>}
      </div>
    </button>
  );
};

export const PremiumSelectionGrid = ({
  title,
  items,
  selectedItems,
  onToggle,
  onAddCustom,
  customPlaceholder = 'Add custom...',
  error,
}) => {
  const [customValue, setCustomValue] = useState('');

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onAddCustom?.(customValue.trim());
      setCustomValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className="co-premium-selection-grid">
      <div className="co-premium-selection-grid__header">
        <div>
          <h3 className="co-premium-selection-grid__title">{title}</h3>
          <p className="co-premium-selection-grid__subtitle">Tap to add the material and technology your event needs.</p>
        </div>
        <span className="co-premium-selection-grid__count">{selectedItems.length} selected</span>
      </div>

      {selectedItems.length > 0 && (
        <div className="co-premium-selection-grid__selected-items">
          {selectedItems.map((item) => (
            <button key={item} type="button" className="co-premium-selection-grid__selected-pill" onClick={() => onToggle(item)}>
              {item}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="co-premium-selection-grid__items">
        {items.map((item) => (
          <PremiumSelectionCard
            key={item.value}
            title={item.label}
            subtitle={item.subtitle}
            icon={item.icon}
            selected={selectedItems.includes(item.value)}
            onClick={() => onToggle(item.value)}
          />
        ))}
      </div>

      {onAddCustom && (
        <div className="co-premium-selection-grid__custom">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={customPlaceholder}
            className="co-premium-selection-grid__custom-input"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customValue.trim()}
            className="co-premium-selection-grid__custom-add"
          >
            +
          </button>
        </div>
      )}

      {error && <span className="co-premium-selection-grid__error">{error}</span>}
    </div>
  );
};
