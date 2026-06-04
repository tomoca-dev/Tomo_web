// src/hooks/useAuth.tsx
import React, { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Fallback query to user_roles table. Returns true only when the row's role === 'admin'. */
async function queryIsAdminFallback(userId: string): Promise<boolean> {
  try {
    const res = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    // Supabase .maybeSingle() returns { data, error }
    if (res.error) {
      console.warn("user_roles query error:", res.error);
      throw res.error;
    }

    // data may be null or { role: 'admin' }
    const role = (res.data as any)?.role;
    return String(role).toLowerCase() === "admin";
  } catch (err) {
    console.error("queryIsAdminFallback unexpected error:", err);
    throw err;
  }
}

/** Central admin detection, prefer metadata then fallback to table. */
async function setAdminFromSession(s: Session | null, setIsAdmin: (v: boolean) => void) {
  try {
    if (!s?.user) {
      setIsAdmin(false);
      return;
    }

    const userId = s.user.id;
    const metaRole = (s.user.user_metadata as any)?.role;
    if (metaRole && String(metaRole).toLowerCase() === "admin") {
      setIsAdmin(true);
      localStorage.setItem(`tomo_is_admin_${userId}`, "true");
      return;
    }

    // fallback to table query
    const fallback = await queryIsAdminFallback(userId);
    setIsAdmin(fallback);
    localStorage.setItem(`tomo_is_admin_${userId}`, String(fallback));
  } catch (err) {
    console.error("setAdminFromSession error:", err);
    // If the database query fails, fall back to the localStorage cached value if available
    if (s?.user) {
      const cached = localStorage.getItem(`tomo_is_admin_${s.user.id}`) === "true";
      if (cached) {
        console.info("Preserving cached admin status due to query failure");
        setIsAdmin(true);
        return;
      }
    }
    setIsAdmin(false);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        console.debug("[auth] init: fetching session...");
        const res = await supabase.auth.getSession();
        const s = res.data?.session ?? null;

        if (!mounted) return;

        console.debug("[auth] init session:", s);
        setSession(s);
        const currentUser = s?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Eagerly initialize from cache to prevent UI flash / redirects
          const cached = localStorage.getItem(`tomo_is_admin_${currentUser.id}`) === "true";
          setIsAdmin(cached);
        }

        await setAdminFromSession(s, (v) => { if (mounted) setIsAdmin(v); });
      } catch (err) {
        console.error("[auth] init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    // Subscribe to auth changes. Return value shape may vary between sdk versions,
    // so capture the returned object and dig for subscription safely.
    const returned = supabase.auth.onAuthStateChange(async (event, s) => {
      if (!mounted) return;

      console.debug("[auth] onAuthStateChange event:", event, s);
      const currentUser = s?.user ?? null;
      setSession(s ?? null);
      setUser(currentUser);

      if (event === "SIGNED_OUT") {
        setIsAdmin(false);
        // Clear all admin caches
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("tomo_is_admin_")) {
            localStorage.removeItem(key);
            i--; // adjust index since we removed an item
          }
        }
      } else if (currentUser) {
        // Eagerly initialize from cache
        const cached = localStorage.getItem(`tomo_is_admin_${currentUser.id}`) === "true";
        setIsAdmin(cached);

        await setAdminFromSession(s ?? null, (v) => { if (mounted) setIsAdmin(v); });
      } else {
        setIsAdmin(false);
      }

      if (mounted) setLoading(false);
    });

    // extract subscription defensively
    const subscription =
      (returned as any)?.data?.subscription ?? (returned as any)?.subscription ?? null;

    return () => {
      mounted = false;
      try {
        subscription?.unsubscribe?.();
      } catch (err) {
        // swallow - defensive
        console.warn("[auth] error unsubscribing auth listener:", err);
      }
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: displayName },
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: any) {
      console.error("[auth] signUp unexpected error:", err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null };
    } catch (err: any) {
      console.error("[auth] signIn unexpected error:", err);
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signOut = async () => {
    try {
      console.debug("[auth] signOut: calling supabase.auth.signOut()");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("[auth] signOut returned error:", error);
      }
    } catch (err) {
      console.error("[auth] signOut unexpected error:", err);
    } finally {
      // update local UI state immediately
      setUser(null);
      setSession(null);
      setIsAdmin(false);

      // Clean up cache
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("tomo_is_admin_")) {
          localStorage.removeItem(key);
          i--; // adjust index since we removed an item
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}