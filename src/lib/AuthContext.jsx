import React, { createContext, useContext } from 'react';
import { useAuth as useSupabaseAuth } from '@/hooks/useAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  try {
    const auth = useSupabaseAuth();
    return {
      user: auth.user,
      isAuthenticated: Boolean(auth.user),
      isLoadingAuth: auth.loading,
      isLoadingPublicSettings: false,
      authError: null,
      logout: auth.signOut,
      navigateToLogin: () => { window.location.href = '/login'; },
    };
  } catch {
    return {
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      logout: async () => {},
      navigateToLogin: () => { window.location.href = '/login'; },
    };
  }
}

export default AuthContext;
