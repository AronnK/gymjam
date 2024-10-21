"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { signInAction, signUpAction } from "@/app/actions";
// import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const router = useRouter();
  const handleSignInWithGoogle = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/dashboard`,
      },
    });

    if (error) {
      console.error("Error logging in:", error.message);
      return { error: error.message };
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Tabs defaultValue="sign-in" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-in">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* <form
                className="flex flex-col gap-4"
                action={signInAction}
                method="POST"
              >
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    required
                  />
                </div>
                <Link
                  className="text-xs text-foreground underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
                <SubmitButton pendingText="Signing In...">Sign In</SubmitButton>
              </form> */}

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500">or</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              <SubmitButton className="w-full" onClick={handleSignInWithGoogle}>
                Login with Google
              </SubmitButton>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sign-up">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account by filling in the details below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* <form
                className="flex flex-col gap-4"
                action={signUpAction}
                method="POST"
              >
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                  />
                </div>
                <SubmitButton pendingText="Signing Up...">Sign Up</SubmitButton>
              </form> */}

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500">or</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              <SubmitButton className="w-full" onClick={handleSignInWithGoogle}>
                Sign Up with Google
              </SubmitButton>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
