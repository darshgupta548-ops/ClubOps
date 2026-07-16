import { useState, useCallback } from 'react';

export const useValidation = (initialState = {}) => {
  const [errors, setErrors] = useState(initialState);

  const validate = useCallback((validationRules, data) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field];
      const value = data[field];
      
      for (const rule of rules) {
        const error = rule(value, data);
        if (error) {
          newErrors[field] = error;
          break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
    setError,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export const validationRules = {
  required: (message = 'This field is required') => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return null;
  },

  pattern: (regex, message) => (value) => {
    if (value && !regex.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  min: (min, message) => (value) => {
    const num = Number(value);
    if (value && (!isNaN(num) && num < min)) {
      return message || `Must be at least ${min}`;
    }
    return null;
  },

  max: (max, message) => (value) => {
    const num = Number(value);
    if (value && (!isNaN(num) && num > max)) {
      return message || `Must be no more than ${max}`;
    }
    return null;
  },

  futureDate: (message = 'Date must be in the future') => (value) => {
    if (!value) return null;
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return message;
    }
    return null;
  },

  email: (message = 'Invalid email address') => (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message;
    }
    return null;
  },

  custom: (fn, message) => (value, data) => {
    const result = fn(value, data);
    if (result === false) {
      return message || 'Validation failed';
    }
    return null;
  },
};
