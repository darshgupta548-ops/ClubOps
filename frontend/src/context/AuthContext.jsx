import { createContext, useContext, useState } from 'react';

/**
 * Stub only. Real auth (Flask-Login session, RequireAuth route guard)
 * is deferred per Roadmap #8 — this exists so components can already
 * be written against the final shape (`user`, `login`, `logout`) and
 * won't need rework when auth is wired in.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = guest

  const login = async (_credentials) => {
    // TODO: POST to /api/auth/login once the backend route exists.
    throw new Error('Auth is not implemented yet.');
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
