import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { z } from "zod";

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
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { resetPasswordSchema } from './../../schema/authSchema';



const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { resetPasswordMutation } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: values.password,
      });

      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast(
        error.response?.data?.message ||
          "Reset link is invalid or expired."
      );
    }
  };

  return (
    <div className="flex flex-col items-center mt-32 h-[100vh]">
      <h1 className="text-md">Reset Password</h1>

      <Card className="w-full max-w-[30rem] px-8 py-8 m-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mx-auto w-full max-w-[20rem]"
          >
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="sm"
              className="text-xs tracking-wide"
              disabled={resetPasswordMutation.isLoading}
            >
              Reset Password
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

export default ResetPassword;
