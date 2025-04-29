import React, { useEffect, useState, createContext, useContext } from 'react';
import { AuthResponse } from '../services/auth';
interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  setAuth: (auth: AuthResponse | null) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setUser(auth.user);
      setToken(auth.token);
    }
  }, []);
  const setAuth = (auth: AuthResponse | null) => {
    if (auth) {
      setUser(auth.user);
      setToken(auth.token);
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth');
    }
  };
  const logout = () => {
    setAuth(null);
  };
  return <AuthContext.Provider value={{
    user,
    token,
    setAuth,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
};