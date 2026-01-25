import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schema/authSchema";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const ForgotPassword = () => {
  const { forgotPasswordMutation } = useAuth();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values)
    return
    try {
      await forgotPasswordMutation.mutateAsync(values);
      toast(
        "If an account exists, you will receive a reset link."
      );
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-32 h-[100vh]">
      <h1 className="text-md">Forgot Password</h1>

      <Card className="w-full max-w-[20rem] px-8 py-6 m-5">
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit" size="sm" className="text-xs mt-5"
              disabled={forgotPasswordMutation.isLoading}
            >
              Send reset link
            </Button>
          </form>
        </Form>
      </Card>

      <div className="mt-4">
        <Link
          to="/login"
          className="text-muted-foreground text-bold"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
