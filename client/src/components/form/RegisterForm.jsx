import { useForm } from "react-hook-form";
import { registerSchema } from "@/schema/authSchema";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { AvatarSelector } from "../AvatarSelector";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";

export const SignUp = () => {
  const { registerMutation } = useAuth();

  const onSubmit = async (values) => {
    console.log(values);
    try {
      await registerMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      avatar: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your fullname" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* avatar */}
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel>Avatar</FormLabel>
              <AvatarSelector onSelect={(url) => field.onChange(url)} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit"  borderRadius="lg" >
          Submit
        </Button>
      </form>
    </Form>
  );
};
