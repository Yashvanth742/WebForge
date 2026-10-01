import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/api.js';

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Checks current session from server
  const checkSession = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Signs out user and clears cookies
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    api
      .get('/api/auth/me')
      .then(({ data }) => {
        if (isMounted) setUser(data.user);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoadingUser(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
        setUser,
        checkSession,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    return {
      user: null,
      loadingUser: false,
      setUser: () => {},
      checkSession: async () => null,
      logout: async () => {},
    };
  }
  return context;
}
