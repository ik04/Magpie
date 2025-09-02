"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth error:", error);
        return;
      }

      if (data?.session) {
        const token = data.session.access_token;

        document.cookie = `sb-access-token=${token}; path=/; max-age=3600; SameSite=Lax`;

        router.push("/dashboard");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <main className="flex items-center justify-center h-screen">
      <p>Completing sign-in…</p>
    </main>
  );
}
