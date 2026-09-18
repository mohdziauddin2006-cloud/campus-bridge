import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({ user: null, profile: null, role: null, loading: true, signOut: () => Promise.resolve(), refreshProfile: () => Promise.resolve() });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    if (!user) { setProfile(null); setRole(null); return; }
    const { data } = await supabase.from('profiles').select('full_name, role, branch, skills').eq('id', user.id).single();
    if (data) { setProfile(data); setRole(data.role); }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) refreshProfile(); else { setProfile(null); setRole(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function signOut() { await supabase.auth.signOut(); setUser(null); setProfile(null); setRole(null); }
  return <AuthContext.Provider value={{ user, profile, role, loading, signOut, refreshProfile }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
