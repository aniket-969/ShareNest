import { SignIn } from '@/components/form/auth/LoginForm'
import React from 'react'
import { Link } from 'react-router-dom'
 
const Login = () => {
  return (
    <>
     <h1 className='text-lg'>Login</h1>
     <div className="w-full max-w-[20rem] ">
         <SignIn />
      </div>
      
     <div className="flex gap-4 items-center">
        <p>Don't have an account?</p>
        <Link to="/register" className="text-muted-foreground text-bold hover:underline underline-offset-2">
          Register
        </Link>
        
      </div>
          <Link to="/forgot-password" className="text-muted-foreground text-bold text-sm tracking-wide">
        Forgot Password?
      </Link>
    </>
   
  )
}

export default Login