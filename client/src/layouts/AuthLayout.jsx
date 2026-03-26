import LoginGoogle from "@/components/Auth/googleLogin";
import React from "react";
import { Button } from "@/components/ui/button";
import { Navigate, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthLayout = () => {
  const session = localStorage.getItem("session");
  console.log(session);

  return session ? (
    <Navigate to="/room" />
  ) : (
    <div className="flex items-center flex-col gap-6 max-h-screen mt-10 px-10">
      <Outlet />
      <LoginGoogle />
    </div>
  );
};

export default AuthLayout;
