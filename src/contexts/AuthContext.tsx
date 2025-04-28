import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface User {
  id: string;
  email: string;
  name: string;
  lp: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funzione per l'accesso
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      if (data.user) {
        // Recupera i dati aggiuntivi dell'utente
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: userData.name || '',
          lp: userData.lp || ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di autenticazione');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funzione per il logout
  const signOut = async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
      
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Controlla lo stato di autenticazione iniziale
    const checkUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;

        if (authUser) {
          // Recupera i dati aggiuntivi dell'utente
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (userError) throw userError;

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: userData.name || '',
            lp: userData.lp || ''
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore di autenticazione');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Sottoscrizione ai cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          setError(userError.message);
          return;
        }

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: userData.name || '',
          lp: userData.lp || ''
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};