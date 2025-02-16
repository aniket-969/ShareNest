import { useEffect } from "react";
import { SignUp } from "@/components/form/RegisterForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Register = () => {
  
  return (
    <>
      <h1 className="text-lg">Register</h1>
      <div className="w-full max-w-[20rem]">
        <SignUp /> 
      </div>

      <div className="flex gap-4 items-center">
        <p>Already have an account?</p>
        <Link to="/login" className="text-muted-foreground text-bold ">
          Login
        </Link>
      </div>
    </>
  );
};

export default Register;
