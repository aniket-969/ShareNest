import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";


const GoogleLogin = () => {
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
    <Button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2  border"
    >
      <span className="font-bold text-lg ">G</span>
      <span className="text-sm">Sign in with Google</span>
    </Button>
  );
};

export default GoogleLogin;
