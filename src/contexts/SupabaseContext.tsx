import React, { createContext, useContext, useState } from 'react';

interface SupabaseContextType {
  connected: boolean;
  supabase: any;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [connected] = useState(false); // Mocked for now
  const [supabase] = useState(null);

  return (
    <SupabaseContext.Provider value={{ connected, supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) throw new Error('useSupabase must be used within a SupabaseProvider');
  return context;
}
