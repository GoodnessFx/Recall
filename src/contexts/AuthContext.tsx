import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('recall_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, _password: string) => {
    const mockUser: User = { name: email.split('@')[0], email, isPremium: true };
    setUser(mockUser);
    localStorage.setItem('recall_user', JSON.stringify(mockUser));
  };

  const signUp = async (email: string, _password: string, name: string) => {
    const mockUser: User = { name, email, isPremium: true };
    setUser(mockUser);
    localStorage.setItem('recall_user', JSON.stringify(mockUser));
  };

  const signInWithGoogle = async () => {
    const mockUser: User = { name: 'Google User', email: 'google@user.com', isPremium: true };
    setUser(mockUser);
    localStorage.setItem('recall_user', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('recall_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
