import { useMemo } from 'react';

const BUDGET_CATEGORIES = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Printing', label: 'Printing' },
  { value: 'Food', label: 'Food' },
  { value: 'Publicity', label: 'Publicity' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
];

const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const PremiumBudget = ({ budget, onChange, error }) => {
  const totalBudget = useMemo(
    () => Object.values(budget).reduce((sum, value) => sum + (parseFloat(value) || 0), 0),
    [budget],
  );

  const categoryTotals = useMemo(() => {
    return BUDGET_CATEGORIES.reduce((acc, category) => {
      acc[category.value] = parseFloat(budget[category.value]) || 0;
      return acc;
    }, {});
  }, [budget]);

  const categoryBreakdown = BUDGET_CATEGORIES.map((category) => {
    const amount = categoryTotals[category.value] || 0;
    const percentage = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
    return { ...category, amount, percentage };
  });

  const handleUpdateAmount = (category, amount) => {
    onChange?.({ ...budget, [category]: amount });
  };

  return (
    <div className="co-premium-budget">
      <div className="co-premium-budget__summary">
        <div className="co-premium-budget__summary-header">
          <div>
            <span className="co-premium-budget__summary-label">Estimated budget</span>
            <strong className="co-premium-budget__summary-total">{formatCurrency(totalBudget)}</strong>
          </div>
          <div className="co-premium-budget__summary-icon">₹</div>
        </div>
        <p className="co-premium-budget__summary-note">A first-pass estimate for the event concept. You can refine this later in the workspace.</p>
        <div className="co-premium-budget__breakdown">
          {categoryBreakdown.map((category) => (
            <div key={category.value} className="co-premium-budget__breakdown-item">
              <div className="co-premium-budget__breakdown-info">
                <span className="co-premium-budget__breakdown-name">{category.label}</span>
                <span className="co-premium-budget__breakdown-amount">{formatCurrency(category.amount)}</span>
              </div>
              <div className="co-premium-budget__breakdown-bar">
                <div
                  className="co-premium-budget__breakdown-fill"
                  style={{ width: `${category.amount > 0 ? Math.max(category.percentage, 6) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {error && <span className="co-premium-budget__error">{error}</span>}
      </div>

      <div className="co-premium-budget__items">
        <h3 className="co-premium-budget__items-title">Estimate by category</h3>
        <div className="co-premium-budget__items-list">
          {BUDGET_CATEGORIES.map((category) => (
            <div key={category.value} className="co-premium-budget__item">
              <div className="co-premium-budget__item-content">
                <span className="co-premium-budget__item-category">{category.label}</span>
                <small className="co-premium-budget__item-description">Plan the key cost for this area.</small>
              </div>
              <div className="co-premium-budget__item-actions">
                <div className="co-premium-budget__item-amount-input">
                  <span className="co-premium-budget__item-currency">₹</span>
                  <input
                    type="number"
                    value={budget[category.value] || ''}
                    onChange={(e) => handleUpdateAmount(category.value, e.target.value)}
                    placeholder="0"
                    min="0"
                    className="co-premium-budget__item-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
