"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { createClient } from "@/utils/supabase/client";

// Define a type for the user profile
interface UserProfile {
  id: string;
  name?: string;
  username?: string;
  height?: number;
  weight?: number;
  age?: number;
  bmi?: number;
  gender?: string;
}

// Define the context type
type UserContextType = {
  userInfo: UserProfile | null;
  setUserInfo: (user: UserProfile | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileError) {
        setUserInfo(profile as UserProfile); // Ensure the profile matches UserProfile
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [supabase]); // Include supabase in the dependency array

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {loading ? <p>Loading...</p> : children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
