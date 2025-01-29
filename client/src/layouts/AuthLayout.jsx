import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const session = localStorage.getItem("session");

  return session ? (
    <Navigate to="/room" />
  ) : (
    <div className="flex items-center flex-col gap-6 max-h-screen mt-10">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
