import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://mkswoyxwwiwgzctjkhht.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3dveXh3d2l3Z3pjdGpraGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0ODA4MjksImV4cCI6MjA0NDA1NjgyOX0.do5krlAkkfD4iZZG4aQ1a9mVrkM9V09SJ7akkvlZEKw"
  )
}