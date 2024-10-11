"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";
import SignInForm from "../signinform/page";

export default function Dashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth/signin");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setLoading(false);
        return;
      }

      setUserInfo(profile);

      const isNewUserCheck =
        new Date().getTime() - new Date(user.created_at).getTime() <
        3 * 60 * 1000; //
      const isProfileIncomplete =
        !profile.username ||
        !profile.height ||
        !profile.weight ||
        !profile.age ||
        !profile.gender;

      setIsNewUser(isNewUserCheck || isProfileIncomplete);
      setLoading(false);
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (isNewUser) {
    return <SignInForm />;
  }

  return (
    <div className="flex pl-10 pt-10 min-h-screen">
      <Card className="w-[400px] h-2/3">
        <CardHeader>
          <CardTitle>User Dashboard</CardTitle>
          <CardDescription>Hi {userInfo?.name}!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Name</Label>
              <p className="border border-black rounded-lg p-2 ">
                {userInfo?.name}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Username</Label>
              <p className="border border-black rounded-lg p-2 ">
                {userInfo?.username}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Height</Label>
              <p className="border border-black rounded-lg p-2 ">
                {userInfo?.height} cm
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Weight</Label>
              <p className="border border-black rounded-lg p-2 ">
                {userInfo?.weight} kg
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Age</Label>
              <p className="border border-black rounded-lg p-2 ">
                {userInfo?.age}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Gender</Label>
              <p className="border border-black rounded-lg p-2 ">
                {userInfo?.gender}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Edit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
