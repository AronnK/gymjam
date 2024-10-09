"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/dashboard`,
      },
    });

    if (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="sign up">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Welcome back!</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSignInWithGoogle}>Login with Google</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="sign up">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Hi, welcome to GymJam!</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleSignInWithGoogle}>
              Sign Up with Google
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
