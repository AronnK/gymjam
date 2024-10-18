import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    "https://mkswoyxwwiwgzctjkhht.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3dveXh3d2l3Z3pjdGpraGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0ODA4MjksImV4cCI6MjA0NDA1NjgyOX0.do5krlAkkfD4iZZG4aQ1a9mVrkM9V09SJ7akkvlZEKw",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
