import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "seeker" | "employer";

interface AuthState {
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ session: null, role: null, loading: true });

async function fetchRole(userId: string): Promise<AppRole | null> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
  return (data?.role as AppRole) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, role: null, loading: true });

  useEffect(() => {
    const apply = async (session: Session | null) => {
      const role = session ? await fetchRole(session.user.id) : null;
      setState({ session, role, loading: false });
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => void apply(session), 0);
    });
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
