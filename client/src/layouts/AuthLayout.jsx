import GoogleLogin from "@/components/Auth/googleLogin";
import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const session = localStorage.getItem("session");
 console.log(session)
  return session ? (
    <Navigate to="/room" />
  ) : (
    <div className="flex items-center flex-col gap-6 max-h-screen mt-10">
      
      <Outlet />
      <GoogleLogin/>
    </div>
  );
};

export default AuthLayout;
