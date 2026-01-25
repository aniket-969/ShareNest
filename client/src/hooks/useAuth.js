import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPayment,
  changePassword,
  deletePayment,
  fetchSession,
  loginUser,
  loginWithGoogle,
  logOut,
  refreshTokens,
  registerUser,
  updateNotificationToken,
  updateUser,
} from "@/api/queries/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: fetchSession,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log(data);
      navigate("/login");
    },
    onError: (error) => {
      toast(
        error.response.data.message || " Something went wrong ,Please refresh"
      );
      console.error("Registration failed:", error);
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // console.log(data.data.data);
      localStorage.setItem("session", JSON.stringify(data.data.data));
      queryClient.invalidateQueries(["auth", "session"]);
      navigate("/room");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast(
        error.response.data.message ||
          "Invalid User Credentials , Please login again"
      );
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      localStorage.setItem("session", JSON.stringify(data.data.data));
      queryClient.invalidateQueries(["auth", "session"]);
      navigate("/room");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast(
        error.response.data.message ||
          "Invalid User Credentials , Please login again"
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "session"]);
      localStorage.clear();
      navigate("/login");
    },
    onError: (error) => {
      toast(
        error.response.data.message || " Something went wrong ,Please refresh"
      );
      console.error("Logout error:", error);
    },
  });

  const refreshTokensMutation = useMutation({
    mutationFn: refreshTokens,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["auth", "session"]);
    },
    onError: (error) => {
      console.error("refresh token error:", error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "profile"]);
    },
    onError: (error) => {
      console.error("update user error", error);
    },
  });

  const updateNotificationTokenMutation = useMutation({
    mutationFn: updateNotificationToken,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "profile"]);
    },
    onError: (error) => {
      console.error("update user error", error);
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: addPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "profile"]);
    },
    onError: (error) => {
      console.error("update user error", error);
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: ({ paymentId }) => deletePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "profile"]);
    },
    onError: (error) => {
      console.error("delete payment error", error);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {},
    onError: (error) => {
      console.error("change password error:", error);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast(
        data?.message || "If an account exists, you will receive a reset link."
      );
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
      toast(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast(data?.message || "Password reset successful. Please log in.");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Reset password error:", error);
      toast(
        error.response?.data?.message || "Reset link is invalid or expired."
      );
    },
  });

  return {
    sessionQuery,
    registerMutation,
    loginMutation,
    loginWithGoogleMutation,
    changePasswordMutation,
    refreshTokensMutation,
    logoutMutation,
    updateUserMutation,
    addPaymentMutation,
    deletePaymentMutation,
    updateNotificationTokenMutation,
  };
};
