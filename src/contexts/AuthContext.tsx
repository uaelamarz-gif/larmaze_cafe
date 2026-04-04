import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextValue = {
     session: Session | null;
     loading: boolean;
     error: string | null;
     isAuthenticated: boolean;
     login: (email: string, password: string) => Promise<boolean>;
     logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
     children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
     const [session, setSession] = useState<Session | null>(null);
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          let mounted = true;

          supabase.auth.getSession().then(({ data }) => {
               if (mounted) {
                    setSession(data.session ?? null);
                    setLoading(false);
               }
          });

          const { data: subscription } = supabase.auth.onAuthStateChange(
               (_event, nextSession) => {
                    setSession(nextSession ?? null);
                    setLoading(false);
               },
          );

          return () => {
               mounted = false;
               subscription.subscription.unsubscribe();
          };
     }, []);

     const login = async (
          email: string,
          password: string,
     ): Promise<boolean> => {
          setLoading(true);
          setError(null);

          const { data, error: signInError } =
               await supabase.auth.signInWithPassword({
                    email,
                    password,
               });

          if (signInError) {
               setError(signInError.message);
               setLoading(false);
               return false;
          }

          setSession(data.session ?? null);
          setLoading(false);
          return true;
     };

     const logout = async () => {
          setLoading(true);
          setError(null);
          const { error: signOutError } = await supabase.auth.signOut();

          if (signOutError) {
               setError(signOutError.message);
          }

          setSession(null);
          setLoading(false);
     };

     const value = useMemo(
          () => ({
               session,
               loading,
               error,
               isAuthenticated: Boolean(session),
               login,
               logout,
          }),
          [session, loading, error],
     );

     return (
          <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
     );
}

export function useAuth(): AuthContextValue {
     const ctx = useContext(AuthContext);
     if (!ctx) {
          throw new Error("useAuth must be used within AuthProvider");
     }

     return ctx;
}
