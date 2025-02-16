import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPayment,
  changePassword,
  fetchSession,
  loginUser,
  logOut,
  refreshTokens,
  registerUser,
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

  // Login User Mutation
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

  // Logout Mutation
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

  // Refresh Tokens Mutation
  const refreshTokensMutation = useMutation({
    mutationFn: refreshTokens,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["auth", "session"]);
    },
    onError: (error) => {
      console.error("refresh token error:", error);
    },
  });

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "profile"]);
    },
    onError: (error) => {
      console.error("update user error", error);
    },
  });
  // Update Payment Mutation
  const addPaymentMutation = useMutation({
    mutationFn: addPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "profile"]);
    },
    onError: (error) => {
      console.error("update user error", error);
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth", "profile"]);
    },
    onError: (error) => {
      console.error("change password error:", error);
    },
  });

  return {
    sessionQuery,
    registerMutation,
    loginMutation,
    changePasswordMutation,
    refreshTokensMutation,
    logoutMutation,
    updateUserMutation,
    addPaymentMutation,
  };
};
