
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://mkswoyxwwiwgzctjkhht.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3dveXh3d2l3Z3pjdGpraGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0ODA4MjksImV4cCI6MjA0NDA1NjgyOX0.do5krlAkkfD4iZZG4aQ1a9mVrkM9V09SJ7akkvlZEKw"
export const supabase = createClient(supabaseUrl, supabaseKey)
