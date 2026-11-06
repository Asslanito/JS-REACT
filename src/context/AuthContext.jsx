import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authService.initPersistence().catch(() => {});
    const unsubscribe = authService.subscribeToAuth(
      (u) => {
        setUser(u);
        setLoading(false);
      },
      (err) => {
        setError(authService.toAuthError(err));
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const value = useMemo(() => {
    const wrap = (fn) => async (...args) => {
      setError(null);
      try {
        return await fn(...args);
      } catch (err) {
        setError(err);
        throw err;
      }
    };
    return {
      user,
      loading,
      error,
      clearError: () => setError(null),
      signup: wrap(authService.signUp),
      login: wrap(authService.logIn),
      loginWithGoogle: wrap(authService.logInWithGoogle),
      logout: wrap(authService.logOut),
      resetPassword: wrap(authService.resetPassword),
    };
  }, [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
