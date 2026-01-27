import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";

const LoginGoogle = () => {
  const { loginWithGoogleMutation } = useAuth();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const idToken = credentialResponse.credential;
        loginWithGoogleMutation.mutate(idToken);
      }}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
};
export default LoginGoogle;