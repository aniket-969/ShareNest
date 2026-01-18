import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GoogleLogin } from '@react-oauth/google';

 
const LoginGoogle = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
const {loginWithGoogleMutation} = useAuth()
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   console.log(credential)
    //   const token = credential.accessToken;
    //   const user = result.user;
    //   console.log("Google login success:", user, token);
     const user = result.user;

    // Get the Firebase ID token (this is what your backend expects)
    const idToken = await user.getIdToken();

    // Call your mutation with the idToken
    loginWithGoogleMutation.mutate(idToken);

    console.log("Google login success:", user.email, idToken);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
   
      <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
  );
};

export default LoginGoogle;
