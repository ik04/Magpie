"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes:
          "openid email profile https://www.googleapis.com/auth/gmail.send",
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      {!user ? (
        <>
          <h1 className="text-2xl font-bold">Login</h1>
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl">Welcome {user.email}</h1>
          <pre className="bg-gray-100 p-2 rounded text-sm w-[400px] overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </>
      )}
    </main>
  );
}
