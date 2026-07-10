import { createContext, useContext, useState } from 'react';

/**
 * Stub only. Real auth (Flask-Login session, RequireAuth route guard)
 * is deferred per Roadmap #8 — this exists so components can already
 * be written against the final shape (`user`, `login`, `logout`) and
 * won't need rework when auth is wired in.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ email }) => {
    // TODO: Replace with POST /api/auth/login once Flask-Login is available.
    const localPart = email.split('@')[0] || 'Space Builder';
    setUser({ id: 'mock-user', name: toDisplayName(localPart), email });
  };

  const register = async ({ name, email }) => {
    // TODO: Replace with the approved member-invite/onboarding workflow.
    setUser({ id: 'mock-user', name: name || 'Space Builder', email });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function toDisplayName(value) {
  return value
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
