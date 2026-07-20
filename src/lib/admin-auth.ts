import * as React from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminSessionState {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
}

async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return !!data;
}

export function useAdminSession(): AdminSessionState {
  const [state, setState] = React.useState<AdminSessionState>({ loading: true, session: null, isAdmin: false });

  React.useEffect(() => {
    let active = true;

    async function resolve(session: Session | null) {
      if (!session) {
        if (active) setState({ loading: false, session: null, isAdmin: false });
        return;
      }
      const isAdmin = await checkIsAdmin(session.user.id);
      if (active) setState({ loading: false, session, isAdmin });
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({ ...s, loading: true }));
      resolve(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const isAdmin = await checkIsAdmin(data.user.id);
  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error("Essa conta não tem acesso à área administrativa.");
  }
  return data;
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}
