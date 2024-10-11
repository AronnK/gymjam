"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name must only contain letters." }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username must only contain letters, numbers, and underscores.",
    }),
  age: z.number().lt(150, { message: "Enter a valid age." }),
  height: z.number().nonnegative({ message: "Height cannot be negative." }),
  weight: z.number().nonnegative({ message: "Weight cannot be negative." }),
  gender: z.enum(["M", "F", "Prefer not to mention"], {
    message: "Select a valid gender option.",
  }),
});

export default function SignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      name: "",
      age: undefined,
      height: undefined,
      weight: undefined,
      gender: "Prefer not to mention",
    },
  });

  const [loading, setLoading] = useState(false);

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);

      const bmi = calculateBMI(data.weight, data.height);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData) {
        throw new Error("User is not authenticated.");
      }

      const payload = {
        name: data.name,
        username: data.username,
        height: data.height ?? null,
        weight: data.weight ?? null,
        age: data.age ?? null,
        gender: data.gender ?? null,
        bmi: bmi ?? null,
      };

      if (payload) {
        console.log(payload);
        console.log("payload");
      } else {
        console.log("no payload");
      }
      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userData.user.id);

      if (error) {
        throw error;
      }
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while updating the profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border border-b-slate-950 rounded-lg w-2/3 flex items-center justify-center p-5 ">
        <Form {...form}>
          <form
            className="w-2/3 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Age"
                      {...field}
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Height"
                      {...field}
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Weight"
                      {...field}
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue="Prefer not to mention"
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="M" id="r1" />
                          <Label htmlFor="r1">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="F" id="r2" />
                          <Label htmlFor="r2">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Prefer not to mention"
                            id="r3"
                          />
                          <Label htmlFor="r3">Prefer not to mention</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
